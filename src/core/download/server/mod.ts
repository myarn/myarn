import type { ServerClientType } from '../../../types/index.ts';
import { DownloadResult } from '../mod.ts';
import { Paper } from './paper.ts';
import { Purpur } from './purpur.ts';
import { Vanilla } from './vanilla.ts';

export const downloadServer = (
  path: string,
  client: {
    type: ServerClientType,
    mcVersion: string,
    build?: string
  }
): Promise<ServerDownloadResult> => {
  return (new (getServerClient(client.type))).downloadServer(path, client.mcVersion, client.build);
};

export const getServerClient = (clientType: ServerClientType) => {
  switch (clientType) {
    case 'vanilla':
      return Vanilla;
    case 'paper':
      return Paper;
    case 'purpur':
      return Purpur;
    default:
      throw new Error('Unknown Server Client.');
  }
}

export * from './paper.ts';
export * from './purpur.ts';
export * from './vanilla.ts';

export interface ServerDownloadFunction {
  (path: string, mcVersion: string, buildNumber?: string): Promise<ServerDownloadResult>;
}

export type ServerDownloadResult = {
  version: string,
  client: ServerClientType,
  build?: string
} & DownloadResult;
