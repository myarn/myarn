import { join } from '../../../deps.ts';
import { download, request } from '../../../utils/mod.ts';
import { ServerDownloadResult } from './mod.ts';
import { ServerClient } from './ServerClient.ts';

export class Purpur extends ServerClient { 
  static async getAvailableVersions (): Promise<string[]> {
    return await (await getAvailableVersions()).versions.reverse();
  }

  static async getAvailableBuilds(version: string) {
    return (await getPurpurVersion(version)).builds.all.map(build => ({
      name: `${version} (#${build})`,
      value: build
    })).reverse();
  }

  async downloadServer(path: string, mcVersion: string, buildNumber = 'latest'): Promise<ServerDownloadResult> {
    const build = await getPurpurBuild(mcVersion, buildNumber);
    const filePath = join(path, `purpur_${build.version}_${build.build}.jar`);
    const { hash } = await download(getPurpurDownloadURL(build), filePath, {
      algorithm: 'md5',
      value: build.md5
    });

    return {
      filePath,
      client: 'purpur',
      build: build.build,
      version: build.version,
      hash: {
        algorithm: 'md5',
        value: hash
      }
    };
  }
}


export const getAvailableVersions = async () => (await (await request(`https://api.purpurmc.org/v2/purpur`)).json()) as PurpurAvailableVersions;
export const getPurpurVersion = async (version: string) => (await (await request(`https://api.purpurmc.org/v2/purpur/${version}`)).json()) as PurpurVersion;
export const getPurpurBuild = async (version: string, build: string) => (await (await request(`https://api.purpurmc.org/v2/purpur/${version}/${build}`)).json()) as PurpurBuild;
export const getPurpurDownloadURL = ({build, version}: PurpurBuild) => `https://api.purpurmc.org/v2/purpur/${version}/${build}/download`;

export type PurpurAvailableVersions = {
  project: string;
  versions: string[]
};

export type PurpurVersion = {
  builds: {
    all: string[],
    latest: string
  },
  project: string,
  version: string
};

export type PurpurBuild = {
  build: string,
  commits: PurpurCommits[],
  duration: 44759,
  md5: string,
  project: string;
  result: string,
  timestamp: number,
  version: string
};

export interface PurpurCommits {
  author: string;
  description: string;
  email: string;
  hash: string;
  timestamp: number;
}
