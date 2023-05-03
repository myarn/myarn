import { MyarnMetadata } from '../../core/config.ts';
import { Command } from '../../deps.ts';
import { MyarnGlobalOptions } from './index.ts';

export const metadata = new Command<MyarnGlobalOptions>()
  .description('Show Myarn\'s metadata')
  .action(({ root }) => {
    const myarnMetadata = new MyarnMetadata(root)

    console.log(myarnMetadata.toString());
  });
