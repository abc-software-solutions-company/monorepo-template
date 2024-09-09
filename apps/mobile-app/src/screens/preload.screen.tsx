import React, { useCallback, useEffect } from 'react';
import { generatePosts, generateSeed, resetLocalDatabase } from '@/localdb/localdb.generate';
import { ds } from '~react-native-design-system';
import Loading from '~react-native-ui-core/components/loading';
import StatusBar from '~react-native-ui-core/components/statusbar';
import View from '~react-native-ui-core/components/view';

import { AuthenticatedStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { SYNC_DATA_KEY } from '@/modules/sync-data/constants/sync-data.constant';

import log from '@/utils/logger.util';
import { MMKVStorage } from '@/utils/mmkv-storage.util';

function PreloadScreen({ navigation }: AuthenticatedStackProps<'Preload'>) {
  const initializeLocalDb = useCallback(async () => {
    try {
      MMKVStorage.removeItem(SYNC_DATA_KEY);
      await resetLocalDatabase();
      await generateSeed();
      await generatePosts();
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
    <View style={[ds.flex1, ds.itemsCenter, ds.justifyCenter]}>
      <StatusBar visible={false} />
      <Loading size={60} thickness={8} />
    </View>
  );
}

export default PreloadScreen;
