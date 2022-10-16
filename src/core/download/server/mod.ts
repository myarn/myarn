import type { ServerClient } from '../../../types/index.ts';
import { DownloadResult } from '../mod.ts';
import { downloadPaperServer } from './paper.ts';
import { downloadPurpurServer } from './purpur.ts';
import { downloadVanillaServer } from './vanilla.ts';

export const downloadServer = async (
  path: string,
  client: {
    type: ServerClient,
    mcVersion: string,
    build?: string
  }
): Promise<ServerDonwloadResult> => {
  switch (client.type) {
    case 'vanilla':
      return await downloadVanillaServer(path, client.mcVersion);
    case 'paper':
      return await downloadPaperServer(path, client.mcVersion, client.build);
    case 'purpur':
      return await downloadPurpurServer(path, client.mcVersion, client.build);
    default:
      throw new Error('Unknown Server Client.');
  }
};

export * from './paper.ts';
export * from './purpur.ts';
export * from './vanilla.ts';

export interface ServerDownloadFunction {
  (path: string, mcVersion: string, buildNumber?: string): Promise<ServerDonwloadResult>;
}

export type ServerDonwloadResult = {
  version: string;
  client: ServerClient;
  build?: string;
} & DownloadResult;
