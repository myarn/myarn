import { checksum } from '../../core/myarn.ts';
import { Command } from '../../deps.ts';
export const checksumCmd = new Command<{
  root: string
}>()
  .description('Checksum a resoueces')
  .action(({ root }) => {
    checksum(root);
  });
