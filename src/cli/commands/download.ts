import { Command, EnumType } from '../../deps.ts';
import { serverClients } from '../../types/index.ts';
import { downloadServer } from "../../core/download/server/mod.ts";

const client = new EnumType(serverClients);

export const server = new Command()
  .description('donwload server')
  .type('client', client)
  .arguments('<client:client> <version:string> [build]')
  .action(async (_, client, version, build) => {
    await downloadServer(Deno.cwd(), {
      type: client,
      mcVersion: version,
      build
    });
  });

export const download = new Command()
  .description('download assets')
  .command('server', server)
  .command('list', 'list of support server client.');
