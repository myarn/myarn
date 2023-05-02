import { join, YAML } from '../deps.ts';
import { deleteUndefinedKeys, isFile, ResourceWithDetails,  } from '../utils/mod.ts';
import { ResourceLocation } from '../utils/ResourceLocation.ts';

export interface MyarnServer {
  fileVersion: number;
  serverDirectory?: string; 
  resources: Record<string, Record<string, {
    platform: string;
    location: string;
    version: string;
    hash: string;
  }>>;
}

export class MyarnMetadata {
  static lockfileName = 'myarn.lock.yaml';
  static serverFileName = 'myarn.yaml';
  static currentFileVersion = 1;

  protected serverFileName: string;
  protected server: MyarnServer;

  constructor (
    readonly directory: string,
  ) {
    this.serverFileName = join(directory, MyarnMetadata.serverFileName);

    // ServerConfigFile
    if (isFile(this.serverFileName)) {
      this.server = YAML.parse(Deno.readTextFileSync(this.serverFileName)) as MyarnServer;
    } else {
      this.server = {
        fileVersion: MyarnMetadata.currentFileVersion,
        resources: {}
      }
    }
  }

  addResource (directory: string, pluginLocation: ResourceLocation, name: string, hash: string) {
    if(!this.server.resources[directory]) this.server.resources[directory] = {};

    this.server.resources[directory][name] ={
      platform: pluginLocation.platform,
      location: pluginLocation.location,
      version: pluginLocation.version,
      hash
    };
  }

  getDirecotry (...paths: string[]): string {
    return paths.length === 0
      ? this.directory
      : join(this.directory, ...paths);
  }

  getServerDirecory (...paths: string[]): string {
    return this.getDirecotry(this.server.serverDirectory || '', ...paths);
  }

  getResources () {
    return this.server.resources;
  }

  getResourceLocations (resourcesDirectory: string) {
    return Object.entries(this.getResources()[resourcesDirectory] || {})
      .map<ResourceWithDetails>(([key, raw]) => {
        const locationPath = new URL(this.getServerDirecory(resourcesDirectory, key), 'file://');
        return new ResourceWithDetails(raw, locationPath, raw.hash);
      });
  }

  async save () {
    deleteUndefinedKeys(this.server);
    await Deno.writeTextFile(this.serverFileName, YAML.stringify(this.server as unknown as Record<string, unknown>, {
      skipInvalid: true
    }), {
      create: true
    });
  }

  toJSON () {
    return this.server;
  }

  toString () {
    return JSON.stringify(this.toJSON());
  }
}
