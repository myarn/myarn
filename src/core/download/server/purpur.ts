import { join } from '../../../deps.ts';
import { namedDownload, request } from '../../../utils/mod.ts';
import { ServerDownloadFunction } from './mod.ts';

export const downloadPurpurServer: ServerDownloadFunction = async (path, mcVersion, buildNumber = 'latest') => {

  const build = await getPurpurBuild(mcVersion, buildNumber);
  const filePath = join(path, `purpur_${build.version}_${build.build}.jar`);
  const { hash } = await namedDownload(getPurpurDownloadURL(build), filePath, {
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
  }
}

export const getPurpurVersion = async (version: string) => (await (await request(`https://api.purpurmc.org/v2/purpur/${version}`)).json()) as PurpurVersion;
export const getPurpurBuild = async (version: string, build: string) => (await (await request(`https://api.purpurmc.org/v2/purpur/${version}/${build}`)).json()) as PurpurBuild;
export const getPurpurDownloadURL = ({build, version}: PurpurBuild) => `https://api.purpurmc.org/v2/purpur/${version}/${build}/download`;

export interface PurpurVersion {
  builds: {
    all: string[];
    latest: string
  };
  project: string;
  version: string;
}

export interface PurpurBuild {
  build: string;
  commits: PurpurCommits[];
  duration: 44759;
  md5: string;
  project: string;
  result: string;
  timestamp: number;
  version: string;
}

export interface PurpurCommits {
  author: string;
  description: string;
  email: string;
  hash: string;
  timestamp: number;
}
