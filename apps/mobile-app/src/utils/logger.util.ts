import { InteractionManager } from 'react-native';
import { configLoggerType, consoleTransport, fileAsyncTransport, logger } from 'react-native-logs';
import * as RNFS from '@dr.pogodin/react-native-fs';

const config: configLoggerType = {
  async: true,
  asyncFunc: InteractionManager.runAfterInteractions,
  transport: __DEV__ ? consoleTransport : fileAsyncTransport,
  severity: __DEV__ ? 'debug' : 'error',
  enabledExtensions: ['root', 'middleware', 'home', 'profile', 'auth', 'screen'],
  levels: {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  },
  transportOptions: {
    colors: {
      debug: 'yellow',
      info: 'cyan',
      warn: 'orange',
      error: 'red',
    },
    extensionColors: {
      root: 'magenta',
      middleware: 'blue',
      home: 'gray',
      profile: 'slate',
      auth: 'green',
      message: 'amber',
      screen: 'cyan',
    },
    FS: RNFS,
    fileName: 'bully-log.txt',
  },
};

const log = logger.createLogger<'info' | 'warn' | 'error' | 'debug'>(config);

export default log;
