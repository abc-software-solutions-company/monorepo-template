import { appSchema, Database } from '@nozbe/watermelondb';
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite';

import { postSchema, WMPost } from './models/post.model';
import { seedSchema, WMSeed } from './models/seed.model';
import { localdbName, localdbVersion } from './localdb.constant';
import migrations from './localdb.migration';

export const localdbSchema = appSchema({
  version: localdbVersion,
  tables: [seedSchema, postSchema],
});

const adapter = new SQLiteAdapter({
  dbName: localdbName,
  schema: localdbSchema,
  migrations,
});

export const database = new Database({
  adapter,
  modelClasses: [WMSeed, WMPost],
});
