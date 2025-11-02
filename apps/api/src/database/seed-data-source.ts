import * as dotenv from 'dotenv';
import * as path from 'path';
import { MikroORM, Options, UnderscoreNamingStrategy } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

dotenv.config({ path: path.join(__dirname, `../../.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`) });

const options: Options = {
  driver: PostgreSqlDriver,
  driverOptions: {
    connection: {
      ssl: {
        rejectUnauthorized: false,
      },
    },
  },
  clientUrl: process.env.AP_DB_URL,
  schema: process.env.AP_DB_SCHEMA,
  entities: [path.join(__dirname, '../modules/**/*.entity.js')],
  entitiesTs: [path.join(__dirname, '../modules/**/*.entity.ts')],
  seeder: {
    path: path.join(__dirname, './seeders'),
    pathTs: path.join(__dirname, './seeders'),
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts' as const,
  },
  extensions: [Migrator, SeedManager],
  namingStrategy: UnderscoreNamingStrategy,
  debug: process.env.NODE_ENV !== 'production',
};

export const initSeedDataSource = async () => {
  return await MikroORM.init(options);
};
