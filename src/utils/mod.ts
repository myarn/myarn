export const isFile = (path: string): boolean => {
  try {
    const info = Deno.statSync(path);
    return info.isFile;
  } catch (_e) {
    return false;
  }
}

export const throwErrorIfFileNotExist = (path: string) => {
  if (!isFile(path)) throw new Error(`${path} is not exist!`)
};

export type DeepPartial<T> = {
  [P in keyof T]?: Extract<T[P], Record<never, never>> extends Record<never, never> ? DeepPartial<T[P]> : T[P];
};

export * from './request.ts';
export * from './namedDownload.ts';
export * from './streamAsyncIterator.ts';
