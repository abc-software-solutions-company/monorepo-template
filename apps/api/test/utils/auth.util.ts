import { NestExpressApplication } from '@nestjs/platform-express';
import supertest from 'supertest';

export const adminLogin = async (app: NestExpressApplication, credentials: { email: string; password: string }) => {
  const res = await supertest(app.getHttpServer()).post('/api/v1/admin/auth/login').send(credentials);

  return res;
};

export const adminLogout = async (app: NestExpressApplication) => {
  const res = await supertest(app.getHttpServer()).post('/api/v1/admin/auth/logout').send();

  return res;
};

export const login = async (app: NestExpressApplication, credentials: { email: string; password: string }) => {
  const res = await supertest(app.getHttpServer()).post('/api/v1/auth/login').send(credentials);

  return res;
};

export const logout = async (app: NestExpressApplication) => {
  const res = await supertest(app.getHttpServer()).post('/api/v1/auth/logout').send();

  return res;
};
