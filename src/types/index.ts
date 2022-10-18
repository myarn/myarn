import { SupportedAlgorithm } from '../deps.ts';

export const serverClients = [ 'vanilla', 'paper', 'purpur'] as const;
export type ServerClientType = typeof serverClients[number];

export const pluginPlatforms = [ 'github' ] as const;
export type PluginPlatform = typeof pluginPlatforms[number];

export type HashAlgorithm = SupportedAlgorithm;

export * from './myarn.ts';
