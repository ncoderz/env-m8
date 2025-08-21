/**
 * A version object.
 *
 * It contains the full version string and its components.
 *
 */
export interface Version {
  full: string;
  major: string;
  minor: string;
  patch: string;
  prerelease: string;
  build: string;
}

const EMPTY_VERSION: Version = {
  full: '',
  major: '',
  minor: '',
  patch: '',
  prerelease: '',
  build: '',
};

export { EMPTY_VERSION };
