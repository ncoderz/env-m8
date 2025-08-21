# env-m8

![Build & Test](https://github.com/ncoderz/env-m8/actions/workflows/build-test.yml/badge.svg?branch=main)
![npm version](https://img.shields.io/npm/v/@ncoderz/env-m8)
![License](https://img.shields.io/badge/license-BSD--2--Clause-blue)

Where am I?

Easy information about the environment in which your TypeScript or JavaScript is executing through
a single API.

**NOTE:** *This library is currently beta. Features are being added!*
- TODO: Support more major browsers
- TODO: Add testing suite

## Features

- 🔍 **Frontend or Backend?** - running in browser, node, CI? Now you know!
- 🔍 **Which Browser?** - the browser environment (name, version, etc)
- 🔍 **Which Backend?** - the Node, Bun, Deno environment (name, version, etc)
- 🔍 **Which OS?** - the OS environment (name, version, etc)
- 📦 **ESM & CommonJS compatible** - use with any module system
- 💪 **Zero dependencies** - lightweight and fast (minified + gzipped ~2kB)


## Installation

```bash
npm install @ncoderz/env-m8
```

## Quick Start

```typescript
import { EnvM8 } from '@ncoderz/env-m8';

// Get an instance, will calculate environment only on first instance creation

const env = new EnvM8();

//
// Find what you need to know about the environment
//

// Running in a browser
const isBrowser = env.isBrowser;

// Running in a backend
const isBackend = env.isBackend;

// Running in a CI environment
// true if CI environment variable is set and is not 'false' or '0' (case-insensitive)
const isCI = env.isCI;

// Which platform?
// e.g., chrome, safari, node, bun, deno - see Platform type
const platform = env.platform;

// Which OS?
// e.g., macos, windows, linux, android, ios - see Os type
const os = env.os;

// Time library was loaded (usually at app start)
// in milliseconds elapsed since midnight, January 1, 1970 Universal Coordinated Time (UTC)
const bootTimestamp = env.bootTimestamp;

// Time since bootTimestamp in milliseconds
const upTime = env.upTime;

// The version of the platform
const { full, major, minor, patch, prerelease, build } = env.platformVersion;

// The version of the OS
const { full, major, minor, patch, prerelease, build } = env.osVersion;

// NODE_ENV at initialisation time, returns 'production' if not set
const NODE_ENV = env.NODE_ENV;


// On any instance of EnvM8, you can set your app name and version
env.setApp('MyApp');
env.setAppVersion('2.1.3-alpha+exp.sha.5114f85');


// The values will then be available on any instance of EnvM8
const appName = env.app; // MyApp
const {
  full // '2.1.3-alpha+exp.sha.5114f85',
  major, // '2'
  minor, // '1'
  patch, // '3'
  prerelease, // 'alpha'
  build // 'exp.sha.5114f85'
} = env.appVersion;


// Get a process.env environment variable safely, whatever the environment
env.getEnv('LOG_LEVEL'); // string | undefined
```

## What should I use this information for?

Primarily, this information should be used simply to inform about the platform and version.

Sometimes, it may be used to change the behaviour of code based platform and versions, but this
should be kept to a minimum.

Isomorphic code may want / need to behave differently in the browser or on the
backend due to available features on each platform. It may also need to account for the browser
or backend type (e.g. node vs bun, chrome vs safari). In this case, use these flags:
 - `isBrowser`
 - `isBackend`
 - `platform`

It is generally bad practice to change behaviour due to platform versions, but sometimes it is
unavoidable due to bugs or missing features. In this case, use these flags:
- `platformVersion`

When running tests it can be useful to know if running in a CI environment. EnvM8 provides an
isomorphic safe way of checking the CI flag. It will return true if the CI environemnt variable
is set and and set to anything other than 'false' or '0' (case insensitive):
- `isCI`

Historically `NODE_ENV` has been used for various changes of behaviour depending on its value
('development', 'production', 'test', not set). It is probably better to use something like
a `.env` file for this purpose, but a cross-platform `NODE_ENV` is provided here. It will
return `production` if not set:
- `NODE_ENV`


## Limitations

Not all information is available on all platforms.

This is generally because the information is simply not available to the code in any way.

**Browser:** In the browser, platform and version information is retrieved from the `userAgent` string.
Not all information is always available, also note that the `userAgent` can be easily spoofed.

Known missing information:
- **\[all\] Browser versions:** depend on what is available in the provided `userAgent`. Sometimes minor, patch, build versions are missing.
- **\[mac\] Os version:** in the browser, this is reported as the 'macOS' version. In node, as the 'darwin' kernel version
  - macOS 10 Catalina → Darwin 19.x
  - macOS 11 Big Sur → Darwin 20.x
  - macOS 12 Monterey → Darwin 21.x
  - macOS 13 Ventura → Darwin 22.x
  - macOS 14 Sonoma → Darwin 23.x
  - macOS 15 Sequoia → Darwin 24.x


## Browser Usage

env-m8 works in browsers:

```html
<script src="https://cdn.jsdelivr.net/npm/@ncoderz/env-m8@latest/dist/browser/env-m8.global.js"></script>
<script>
  const { EnvM8 } = window.envM8;

  const env = new EnvM8();

  const isBrowser = env.isBrowser; // true
  const isBackend = env.isBackend; // false
  const isCI = env.isCI;
  const platform = env.platform; // e.g., chrome, safari, etc - see Platform type
  const bootTimestamp = env.bootTimestamp; // script load timestamp
  const upTime = env.upTime; // time since script load
  const { full, major, minor, patch, prerelease, build } = env.platformVersion; // browser version

</script>
```

## License

[BSD-2-Clause](LICENSE)
