import { Octokit, YAML, versionParse } from '../../../deps.ts';
import { placeholder } from '../../../lib/placeholder.ts';
import { ResourceLocation } from '../../../utils/ResourceLocation.ts';
import { DownloadPlatform, Loader } from '../mod.ts';

export const PLUGIN_CONFIG_FILENAME = 'myarn.yaml'
const githubAuthToken = Deno.env.get('MYARN_GITHUB_API_TOKEN');

export interface PluginRepoConfig {
  version: number;
  variants: {
    spigot?: string,
    paper?: string,
    forge?: string
  };
}

const isString = (data: unknown): data is string => (typeof data === 'string');

const octokit = new Octokit({
  auth: githubAuthToken
});

export const loadPluginConfig = async (owner: string, repo: string) => {
  const response = await octokit.rest.repos.getContent({
    owner,
    repo,
    mediaType: {
      format: 'raw'
    },
    path: PLUGIN_CONFIG_FILENAME
  }).catch(() => 
    octokit.rest.repos.getContent({
      owner: 'myarn',
      repo: 'registry',
      mediaType: {
        format: 'raw'
      },
      path: `plugin/${owner}/${repo}/${PLUGIN_CONFIG_FILENAME}`
    })
  ).then((response) => {
    const { data } = response;
    if (isString(data)) {
      return YAML.parse(data) as PluginRepoConfig;
    } else throw new TypeError('Response data is not string');
  });

  if (response instanceof Error) throw new Error('Config Not Found.');

  return response;
};

const parseGithubLocation = (location: string) => {
  const [ owner, repo ] = location.split('/');
  if ( !owner || !repo ) throw new Error(`GitHub Location is invalid(${location})`);

  return {
    owner, repo
  };
} 

const github: DownloadPlatform = {
  getDownloadRequest: async (resourceLocation: ResourceLocation, loader: Loader) => {
    const { owner, repo } = parseGithubLocation(resourceLocation.location);

    if (resourceLocation.version === 'latest') {
      const latestRelease = await octokit.rest.repos.getLatestRelease({ owner, repo })
      resourceLocation.version = latestRelease.data.tag_name;
    }
  
    const pluginConfig = await loadPluginConfig(owner, repo);
  
    const release = await octokit.rest.repos.getReleaseByTag({ owner, repo, tag: resourceLocation.version });
  
    const semver = versionParse(release.data.tag_name);
    if (!semver) throw new Error(`Version is invalid(${release.data.tag_name})`);
  
    const assetNamePlaceholder = pluginConfig.variants[loader];
    if (!assetNamePlaceholder) throw new Error(`${owner}/${repo} does not support ${loader}`);
  
    const expectAssetFilename = placeholder(assetNamePlaceholder, { semver });
  
    const asset = release.data.assets.find((value) => value.name === expectAssetFilename);
    if (!asset) throw new Error(`Cannot find asset(${expectAssetFilename}) in ${owner}/${repo}`);
  
    return new Request(asset.url, {
      method: 'GET',
      headers: {
        'Accept': 'application/octet-stream',
        'Authorization': `Bearer ${githubAuthToken}`
      }
    });
  },

  getName: (resourceLocation)  => {
    return parseGithubLocation(resourceLocation.location).repo;
  }
};

export default github;