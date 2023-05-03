import { checksum } from '../../core/myarn.ts';
import { Command } from '../../deps.ts';
import type { MyarnGlobalOptions } from './index.ts';

export const checksumCmd = new Command<MyarnGlobalOptions>()
  .description('Checksum a resoueces')
  .action(({ root }) => {
    checksum(root);
  });
