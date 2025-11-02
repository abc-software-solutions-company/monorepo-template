import * as dotenv from 'dotenv';
import * as path from 'path';
import { Options, UnderscoreNamingStrategy } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';

dotenv.config({ path: path.join(__dirname, `../.env${process.env.NODE_ENV === 'test' ? '.test' : ''}`) });

const config: Options = {
  driver: PostgreSqlDriver,
  clientUrl: process.env.AP_DB_URL,
  schema: process.env.AP_DB_SCHEMA,
  entities: ['./dist/modules/**/*.entity.js'],
  entitiesTs: ['./src/modules/**/*.entity.ts'],
  debug: process.env.NODE_ENV !== 'production',
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: './dist/database/migrations',
    pathTs: './src/database/migrations',
    glob: '!(*.d).{js,ts}',
    transactional: true,
    disableForeignKeys: false,
    allOrNothing: true,
    dropTables: true,
    safe: false,
    snapshot: true,
    emit: 'ts',
  },
  seeder: {
    path: './dist/database/seeders',
    pathTs: './src/database/seeders',
    defaultSeeder: 'DatabaseSeeder',
    glob: '!(*.d).{js,ts}',
    emit: 'ts',
  },
  extensions: [Migrator, SeedManager],
  namingStrategy: UnderscoreNamingStrategy,
};

export default config;
