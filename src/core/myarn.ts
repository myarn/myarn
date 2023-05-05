import './loadEnv.ts';

import { getDownloadRequest, getName } from './download/mod.ts';
import { MyarnMetadata } from './config.ts';
import { ResourceLocation, isFile } from '../utils/mod.ts';
import { ensureDir, Table, Download, HashTransformStream, DownloadProgressStream, basename, Projector, colors } from '../deps.ts';
import { RawResourceLocation } from '../utils/ResourceLocation.ts';
import { Hasher } from 'https://raw.githubusercontent.com/myarn/hashed_potato/0.0.2/Hasher.ts';

export const download = async (from: ResourceLocation, to: URL, projector: Projector = new Projector()): Promise<string> => {
  const request = await getDownloadRequest(from, 'paper');
  const response = await fetch(request);

  const contentLength = response.headers.get('Content-Length');

  if (!response.body) throw new Error(`response has no body(${request.url})`);
  if (!contentLength) throw new Error(`response has no Content-Length header`);

  const hasherStream = new HashTransformStream('SHA-512');
  const progressBarStream = new DownloadProgressStream(basename(to.pathname), 0, Number(contentLength), projector);

  await new Download(response.body)
    .pipeThrough(hasherStream)
    .pipeThrough(progressBarStream)
    .downloadTo(to);

  return hasherStream.digest('hex');
};

export const getTargetResources = (resourceLocationStrings: string[], metadata: MyarnMetadata) => 
  resourceLocationStrings.length !== 0
    // リソースをそのままパースする
    ? resourceLocationMapping(resourceLocationStrings)
    // プラグインが一個も渡されなかった場合myarn.yamlから取得してくる
    : metadata.getResourceLocations('plugins/');
export const resourceLocationMapping = (raws: RawResourceLocation[]): ResourceLocation[] => raws.map<ResourceLocation>(raw => new ResourceLocation(raw));
export const showResourceTable = (resourceLocations: ResourceLocation[]) => new Table()
  .header(['Platform', 'Location', 'Version'])
  .body(resourceLocations.map(rl => [ rl.platform, rl.location, rl.version ]))
  .render();

// TODO: metadataから読み込んでインストールするときはハッシュチェックをする
export const installPlugins = async (directory: URL, resourceLocationStrings: string[]) => {
  const metadata = new MyarnMetadata(directory);
  const pluginsDirectory = metadata.getServerDirecory('plugins/');
  ensureDir(pluginsDirectory);

  const resourceLocations = getTargetResources(resourceLocationStrings, metadata);

  showResourceTable(resourceLocations);

  const projector = new Projector();

  for (const location of resourceLocations) {
    const name = getName(location);
    const fileName = `${name}.jar`;

    await download(location, new URL(fileName, pluginsDirectory), projector).then((hash) => {
      metadata.addResource('plugins/', location, fileName, hash);
    });
  }

  await metadata.save();
};

export const showPlugins = (directory: URL) => {
  const metadata = new MyarnMetadata(directory);

  const resourceLocations = metadata.getResourceLocations('plugins/');

  showResourceTable(resourceLocations);
};

export const checksum = async (directory: URL) => {
  const metadata = new MyarnMetadata(directory);
  const resources = metadata.getResourceLocations('plugins/');

  let hasError = false;

  const projector = new Projector();

  for (const resource of resources) {
    if (isFile(resource.url)) {
      const file = await Deno.open(resource.url, { read: true });
      const hasher = new Hasher('SHA-512');
      await hasher.updateByReadableStream(file.readable);
      const hash = hasher.digest('hex');

      if (hash == resource.hash) {
        projector.addLine(line => line.addText(`[${colors.green('✔')}] ${basename(resource.url.pathname)} is unchanged`));
      } else {
        projector.addLine(line => line.addText(`[${colors.red('✘')}] ${basename(resource.url.pathname)} is changed`));
        hasError = true;
      }
    } else {
      projector.addLine(line => line.addText(`[${colors.red('✘')}] ${basename(resource.url.pathname)} is lost`));
      hasError = true;
    }
  }

  if (hasError) Deno.exit(1);
};
