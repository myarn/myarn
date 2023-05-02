import { showPlugins } from '../../core/myarn.ts';
import { Command } from '../../deps.ts';
export const show = new Command<{
  root: string
}>()
  .description('Show installed plugins')
  .action(({ root }) => {
    showPlugins(root);
  });
