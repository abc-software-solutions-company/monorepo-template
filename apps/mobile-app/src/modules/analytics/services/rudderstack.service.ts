import rudderClient from '@rudderstack/rudder-sdk-react-native';

import { IAnalyticsService, IRudderStackConfig } from '../interfaces/analytics.interface';

import log from '@/utils/logger.util';

export class RudderStackAnalyticsService implements IAnalyticsService {
  constructor(config: IRudderStackConfig) {
    rudderClient.setup(config.writeKey, {
      dataPlaneUrl: config.dataPlaneUrl,
      trackAppLifecycleEvents: true,
    });
  }

  trackEvent(event: string, properties?: Record<string, unknown>): void {
    log.debug(`RudderStack track: ${event}`, properties);
    rudderClient.track(event, properties, {});
  }

  identify(userId: string, traits?: Record<string, unknown>): void {
    log.debug(`RudderStack identify: ${userId}`, traits);
  }

  trackScreen(screenName: string, properties?: Record<string, unknown>): void {
    log.debug(`RudderStack screen: ${screenName}`, properties);
  }
}
