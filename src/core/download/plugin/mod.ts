import { PluginPlatform } from '../../../types/index.ts';
import { DownloadResult } from '../mod.ts';

export type PluginDonwloadResult = {
  type: PluginPlatform,
  version: string,
  location: string
} & DownloadResult;
