import { FC, useEffect } from 'react';
import { useNetInfo } from '@react-native-community/netinfo';

import { SYNC_DATA_KEY } from '../constants/sync-data.constant';

import { MMKVStorage } from '@/utils/mmkv-storage.util';
import { syncDataToServer } from '../utils/sync-data.util';

type SyncDataProps = {};

const AutoSyncDataWhenOnline: FC<SyncDataProps> = () => {
  const netInfo = useNetInfo();

  useEffect(() => {
    const canSyncData = MMKVStorage.getItem(SYNC_DATA_KEY);
    const isReadyToSyncData = netInfo.isConnected === true && canSyncData === 'false';

    if (isReadyToSyncData) syncDataToServer();
  }, [netInfo.isConnected]);

  return null;
};

export default AutoSyncDataWhenOnline;
