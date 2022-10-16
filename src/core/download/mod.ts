import { HashAlgorithm } from '../../types/index.ts';

export * from './server/mod.ts';
export * from './plugin/mod.ts';

export type DownloadResult = {
  filePath: string;
  hash: {
    algorithm: HashAlgorithm;
    value: string;
  }
};
