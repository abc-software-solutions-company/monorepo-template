import { localdbToJSON } from '@/localdb/localdb.export';

import { SYNC_DATA_KEY } from '../constants/sync-data.constant';

import { AnalyticsFactory } from '@/modules/analytics/analytics.factory';
import { AnalyticsEventName } from '@/modules/analytics/constants/analytics.constant';

import { getDeviceId } from '@/utils/device.util';
import log from '@/utils/logger.util';
import { MMKVStorage } from '@/utils/mmkv-storage.util';

const analyticsService = AnalyticsFactory.createAnalyticsService();

export const syncDataToServer = async () => {
  try {
    log.info('Syncing data to server');

    const deviceId = await getDeviceId();
    const json = await localdbToJSON();

    if (!deviceId) throw new Error('Invalid Device ID');
    if (!json) throw new Error('Invalid JSON');

    // await saveJsonToFile(json);

    analyticsService.trackEvent(AnalyticsEventName.SYNC_DATA, { deviceId, name: 'Thien Lam' });

    MMKVStorage.setItem(SYNC_DATA_KEY, 'true');

    log.info('Data synced successfully.');
  } catch (err) {
    log.error('syncDataToServer', err);
  }
};
