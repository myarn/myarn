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

  protected serverFilePath: URL;
  protected server: MyarnServer;

  constructor (
    readonly directory: URL,
  ) {
    this.serverFilePath = new URL(MyarnMetadata.serverFileName, directory);

    // ServerConfigFile
    if (isFile(this.serverFilePath)) {
      this.server = YAML.parse(Deno.readTextFileSync(this.serverFilePath)) as MyarnServer;
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

  getDirecotry (path?: string): URL {
    return path
      ? new URL(path, this.directory)
      : this.directory
  }

  getServerDirecory (path: string): URL {
    return new URL(path, this.getDirecotry(this.server.serverDirectory));
  }

  getResources () {
    return this.server.resources;
  }

  getResourceLocations (resourcesDirectory: string) {
    return Object.entries(this.getResources()[resourcesDirectory] || {})
      .map<ResourceWithDetails>(([key, raw]) => {
        const locationPath = new URL(this.getServerDirecory(`${resourcesDirectory}${key}`, ), 'file://');
        return new ResourceWithDetails(raw, locationPath, raw.hash);
      });
  }

  async save () {
    deleteUndefinedKeys(this.server);
    await Deno.writeTextFile(this.serverFilePath, YAML.stringify(this.server as unknown as Record<string, unknown>, {
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
