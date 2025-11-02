import * as dotenv from 'dotenv';
import * as path from 'path';
import { MikroORM, Options, UnderscoreNamingStrategy } from '@mikro-orm/core';
import { Migrator } from '@mikro-orm/migrations';
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
  migrations: {
    tableName: 'mikro_orm_migrations',
    path: path.join(__dirname, './migrations'),
    glob: '!(*.d).{js,ts}',
    transactional: true,
    disableForeignKeys: false,
    allOrNothing: true,
    emit: 'ts' as const,
  },
  extensions: [Migrator],
  namingStrategy: UnderscoreNamingStrategy,
  debug: process.env.NODE_ENV !== 'production',
};

export const initDataSource = async () => {
  return await MikroORM.init(options);
};
