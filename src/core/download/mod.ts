import { ResourceLocation } from '../../utils/mod.ts';
import github from './github/mod.ts';

export const supportDonloadPlatforms = [ 'github' ] as const;
export type SupportDownloadPlatforms = typeof supportDonloadPlatforms[number];

export const LOADERS = [ 'spigot', 'paper', 'forge' ] as const;
export type Loader = typeof LOADERS[number];

export interface DownloadPlatform {
  getDownloadRequest (resourceLocation: ResourceLocation, loader: Loader): Promise<Request>;
  getName (resourceLocation: ResourceLocation): string;
  getLatestVersion (resourceLocation: ResourceLocation): Promise<string>;
}

export const getDownloadPlatform = (resourceLocation: ResourceLocation): DownloadPlatform => {
  switch (resourceLocation.platform) {
    case 'github':
      return github;

    default:
      throw new Error(`Unknown downloadPlatform ${resourceLocation.platform}`);
  }
}

export const getDownloadRequest = (resourceLocation: ResourceLocation, loader: Loader): Promise<Request> => {
  return getDownloadPlatform(resourceLocation).getDownloadRequest(resourceLocation, loader);
};


export const getName = (resourceLocation: ResourceLocation): string => {
  return getDownloadPlatform(resourceLocation).getName(resourceLocation);
};
