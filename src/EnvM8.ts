/* NODEJS:START */
import os from 'node:os';

/* NODEJS:END */
import { EnvM8Utils } from './EnvM8Utils.ts';
import { Os, type OsType } from './Os.ts';
import { Platform, type PlatformType } from './Platform.ts';
import { parseUserAgent, type UserAgentInfo } from './userAgent.ts';
import { EMPTY_VERSION, type Version } from './Version.ts';

export interface InitEnvOptions {
  app?: string;
  version?: string;
}

declare const process: {
  env: { [key: string]: string };
  version?: string;
  versions?: { [key: string]: string };
};

declare const Deno: {
  version?: {
    deno: string;
    v8: string;
    typescript: string;
  };
  build: {
    os: string;
  };
  env: {
    get(name: string): string | undefined;
  };
  osRelease(): string;
};

const _bootTimestamp = Date.now();
let _initialized = false;
let _userAgentInfo!: UserAgentInfo | undefined;
let _platform!: PlatformType;
let _platformVersion!: Version;
let _os!: OsType;
let _osVersion!: Version;
let _isBrowser!: boolean;
let _isCI!: boolean;
let _NODE_ENV!: string;

let _app: string = '';
let _appVersion: Version = EMPTY_VERSION;

function getPlatform(): PlatformType {
  if (typeof Deno !== 'undefined' && Deno.version != null) {
    return Platform.deno;
  } else if (_userAgentInfo) {
    return _userAgentInfo.browser;
  } else if (typeof process !== 'undefined') {
    if (process.versions !== undefined) {
      if (process.versions.bun) return Platform.bun;
      if (process.versions.deno) return Platform.deno;
      if (process.versions.node) return Platform.node;
    }
  }

  return Platform.unknown;
}

function getPlatformVersion(): Version {
  switch (_platform) {
    case Platform.bun:
      return EnvM8Utils.parseVersionString(process.versions?.bun);
    case Platform.deno:
      return EnvM8Utils.parseVersionString(Deno.version?.deno);
    case Platform.node:
      return EnvM8Utils.parseVersionString(process.version);
    default:
      if (_userAgentInfo) {
        return EnvM8Utils.parseVersionString(_userAgentInfo.browserVersion);
      }
  }

  return EMPTY_VERSION;
}

function getOs(): OsType {
  switch (_platform) {
    case Platform.bun:
    case Platform.deno:
    case Platform.node:
      if (typeof os !== 'undefined') {
        return getOsFromNode();
      } else if (Platform.deno) {
        return getOsFromDeno();
      }
    default:
      if (_userAgentInfo) {
        return _userAgentInfo.os;
      }
  }

  return Os.unknown;
}

function getOsFromNode(): OsType {
  const p: NodeJS.Platform = os.platform();
  if (p === 'darwin') return Os.macos;
  if (p === 'win32') return Os.windows;
  if (p === 'linux') return Os.linux;
  if (p === 'android') return Os.android;
  if (p === 'aix') return Os.aix;
  if (p === 'freebsd') return Os.freebsd;
  if (p === 'openbsd') return Os.openbsd;
  if (p === 'sunos') return Os.solaris;
  if (p === 'haiku') return Os.haiku;
  if (p === 'cygwin') return Os.cygwin;
  if (p === 'netbsd') return Os.netbsd;
  return Os.unknown;
}

function getOsFromDeno(): OsType {
  const p = Deno.build.os;
  if (p === 'darwin') return Os.macos;
  if (p === 'windows') return Os.windows;
  if (p === 'linux') return Os.linux;
  if (p === 'android') return Os.android;
  if (p === 'aix') return Os.aix;
  if (p === 'freebsd') return Os.freebsd;
  if (p === 'solaris') return Os.solaris;
  if (p === 'netbsd') return Os.netbsd;
  if (p === 'illumos') return Os.illumos;
  return Os.unknown;
}

function getOsVersion(): Version {
  switch (_platform) {
    case Platform.bun:
    case Platform.deno:
    case Platform.node:
      if (typeof os !== 'undefined') {
        return getOsVersionFromNode();
      } else if (Platform.deno) {
        return getOsVersionFromDeno();
      }
    default:
      if (_userAgentInfo) {
        return EnvM8Utils.parseVersionString(_userAgentInfo.osVersion);
      }
  }

  return EMPTY_VERSION;
}

function getOsVersionFromNode(): Version {
  return EnvM8Utils.parseVersionString(os.release());
}

function getOsVersionFromDeno(): Version {
  return EnvM8Utils.parseVersionString(Deno.osRelease());
}

function getIsBrowser(): boolean {
  return !!(
    typeof window !== 'undefined' &&
    typeof document !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    navigator.userAgent
  );
}

function getSafeProcessEnvProperty(name: string): string | undefined {
  switch (_platform) {
    case Platform.deno:
      return Deno.env.get(name);
    default:
      return typeof process !== 'undefined' ? process.env[name] : undefined;
  }
}

function getIsCI(): boolean {
  const ci = getSafeProcessEnvProperty('CI');
  return ci != undefined && toBoolean(ci, true);
}

function getNodeEnv(): string {
  return getSafeProcessEnvProperty('NODE_ENV') ?? 'production';
}

/**
 * Convert a value to a boolean.
 *
 * By default, the return will be false unless the value is truthy (true, "true", "1").
 * Setting defaultVal to true will return true unless the value is falsy (false, "false", "0").
 *
 * String comparisons are case insensitive.
 *
 * @param val input value
 * @param defaultVal default value to return if val does not match a boolean or 'true' / 'false'
 * @returns val, converted to a boolean
 */
function toBoolean(val: unknown | undefined, defaultVal?: boolean): boolean {
  if (defaultVal) {
    if (val === false) return false;
    if (val === '0') return false;
    if (typeof val === 'string' && val.toLowerCase() === 'false') return false;
    return true;
  } else {
    if (val === true) return true;
    if (val === '1') return true;
    if (typeof val === 'string' && val.toLowerCase() === 'true') return true;
    return false;
  }
}

class EnvM8 {
  public bootTimestamp: number;
  public app: string;
  public appVersion: Version;
  public platform: PlatformType;
  public platformVersion: Version;
  public os: OsType;
  public osVersion: Version;
  public isBrowser: boolean;
  public isBackend: boolean;
  public isCI: boolean;
  public NODE_ENV: string;

  constructor() {
    if (!_initialized) {
      _userAgentInfo = parseUserAgent();
      // this.app = '';
      // this.appVersion = EMPTY_VERSION;
      _platform = getPlatform();
      _platformVersion = getPlatformVersion();
      _isBrowser = getIsBrowser();
      _isCI = getIsCI();
      _NODE_ENV = getNodeEnv();
      _os = getOs();
      _osVersion = getOsVersion();
      _initialized = true;
    }

    this.bootTimestamp = _bootTimestamp;
    this.app = _app;
    this.appVersion = _appVersion;
    this.platform = _platform;
    this.platformVersion = _platformVersion;
    this.isBrowser = _isBrowser;
    this.isBackend = !_isBrowser;
    this.isCI = _isCI;
    this.NODE_ENV = _NODE_ENV;
    this.os = _os;
    this.osVersion = _osVersion;
  }

  public setApp(app: string) {
    this.app = app;
    _app = app;
  }

  public setAppVersion(version: string) {
    this.appVersion = EnvM8Utils.parseVersionString(version);
    _appVersion = this.appVersion;
  }

  public get upTime(): number {
    return Date.now() - this.bootTimestamp;
  }

  public getEnv(name: string): string | undefined {
    return getSafeProcessEnvProperty(name);
  }
}

export { EnvM8 };
