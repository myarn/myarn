import { createHash } from '../deps.ts';
import { HashAlgorithm } from '../types/index.ts';
import { streamAsyncIterator, request } from './mod.ts';


export async function namedDownload(remoteURL: string, name: string): Promise<{ hash: void }>;
export async function namedDownload(remoteURL: string, name: string, hash: { algorithm: HashAlgorithm, value?: string }): Promise<{ hash: string }>;

export async function namedDownload(
  remoteURL: string,
  path: string,
  hash?: {
    algorithm: HashAlgorithm, value?: string
  }
) {
  const response = await request(remoteURL);
  const file = await Deno.open(path, { create: true, write: true });
  let hashResult: string | void = void 0;

  if (!response.body) throw new Error('Response did not contain body.');

  if (hash) {
    const hasher = createHash(hash.algorithm);
    for await (const chunk of streamAsyncIterator(response.body)) {
      hasher.update(chunk);
      file.write(chunk);
    }

    hashResult = digestToHex(hasher.digest());

    file.close();

    if (hash.value && hash.value !== hashResult) {
      await Deno.remove(path);
      throw new Error(`Failed checksum. Expected ${hash.value}. But got ${hashResult}`);
    }
  } else {
    await response.body.pipeTo(file.writable);
  }

  return {
    hash: hashResult
  };
}

export const digestToHex = (arr: ArrayBuffer) => Array.from(new Uint8Array(arr)).map(b => b.toString(16).padStart(2, '0')).join('');
