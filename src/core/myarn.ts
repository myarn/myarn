import { DEFAULT_CONFIG_FILES } from '../constants.ts';
import { downloadServer, ServerDownloadResult } from './download/server/mod.ts';
import { join, YAML } from '../deps.ts';
import { MyarnConfig, MyarnLock } from '../types/myarn.ts';
import { ServerClientType } from '../types/index.ts';
import { isFile, throwErrorIfFileNotExist, DeepPartial } from '../utils/mod.ts';

export class ConfigFile {
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

  async save () {
    if (!this.filePath) return;

    await Deno.writeTextFile(this.filePath, YAML.stringify(this.config));
  }
}

export class LockFile {
  static lockfilename = 'myarn.lock.yaml';
  static currentLockfileVersion = 1;

  protected filePath: string | null;
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
    if (!this.filePath) return;

    await Deno.writeTextFile(this.filePath, YAML.stringify(this.lockfile, {
      skipInvalid: true
    }), {
      create: true
    });
  }
}

export default class Myarn {
  static ConfigFile = ConfigFile;
  static LockFile = LockFile;

  configFile: ConfigFile;
  lockFile: LockFile;

  constructor (
    protected directory: string
  ) {
    this.configFile = new Myarn.ConfigFile(directory);
    this.lockFile = new Myarn.LockFile(directory);
  }

  async installServer (type: ServerClientType, mcVersion: string, build?: string) {
    const result = await downloadServer(this.directory, { type, mcVersion, build });

    this.configFile.setServer({
      client: result.client,
      version: result.version,
      build: result.build
    });
    this.lockFile.setServer(result);

    await this.configFile.save();
    await this.lockFile.save();

    return result;
  }

  
}
