import { defaultRudderStackConfig } from './configs/analytics.config';
import { AnalyticsProvider } from './constants/analytics.constant';
import { IAnalyticsService, IRudderStackConfig } from './interfaces/analytics.interface';
import { RudderStackAnalyticsService } from './services/rudderstack.service';

export class AnalyticsFactory {
  private static rudderStackInstance: IAnalyticsService | null = null;

  static createAnalyticsService<T>(provider: AnalyticsProvider = AnalyticsProvider.RUDDERSTACK, configs?: T): IAnalyticsService {
    switch (provider) {
      case AnalyticsProvider.RUDDERSTACK:
        if (!this.rudderStackInstance) {
          const mergedConfigs = { ...defaultRudderStackConfig, ...configs } as IRudderStackConfig;

          this.rudderStackInstance = new RudderStackAnalyticsService(mergedConfigs);
        }

        return this.rudderStackInstance;

      default:
        throw new Error('Unsupported analytics provider');
    }
  }
}
