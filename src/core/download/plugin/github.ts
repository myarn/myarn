import { Octokit } from '../../../deps.ts';
import { userAgent } from '../../../utils/request.ts';
import { ServerDownloadResult } from '../mod.ts';

export const downloadPluginFronGitHub = (path: string, ) => {
  const octokit = new Octokit({
    userAgent: userAgent
  });
};
