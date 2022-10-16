import { Command, EnumType } from '../../deps.ts';
import { serverClients } from '../../types/index.ts';
import Myarn from '../../core/myarn.ts';

const client = new EnumType(serverClients);

export const install = new Command<{
    root: string
  }>()
  .description('Install server client, plugins.')
  .alias('i')
  .alias('add')

  // server install
  .command('server')
  .description('Install server')
  .type('client', client)
  .arguments('<client:client> <version:string> [build]')
  .action(async ({ root }, client, version, build) => {
    const myarn = new Myarn(root);

    await myarn.installServer(client, version, build);
  });
