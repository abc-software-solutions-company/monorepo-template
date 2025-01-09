export interface IAnalyticsService {
  trackEvent(event: string, properties?: Record<string, unknown>): void;
  identify(userId: string, traits?: Record<string, unknown>): void;
  trackScreen(screenName: string, properties?: Record<string, unknown>): void;
}

export interface IRudderStackConfig {
  writeKey: string;
  dataPlaneUrl: string;
}
