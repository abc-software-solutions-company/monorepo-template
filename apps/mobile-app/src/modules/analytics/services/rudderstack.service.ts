import Config from 'react-native-config';
import rudderClient from '@rudderstack/rudder-sdk-react-native';

import { IAnalyticsService, IRudderStackConfig } from '../interfaces/analytics.interface';

import log from '@/utils/logger.util';

export class RudderStackAnalyticsService implements IAnalyticsService {
  constructor(config: IRudderStackConfig) {
    rudderClient.setup(config.writeKey, {
      dataPlaneUrl: config.dataPlaneUrl,
      trackAppLifecycleEvents: false,
    });
  }

  trackEvent(event: string, properties?: Record<string, unknown>): void {
    try {
      log.debug(`RudderStack trackEvent: ${event} from ${Config.RUDDER_STACK_WRITE_KEY}:${Config.RUDDER_STACK_DATA_PLANE_URL}`, properties);
      rudderClient.track(event, properties, {});
    } catch (error) {
      log.error('RudderStack trackEvent', error);
    }
  }

  identify(userId: string, traits?: Record<string, unknown>): void {
    log.debug(`RudderStack identify: ${userId}`, traits);
    try {
      log.debug(`RudderStack identify: ${userId}`, traits);
    } catch (error) {
      log.error('RudderStack identify', error);
    }
  }

  trackScreen(screenName: string, properties?: Record<string, unknown>): void {
    log.debug(`RudderStack trackScreen: ${screenName}`, properties);
    try {
      log.debug(`RudderStack trackScreen: ${screenName}`, properties);
    } catch (error) {
      log.error('RudderStack trackScreen', error);
    }
  }
}
