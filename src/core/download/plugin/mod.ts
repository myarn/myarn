import { PluginPlatform } from '../../../types/index.ts';
import { DownloadResult } from '../mod.ts';

export type ServerDonwloadResult = {
  type: PluginPlatform,
  version: string,
  location: string
} & DownloadResult;
