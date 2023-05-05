import { MyarnMetadata } from '../../core/config.ts';
import { getName } from '../../core/download/mod.ts';
import { getTargetResources } from '../../core/myarn.ts';
import { Projector, DownloadProgressStream, ensureDir } from '../../deps.ts';

import { ResourceWithDisplay, download } from './mod.ts';


export const installResources = async (directory: URL, resourceLocationStrings: string[]) => {
  const metadata = new MyarnMetadata(directory);
  const projector = new Projector();

  const resourceLocations = getTargetResources(resourceLocationStrings, metadata);
  const resourceAndProgresses = resourceLocations.map<
    ResourceWithDisplay<DownloadProgressStream>
  >((resource) => {
    const name = getName(resource);
    const fileName = `${name}.jar`;

    const downloadProgressStream = new DownloadProgressStream(fileName, 0, 1, projector);

    return {
      display: downloadProgressStream,
      resource
    };
  });

  const pluginsDirectory = metadata.getServerDirecory('plugins/');
  await ensureDir(pluginsDirectory);

  for (const resourceAndProgress of resourceAndProgresses) {
    const name = getName(resourceAndProgress.resource);
    const fileName = `${name}.jar`;

    await download(resourceAndProgress, new URL(fileName, pluginsDirectory)).then((hash) => {
      metadata.addResource('plugins/', resourceAndProgress.resource, fileName, hash);
    });
  }

  await metadata.save();
}