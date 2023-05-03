import { showPlugins } from '../../core/myarn.ts';
import { Command } from '../../deps.ts';
import { MyarnGlobalOptions } from './index.ts';

export const show = new Command<MyarnGlobalOptions>()
  .description('Show installed plugins')
  .action(({ root }) => {
    showPlugins(root);
  });
