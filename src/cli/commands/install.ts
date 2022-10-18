import { Command, EnumType, Select } from '../../deps.ts';
import { ServerClientType, serverClients } from '../../types/index.ts';
import Myarn from '../../core/myarn.ts';
import { Octokit } from '../../deps.ts';
import { getServerClient } from '../../core/download/mod.ts';

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
  .arguments('[client:client] [version:string] [build]')
  .action(async ({ root }, client, version, build) => {
    const myarn = new Myarn(root);

    if (!client) {
      client = (await Select.prompt({
        message: 'Select server',
        options: [...serverClients]
      })) as ServerClientType;
    }

    const ServerClient = getServerClient(client);

    if (!version) {
      const availableVersions = await ServerClient.getAvailableVersions();
      version = await Select.prompt({
        message: 'Select version',
        options: availableVersions
      });
    }

    if (!build) {
      const availableBuilds = await ServerClient.getAvailableBuilds(version);
      if (availableBuilds.length !== 0) {
        build = await Select.prompt({
          message: 'Select build',
          options: availableBuilds
        });
      }
    }

    await myarn.installServer(client, version, build);
  });
