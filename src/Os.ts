/**
 * Os
 */
const Os = {
  unknown: '',
  macos: 'macos',
  windows: 'windows',
  linux: 'linux',
  android: 'android',
  ios: 'ios',
  aix: 'aix',
  freebsd: 'freebsd',
  openbsd: 'openbsd',
  solaris: 'solaris',
  cygwin: 'cygwin',
  netbsd: 'netbsd',
  haiku: 'haiku',
  illumos: 'illumos',
} as const;

export type OsType = (typeof Os)[keyof typeof Os];

export { Os };
