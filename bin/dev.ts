import { LogM8, LogM8Utils } from '@ncoderz/log-m8';

import { EnvM8, PACKAGE_INFO } from '../src/index.ts';

function main() {
  LogM8.init();

  const log = LogM8.getLogger('log-m8');

  const env = new EnvM8();
  env.setApp(PACKAGE_INFO.name);
  env.setAppVersion(PACKAGE_INFO.version);

  log.info('app:', env.app);
  log.info('appVersion:', env.appVersion.full, JSON.stringify(env.appVersion));

  log.info('bootTimestamp:', LogM8Utils.formatTimestamp(new Date(env.bootTimestamp)));

  log.info('platform:', env.platform);
  log.info('isBrowser:', env.isBrowser ? 'yes' : 'no');
  log.info('isBackend:', env.isBackend ? 'yes' : 'no');
  log.info('isCI:', env.isCI ? 'yes' : 'no');
  log.info('platformVersion:', env.platformVersion.full, JSON.stringify(env.platformVersion));

  log.info('os:', env.os);
  log.info('osVersion:', env.osVersion.full, JSON.stringify(env.osVersion));

  log.info('NODE_ENV:', env.NODE_ENV);

  env.setAppVersion('2.1.3-alpha+exp.sha.5114f85');
  log.info('appVersion updated:', env.appVersion.full, JSON.stringify(env.appVersion));

  log.info('upTimestamp:', env.upTimestamp);
}

main();
