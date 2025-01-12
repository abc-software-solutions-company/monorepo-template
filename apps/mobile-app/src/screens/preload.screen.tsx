import React, { useCallback, useEffect } from 'react';
import { generatePosts, generateSeed, resetLocalDatabase } from '@/localdb/localdb.generate';
import { ds } from '@repo/react-native-design-system';
import Loading from '@repo/react-native-ui-core/components/loading';
import StatusBar from '@repo/react-native-ui-core/components/statusbar';

import SafeViewArea from '@/components/safe-view-area';

import { AuthenticatedStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { SYNC_DATA_KEY } from '@/modules/sync-data/constants/sync-data.constant';

import log from '@/utils/logger.util';
import { MMKVStorage } from '@/utils/mmkv-storage.util';

function PreloadScreen({ navigation }: AuthenticatedStackProps<'Preload'>) {
  const initializeLocalDb = useCallback(async () => {
    try {
      MMKVStorage.clear();
      MMKVStorage.removeItem(SYNC_DATA_KEY);
      await resetLocalDatabase();
      await generateSeed();
      await generatePosts();
      // setTimeout(() => navigation.replace('UI'), 1000);
      // setTimeout(() => navigation.replace('SyncData'), 1000);
      setTimeout(() => navigation.replace('TravelDrawer', { screen: 'TravelBottomTabStack' }), 1000);
    } catch (error) {
      log.error('Error generating local data:', error);
    }
  }, [navigation]);

  useEffect(() => {
    initializeLocalDb();
  }, [initializeLocalDb]);

  return (
    <SafeViewArea spacingBottom={true} style={[ds.flex1, ds.itemsCenter, ds.justifyCenter]}>
      <StatusBar visible={false} />
      <Loading size={60} thickness={8} />
    </SafeViewArea>
  );
}

export default PreloadScreen;
