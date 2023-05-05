import { getDownloadRequest } from '../../core/download/mod.ts';
import { Download, DownloadProgressStream, HashTransformStream } from '../../deps.ts';
import { ResourceWithDisplay } from './mod.ts';

export const download = async (resourceAndProgress: ResourceWithDisplay<DownloadProgressStream>, to: URL): Promise<string> => {
  const request = await getDownloadRequest(resourceAndProgress.resource, 'paper');
  const response = await fetch(request);

  const contentLength = response.headers.get('Content-Length');

  if (!response.body) throw new Error(`response has no body(${request.url})`);
  if (!contentLength) throw new Error(`response has no Content-Length header`);

  const hasherStream = new HashTransformStream('SHA-512');
  resourceAndProgress.display.progress.updateFilesize(Number(contentLength));

  await new Download(response.body)
    .pipeThrough(hasherStream)
    .pipeThrough(resourceAndProgress.display)
    .downloadTo(to);

  return hasherStream.digest('hex');
};
