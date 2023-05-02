import { deleteUndefinedKeys } from "./mod.ts";

export type VersionString = 'latest' | (string & Record<never, never>);
export type RawResourceLocation = 
string | {
  platform: string;
  location: string;
  version: VersionString;
};

export type ResourceLocationDefaultOption =  {
  platform?: string
  version?: VersionString
}

export class ResourceLocation {
  platform: string;
  location: string;
  version: VersionString;

  constructor (ResourceLocation: RawResourceLocation, _options?: ResourceLocationDefaultOption) {
    const options = Object.assign(
      {
        platform: 'github',
        version: 'latest'
      },
      _options
    );

    if (typeof ResourceLocation === 'string') {
      const matchResult = ResourceLocation.match(/(?:(?<platform>\w+)\:)?(?<location>[\w\/\-]+)(?:@(?<version>[\w\.]+))?/);

      if (!matchResult) throw new Error(`string(${ResourceLocation}) dosen't match ResourceLocation`);

      const { groups } = matchResult;

      const result = Object.assign(options, deleteUndefinedKeys({
        platform: groups?.platform!,
        location: groups?.location!,
        version: groups?.version!
      }));

      this.platform = result.platform;
      this.location = result.location;
      this.version = result.version;
    } else {
      this.platform = ResourceLocation.platform;
      this.location = ResourceLocation.location;
      this.version = ResourceLocation.version;
    }
  }

  toString () {
    return `${this.platform}:${this.location}@${this.version}`;
  }
}