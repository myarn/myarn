
import { getServerClient } from '../core/download/mod.ts';
import { Select } from '../deps.ts';
import { serverClients, ServerClientType } from '../types/index.ts';

export const serverSelectPrompt = async (
  selectedClient?: ServerClientType,
  selectedVersion?: string,
  selectedBuild?: string
): Promise<{
  client: ServerClientType,
  version: string,
  build?: string
}> => {
  const client = selectedClient || (await Select.prompt({
    message: 'Select server',
    options: [...serverClients]
  })) as ServerClientType;

  const ServerClient = getServerClient(client);

  const availableVersions = selectedVersion ? [] : await ServerClient.getAvailableVersions();
  const version =  selectedVersion || await Select.prompt({
    message: 'Select version',
    options: availableVersions
  });

  const availableBuilds = selectedBuild ? [] : await ServerClient.getAvailableBuilds(version);
  let build: string | undefined = selectedBuild;
  if (availableBuilds.length !== 0) {
    build = await Select.prompt({
      message: 'Select build',
      options: availableBuilds
    });
  }

  return {
    client,
    version,
    build
  };
}