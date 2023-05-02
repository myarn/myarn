import { MyarnMetadata } from '../../core/config.ts';
import { Command } from '../../deps.ts';

export const metadata = new Command<{
  root: string
}>()
  .description('Show Myarn\'s metadata')
  .action(({ root }) => {
    const myarnMetadata = new MyarnMetadata(root)

    console.log(myarnMetadata.toString());
  });
