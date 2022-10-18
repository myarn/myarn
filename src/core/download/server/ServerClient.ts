import { ServerDownloadResult } from "./mod.ts";

export abstract class ServerClient {
  static getAvailableVersions(): Promise<string[]> {
    return new Promise((resolve) => resolve([]));
  }

  static getAvailableBuilds(_version: string): Promise<{
    name: string,
    value: string
  }[]> {
    return new Promise((resolve) => resolve([]));
  }

  abstract downloadServer (path: string, version: string, build?: string): Promise<ServerDownloadResult>;
}
