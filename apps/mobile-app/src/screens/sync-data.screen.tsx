/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2024-09-18 11:41:36
 */

import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { database } from '@/localdb/localdb.bootstrap';
import { WMPost } from '@/localdb/models/post.model';
import PostRepository from '@/localdb/repositories/post.repository';
import { randomId } from '@nozbe/watermelondb/utils/common';
import { useNetInfo } from '@react-native-community/netinfo';
import { ds } from '@repo/react-native-design-system';
import Button from '@repo/react-native-ui-core/components/button';
import IconButton from '@repo/react-native-ui-core/components/icon-button';
import Loading from '@repo/react-native-ui-core/components/loading';
import StatusBar from '@repo/react-native-ui-core/components/statusbar';
import Text from '@repo/react-native-ui-core/components/text';
import View from '@repo/react-native-ui-core/components/view';
import { ColumnDef } from '@tanstack/react-table';

import SafeViewArea from '@/components/safe-view-area';
import Table from '@/components/table';

import NavigationHeader from '@/modules/navigation/components/navigation-header';
import { AuthenticatedStackProps } from '@/modules/navigation/interfaces/navigation.interface';
import { getHeaderTitle } from '@/modules/navigation/utils/navigation.util';
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

function SyncDataScreen({ route }: AuthenticatedStackProps<'SyncData'>) {
  const { t } = useTranslation();
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
    <SafeViewArea>
      <StatusBar />
      <NavigationHeader
        title={t(getHeaderTitle(route.name))}
        leftComponent={
          <>
            <IconButton name="House" />
          </>
        }
        rightComponent={
          <>
            <IconButton name="House" disabled={true} />
          </>
        }
      />
      <View>
        {isLoading && <Loading size={60} thickness={8} />}
        {!isLoading && !error && isEmpty && <Text style={ds.textCenter}>No posts available.</Text>}
        {!isLoading && !error && !isEmpty && <Table data={posts} columns={columns} rowIdAccessor={row => row.id.toString()} />}
        <Button onPress={createNewData}>Create New Data</Button>
      </View>
    </SafeViewArea>
  );
}

export default SyncDataScreen;
