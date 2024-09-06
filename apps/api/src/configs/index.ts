import appConfig from './app.config';
import authConfig from './auth.config';
import awsConfig from './aws.config';
import cacheConfig from './cache.config';
import databaseConfig from './database.config';
import emailConfig from './email.config';
import firebaseConfig from './firebase.config';
import httpConfig from './http.config';
import middlewaresConfig from './middlewares.config';
import redisConfig from './redis.config';

export default [
  appConfig,
  authConfig,
  cacheConfig,
  databaseConfig,
  emailConfig,
  firebaseConfig,
  httpConfig,
  middlewaresConfig,
  redisConfig,
  awsConfig,
];
