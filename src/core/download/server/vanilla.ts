
import { join } from '../../../deps.ts';
import { request, namedDownload } from '../../../utils/mod.ts';
import { ServerClient } from './ServerClient.ts';
import { ServerDownloadResult } from './mod.ts';

export class Vanilla extends ServerClient {
  static async getAvailableVersions (): Promise<string[]> {
    return (await getVersionManifest()).versions.map(v => v.id);
  }

  async downloadServer(path: string, mcVersion: string): Promise<ServerDownloadResult> {
    const versionManifest = await getVersionManifest();
    const shortVersion: ShortVersion | void = versionManifest.versions.find<ShortVersion>((v): v is ShortVersion => v.id === mcVersion);

    if (!shortVersion) throw new Error(`Unknown version. version: ${mcVersion}`);

    const version: Version = await getVersion(shortVersion);

    if (!version.downloads.server) throw new Error(`I couldn't find that version(${mcVersion}) of the server.`);

    const filePath = join(path, `vanilla_${version.id}.jar`);
    const { hash } = await namedDownload(version.downloads.server.url, filePath, {
      algorithm: 'sha1',
      value: version.downloads.server.sha1
    });

    return {
      filePath,
      version: mcVersion,
      client: 'vanilla',
      hash: {
        algorithm: 'sha1',
        value: hash
      }
    };
  }
}

export const getVersionManifest = async (): Promise<VersionManifest> => {
  const response = await request('https://piston-meta.mojang.com/mc/game/version_manifest.json');
  return response.json() as Promise<VersionManifest>;
};

export const getVersion = async (version: ShortVersion) => {
  const response = await request(version.url);
  return response.json() as Promise<Version>;
};

export interface VersionManifest {
  latest: {
    release: string;
    snapshot: string;
  };
  versions: ShortVersion[];
}

export type VersionType = 'release' | 'snapshot' | 'old_alpha' | 'old_beta'

export interface ShortVersion {
  id: string;
  releaseTime: string;
  time: string;
  type: VersionType;
  url: string;
}

export interface Version {
  assets: string;
  downloads: {
    client: DonwloadDetail;
    client_mappings?: DonwloadDetail;
    server?: DonwloadDetail;
    server_mappings?: DonwloadDetail;
  };
  id: string;
  minimumLauncherVersion: number;
  releaseTime: string;
  time: string;
  type: VersionType;
}

export interface DonwloadDetail {
  sha1: string;
  size: number;
  url: string;
}
