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
      let v: RegExpMatchArray | string[] | null;
      const semVer = i === 0;
      if (semVer) {
        // Lenient Semver 2.0 regex, lazy init and cached
        const regex = (SEM_VER_REGEX ??=
          /^([0-9a-zA-Z]+)\.([0-9a-zA-Z]+)\.([0-9a-zA-Z]+)(?:-([0-9a-zA-Z\.-]+))?(?:\+([0-9a-zA-Z\.-]+))?$/);
        v = version.match(regex);
      } else {
        const regex = (SIMPLE_VER_REGEX ??= /[._\-+]/);
        // Simple version, major.minor.patch.build where everything is optional
        v = ['', ...version.split(regex, 4)];
      }

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
