import { downloadServer as downloadServerAPI } from '../core/download/server/mod.ts';

export const downloadServer = (...args: Parameters<typeof downloadServerAPI>) => {
  return downloadServerAPI(...args);
};
