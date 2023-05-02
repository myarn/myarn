import SemVer from 'https://deno.land/std@0.170.0/semver/mod.ts';

/**
 * Create Placeholder
 */
const cp = (s: string) => `{${s}}`;

const replaceVersionPlaceHolder = (raw: string, semver: SemVer) => {
  return raw
    .replaceAll(cp('raw'), semver.raw)
    .replaceAll(cp('version'), semver.version)
    .replaceAll(cp('major'), `${semver.major}`)
    .replaceAll(cp('minor'), `${semver.minor}`)
    .replaceAll(cp('patch'), `${semver.patch}`)
    .replaceAll(cp('build'), semver.build.join('.'))
    .replaceAll(cp('prerelease'), semver.prerelease.join('.'));
};

export const placeholder = (raw: string, variants: {
  semver: SemVer
}) => {
  return replaceVersionPlaceHolder(raw, variants.semver);
};
