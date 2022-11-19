import { join } from '../../../deps.ts';
import { request } from '../../../utils/mod.ts';
import { download } from '../../../utils/download.ts';
import { ServerClient } from './ServerClient.ts';
import { ServerDownloadResult } from './mod.ts';

export class Paper extends ServerClient { 
  static getAvailableVersions (): Promise<string[]> {
    return new Promise(resolve => resolve([...AVAILABLE_VERSION]));
  }

  static async getAvailableBuilds(version: string) {
    return (await getPaperBuilds(version)).builds.map(build => ({
      name: `${build.version} (#${build.build})`,
      value: `${build.build}`
    })).reverse();
  }

  async downloadServer(path: string, mcVersion: string, buildNumber?: string): Promise<ServerDownloadResult> {
    const versionGroup = trimVersion(mcVersion);

    const { builds } = await getPaperBuilds(versionGroup);
    
    const build = buildNumber == undefined
      ? builds[builds.length - 1]
      : builds.find<Build>((b): b is Build => `${b.build}` == buildNumber);
  
    if (!build) throw new Error(`I couldn't find that version${mcVersion} and build(${mcVersion}) of the server.`);
    if (trimVersion(build.version) !== versionGroup) throw new Error(`The version received did not match the version of the build.`);
  
    const filePath = join(path, `paper_${build.version}_${build.build}.jar`);
    const { hash } = await download(getPaperDownloadURL(build), filePath, {
      algorithm: 'sha256',
      value: build.downloads.application.sha256
    });

    return {
      filePath,
      version: mcVersion,
      client: 'paper',
      build: build.build+'',
      hash: {
        algorithm: 'sha256',
        value: hash
      }
    };
  }
}

const trimVersion = (version: string) => version.split('.').slice(0, 2).join('.');
const getPaperDownloadURL = (build: Build) => `https://api.papermc.io/v2/projects/paper/versions/${build.version}/builds/${build.build}/downloads/${build.downloads.application.name}`;

export const getPaperBuilds = async (versionGroup: AvailableVersion) => {
  const response = await request(`https://api.papermc.io/v2/projects/paper/version_group/${versionGroup}/builds`);
  return response.json() as Promise<PaperVersion>;
}

export const AVAILABLE_VERSION = [
  '1.19',
  '1.18',
  '1.17',
  '1.16',
  '1.15',
  '1.14',
  '1.13',
  '1.12',
  '1.11',
  '1.10',
  '1.9',
  '1.8'
] as const;

export type AvailableVersion = typeof AVAILABLE_VERSION[number] | (string & Record<never, never>);

export type PaperVersion = {
  builds: Build[],
  project_id: string,
  project_name: string,
  version_group: string,
  versions: string[]
};

type Build = {
  build: number,
  changes: CommitChanges[],
  downloads: {
    application: {
      name: string,
      sha256: string
    }
  },
  channel: string,
  promoted: boolean,
  time: string,
  version: string
};

type CommitChanges = {
  commit: string,
  message: string,
  summary: string
};
