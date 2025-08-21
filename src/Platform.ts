/**
 * Application platform
 */
const Platform = {
  unknown: '',
  node: 'node',
  bun: 'bun',
  deno: 'deno',
  chrome: 'chrome',
  safari: 'safari',
  firefox: 'firefox',
  edge: 'edge',
  ie: 'ie',
} as const;

export type PlatformType = (typeof Platform)[keyof typeof Platform];

export { Platform };
