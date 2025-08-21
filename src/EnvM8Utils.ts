import { EMPTY_VERSION, type Version } from './Version.ts';

let SEM_VER_REGEX: RegExp | undefined;
let SIMPLE_VER_REGEX: RegExp | undefined;

class EnvM8Utils {
  public static parseVersionString(version?: string): Version {
    if (!version) return EMPTY_VERSION;

    // Remove leading v
    if (version.startsWith('v')) {
      version = version.substring(1);
    }

    for (let i = 0; i < 2; i++) {
      let verRegex: RegExp;
      const semVer = i === 0;
      if (semVer) {
        // Lenient Semver 2.0 regex, lazy init and cached
        verRegex = SEM_VER_REGEX ??=
          /^([0-9a-zA-Z]+)\.([0-9a-zA-Z]+)\.([0-9a-zA-Z]+)(?:-([0-9a-zA-Z\.-]+))?(?:\+([0-9a-zA-Z\.-]+))?$/;
      } else {
        // Simple version regex, lazy init and cached
        // Matches X.Y.Z or X.Y.Z.B or X.Y.Z-B or X.Y or X-Y.Z+B, etc
        verRegex = SIMPLE_VER_REGEX ??= /^([A-Za-z0-9]+(?:[._\-+][A-Za-z0-9]+){0,3})$/;
      }

      const v = version.match(verRegex);
      if (v) {
        return {
          full: version,
          major: v[1] ?? '',
          minor: v[2] ?? '',
          patch: v[3] ?? '',
          prerelease: semVer ? (v[4] ?? '') : '',
          build: (semVer ? v[5] : v[4]) ?? '',
        };
      }
    }
    return EMPTY_VERSION;
  }
}

export { EnvM8Utils };
