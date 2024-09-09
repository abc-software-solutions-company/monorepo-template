import React, { useCallback, useEffect, useState } from 'react';
import { database } from '@/localdb/localdb.bootstrap';
import { WMPost } from '@/localdb/models/post.model';
import PostRepository from '@/localdb/repositories/post.repository';
import { randomId } from '@nozbe/watermelondb/utils/common';
import { useNetInfo } from '@react-native-community/netinfo';
import { ColumnDef } from '@tanstack/react-table';
import { ds } from '~react-native-design-system';
import Button from '~react-native-ui-core/components/button';
import Loading from '~react-native-ui-core/components/loading';
import StatusBar from '~react-native-ui-core/components/statusbar';
import Text from '~react-native-ui-core/components/text';
import View from '~react-native-ui-core/components/view';

import SafeViewArea from '@/components/safe-view-area';
import Table from '@/components/table';

import { AuthenticatedStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { SYNC_DATA_KEY } from '@/modules/sync-data/constants/sync-data.constant';
import { syncDataToServer } from '@/modules/sync-data/utils/sync-data.util';

import log from '@/utils/logger.util';
import { MMKVStorage } from '@/utils/mmkv-storage.util';

const postRepo = new PostRepository(database);

const columns: ColumnDef<WMPost>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
    meta: { align: 'left' },
  },
];

function SyncDataScreen({}: AuthenticatedStackProps<'SyncData'>) {
  const netInfo = useNetInfo();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<WMPost[]>([]);

  const getPostData = useCallback(async () => {
    try {
      setIsLoading(true);
      const items = await postRepo.getAll();

      setPosts(items);
    } catch (err) {
      setError('Failed to load posts.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createNewData = async () => {
    try {
      await postRepo.create({ id: randomId(), title: 'Test Post 3', tags: ['test'], is_public: true });

      MMKVStorage.setItem(SYNC_DATA_KEY, 'false');

      if (netInfo.isConnected === true) syncDataToServer();

      await getPostData();
    } catch (err) {
      log.error('createNewData', err);
    }
  };

  useEffect(() => {
    getPostData();
  }, [getPostData]);

  const isEmpty = posts.length === 0;

  return (
    <View style={[ds.flex1]}>
      <StatusBar />
      <SafeViewArea spacingBottom={true}>
        <View>
          {isLoading && <Loading size={60} thickness={8} />}
          {!isLoading && !error && isEmpty && <Text style={ds.textCenter}>No posts available.</Text>}
          {!isLoading && !error && !isEmpty && <Table data={posts} columns={columns} rowIdAccessor={row => row.id.toString()} />}
          <Button onPress={createNewData}>Create New Data</Button>
        </View>
      </SafeViewArea>
    </View>
  );
}

export default SyncDataScreen;
