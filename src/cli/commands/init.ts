import { Command, Confirm } from '../../deps.ts';
import { MyarnGlobalOptions } from './index.ts';

export const init = new Command<MyarnGlobalOptions>()
  .description('Init directory.')
  .action(async ({ root }) => {
    // const myarn = new Myarn(root);

    // if (myarn.serverConfigFile.exist()) {
    //   await Confirm.prompt({
    //     message: 'File myarn.yaml aleardy exist. Overwrite file?',
    //     default: false
    //   }) || Deno.exit();
    // }

    // const serverInfo = await serverSelectPrompt();

    // console.log('Initialization complete.');
  });
