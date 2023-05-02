import type { ServerClientType } from '../../../types/index.ts';
import Myarn from '../../myarn.ts';
import { DownloadResult } from '../mod.ts';
import { Paper } from './paper.ts';
import { Purpur } from './purpur.ts';
import { ServerClient } from './ServerClient.ts';
import { Vanilla } from './vanilla.ts';

export const downloadServer = (
  myarn: Myarn,
  client: {
    type: ServerClientType,
    mcVersion: string,
    build?: string
  }
): Promise<ServerDownloadResult> => {
  return (new (getServerClient(client.type))(myarn)).downloadServer(myarn.directory, client.mcVersion, client.build);
};

export const getServerClient = (clientType: ServerClientType): new(myarn: Myarn) => ServerClient => {
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
