export const isFile = (path: string | URL): boolean => {
  try {
    const info = Deno.statSync(path);
    return info.isFile;
  } catch (_e) {
    return false;
  }
};

export const throwErrorIfFileNotExist = (path: string) => {
  if (!isFile(path)) throw new Error(`${path} is not exist!`);
};

export const deleteUndefinedKeys =  <T extends Record<any, any>>(obj: T) =>  {
  for (const key of Object.keys(obj)) 
  if (typeof obj[key] === 'object') deleteUndefinedKeys(obj[key]);
  else if (typeof obj[key] === 'undefined') delete obj[key];

  return obj;
};

export type DeepPartial<T> = {
  [P in keyof T]?: Extract<T[P], Record<never, never>> extends Record<never, never> ? DeepPartial<T[P]> : T[P];
};

export * from './ResourceLocation.ts';
export * from './Resource.ts';
export * from './request.ts';
