import { localdbName } from '@/localdb/localdb.constant';
import { LocalDbSyncData, WMPostEntity } from '@/localdb/localdb.interface';
import * as RNFS from '@dr.pogodin/react-native-fs';
import { isJson } from '@repo/shared-universal/utils/string.util';

import log from '@/utils/logger.util';

import PostRepository from './repositories/post.repository';
import { database } from './localdb.bootstrap';

const postRepo = new PostRepository(database);

export async function getPosts() {
  const items = await postRepo.getAll();

  const postItems = items.map(record => {
    let clonedItem = record._raw as unknown as WMPostEntity;

    clonedItem = removeInternalProperties(clonedItem);

    clonedItem.seo = JSON.parse((clonedItem.seo as string) || '{}');
    clonedItem.tags = JSON.parse((clonedItem.tags as unknown as string) ?? '[]');

    return clonedItem;
  });

  return postItems;
}

export async function localdbToJSON(): Promise<string> {
  try {
    const localdbSyncData: LocalDbSyncData = {
      posts: [],
    };

    const postItems = await getPosts();

    localdbSyncData.posts = postItems as WMPostEntity[];

    const json = JSON.stringify(localdbSyncData, null, 2);

    if (!isJson(json)) {
      return '';
    }

    log.debug('localdb: Converted data to JSON');

    return json;
  } catch (err) {
    log.error('localdb: Error exporting data:', err);

    return '';
  }
}

export async function saveJsonToFile(json: string) {
  const dt = new Date();
  const date = `${dt.getFullYear()}-${dt.getMonth() + 1}-${dt.getDate()}`;
  const path = `${RNFS.TemporaryDirectoryPath}${localdbName}-${date}.json`;
  const promise = RNFS.writeFile(path, json, 'utf8');

  log.debug('localdb: Data exported to', path);

  return promise;
}

function removeInternalProperties<T extends Record<string, unknown>>(item: T): T {
  delete item._status;
  delete item._changed;

  return item;
}
