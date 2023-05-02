import { installPlugins } from '../../core/myarn.ts';
import { Command, EnumType } from '../../deps.ts';
import { serverClients } from '../../types/index.ts';

const client = new EnumType(serverClients);

export const install = new Command<{
    root: string
}>()
  .description('Install server client, plugins.')
  .alias('i')
  .alias('add')

  // server install
  .command('server')
  .alias('s')
  .description('Install server')
  .type('client', client)
  .arguments('[client:client] [version:string] [build]')
  .action(async ({ root }, client, version, build) => {
    // const myarn = new Myarn(root);
    // ({ client, version, build } = await serverSelectPrompt());

    // await myarn.installServer(client, version, build);
  })

  // Plugin Install
  .command('plugin')
  .description('Install Plugin')
  .arguments('[plugins...]')
  .action(async ({ root }, ...plugins) => {
    await installPlugins(root, plugins);
  })


