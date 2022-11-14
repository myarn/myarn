import { DEFAULT_CONFIG_FILES } from '../constants.ts';
import { downloadServer, ServerDownloadResult } from './download/server/mod.ts';
import { join, YAML } from '../deps.ts';
import { MyarnConfig, MyarnLock } from '../types/myarn.ts';
import { ServerClientType } from '../types/index.ts';
import { isFile, throwErrorIfFileNotExist, DeepPartial, deleteUndefinedKeys } from '../utils/mod.ts';

export class ServerConfigFile {
  protected filePath: string | null;
  protected config: DeepPartial<MyarnConfig> = {};

  constructor (
    protected directory: string,
    configFile?: string
  ) {
    let resolvedPath: string | null = null;

    if (configFile) {
      resolvedPath = join(directory, configFile);
      throwErrorIfFileNotExist(resolvedPath)
    } else {
      for (const file of DEFAULT_CONFIG_FILES) {
        if (isFile(file)) {
          resolvedPath = file;
          break;
        }
      }
    }

    this.filePath = resolvedPath;

    this.load();
  }

  load () {
    if (this.filePath) {
      this.config = YAML.parse(
        Deno.readTextFileSync(this.filePath)
      ) as DeepPartial<MyarnConfig> || {};
    }
  }

  setServer (server: MyarnConfig['server']) {
    this.config.server = server;
  }

  exist (): boolean {
    return !!this.filePath && isFile(this.filePath);
  }

  async save () {
    if (!this.filePath) return;
  
    deleteUndefinedKeys(this.config);
    await Deno.writeTextFile(this.filePath, YAML.stringify(this.config));
  }
}

export class LockFile {
  static lockfilename = 'myarn.lock.yaml';
  static currentLockfileVersion = 1;

  protected filePath: string;
  protected lockfile: DeepPartial<MyarnLock> = {
    lockfileVersion: LockFile.currentLockfileVersion
  };

  constructor (
    protected directory: string,
  ) {
    this.filePath = join(directory, LockFile.lockfilename);
    
    if (!isFile(this.filePath)) {
      this.lockfile.lockfileVersion = LockFile.currentLockfileVersion;
    } else {
      const file = YAML.parse(Deno.readTextFileSync(this.filePath)) as MyarnLock;

      this.lockfile.lockfileVersion = file.lockfileVersion;
      this.lockfile.server = file.server;
    }
  }

  load () {
    if (!this.filePath || !isFile(this.filePath)) return;

    const file = YAML.parse(Deno.readTextFileSync(this.filePath)) as MyarnLock;

    this.lockfile.lockfileVersion = file.lockfileVersion;
    this.lockfile.server = file.server;
  }

  setServer (downloadResult: ServerDownloadResult) {
    this.lockfile.server = {
      client: downloadResult.client,
      file: downloadResult.filePath,
      build: downloadResult.build,
      integrity: `${downloadResult.hash.algorithm}-${downloadResult.hash.value}`,
      version: downloadResult.version
    };
  }

  async save () {
    deleteUndefinedKeys(this.lockfile);
    await Deno.writeTextFile(this.filePath, YAML.stringify(this.lockfile, {
      skipInvalid: true
    }), {
      create: true
    });
  }
}

export class Config {
  
}

export default class Myarn {
  static ServerConfigFile = ServerConfigFile;
  static LockFile = LockFile;

  serverConfigFile: ServerConfigFile;
  lockFile: LockFile;

  constructor (
    protected directory: string
  ) {
    this.serverConfigFile = new Myarn.ServerConfigFile(directory);
    this.lockFile = new Myarn.LockFile(directory);
  }

  async installServer (type: ServerClientType, mcVersion: string, build?: string) {
    const result = await downloadServer(this.directory, { type, mcVersion, build });

    this.serverConfigFile.setServer({
      client: result.client,
      version: result.version,
      build: result.build
    });
    this.lockFile.setServer(result);

    await this.serverConfigFile.save();
    await this.lockFile.save();

    return result;
  }
}
