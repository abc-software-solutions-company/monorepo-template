import { NestExpressApplication } from '@nestjs/platform-express';
import { getRepositoryToken } from '@nestjs/typeorm';
import supertest from 'supertest';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { hashPassword } from '@/common/utils/password.util';

import { AuditLogsModule } from '@/modules/audit-logs/audit-logs.module';
import { AuditLog } from '@/modules/audit-logs/entities/audit-log.entity';
import { AuthModule } from '@/modules/auth/auth.module';
import { POST_STATUS } from '@/modules/posts/constants/posts.constant';
import { Post } from '@/modules/posts/entities/post.entity';
import { PostsModule } from '@/modules/posts/posts.module';
import { RefreshToken } from '@/modules/refresh-tokens/entities/refresh-token.entity';
import { RefreshTokensModule } from '@/modules/refresh-tokens/refresh-tokens.module';
import { USER_ROLE, USER_STATUS } from '@/modules/users/constants/users.constant';
import { User } from '@/modules/users/entities/user.entity';
import { UserPreference } from '@/modules/users/entities/user-preference.entity';
import { UsersModule } from '@/modules/users/users.module';

import { setupTestingModules } from './utils/setup.util';

describe('PostsController (e2e)', () => {
  let app: NestExpressApplication;
  let userRepository: Repository<User>;
  let userPreferenceRepository: Repository<UserPreference>;
  let auditLogRepository: Repository<AuditLog>;
  let refreshTokenRepository: Repository<RefreshToken>;
  let postRepository: Repository<Post>;

  beforeAll(async () => {
    const { app: application, moduleFixture } = await setupTestingModules([
      AuthModule,
      UsersModule,
      RefreshTokensModule,
      AuditLogsModule,
      PostsModule,
    ]);

    app = application;
    auditLogRepository = moduleFixture.get(getRepositoryToken(AuditLog));
    refreshTokenRepository = moduleFixture.get(getRepositoryToken(RefreshToken));
    userPreferenceRepository = moduleFixture.get(getRepositoryToken(UserPreference));
    userRepository = moduleFixture.get(getRepositoryToken(User));
    postRepository = moduleFixture.get(getRepositoryToken(Post));

    await auditLogRepository.delete({});
    await userPreferenceRepository.delete({});
    await refreshTokenRepository.delete({});
    await postRepository.delete({});
    await userRepository.delete({});

    await userRepository.save({
      email: 'dummy@gmail.com',
      password: hashPassword('DummyPassword@123'),
      name: 'Post Manager',
      role: USER_ROLE.ADMIN,
      status: USER_STATUS.ACTIVE,
      preference: new UserPreference(),
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('#find', () => {
    let post2: Post;

    beforeAll(async () => {
      await postRepository.save({ name: 'Post 1', slug: 'post-1', body: 'content', status: POST_STATUS.DRAFT });
      post2 = await postRepository.save({ name: 'Post 2', slug: 'post-2', body: 'content', status: POST_STATUS.PUBLISHED });
    });

    afterAll(async () => {
      await postRepository.delete({});
    });

    it('returns 200 - Success if find successfully', async () => {
      const response = await supertest(app.getHttpServer()).get(`/api/v1/posts`).send();

      expect(response.body).toMatchObject({
        statusCode: 200,
        message: 'Get posts successfully',
        data: [expect.objectContaining({ id: post2.id })],
        meta: {
          paging: {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 1,
            totalPages: 1,
          },
        },
      });
    });
  });

  describe('#findBySlug', () => {
    let post1: Post;
    let post2: Post;

    beforeAll(async () => {
      post1 = await postRepository.save({ name: 'Post 1', slug: 'post-1', body: 'content', status: POST_STATUS.DRAFT });
      post2 = await postRepository.save({ name: 'Post 2', slug: 'post-2', body: 'content', status: POST_STATUS.PUBLISHED });
    });

    afterAll(async () => {
      await postRepository.delete({});
    });

    it('returns 404 - Not Found if post not found', async () => {
      const response = await supertest(app.getHttpServer()).get(`/api/v1/posts/.by.slug/${uuidv4()}`).send();

      expect(response.body).toMatchObject({
        statusCode: 404,
        message: 'Post not found',
      });
    });

    it('returns 404 - Not Found if post status is not published', async () => {
      const response = await supertest(app.getHttpServer()).get(`/api/v1/posts/.by.slug/${post1.id}`).send();

      expect(response.body).toMatchObject({
        statusCode: 404,
        message: 'Post not found',
      });
    });

    it('returns 200 - Success if findBySlug successfully', async () => {
      const response = await supertest(app.getHttpServer()).get(`/api/v1/posts/.by.slug/${post2.slug}`).send();

      expect(response.body).toMatchObject({
        statusCode: 200,
        message: 'Get post successfully',
        data: {
          id: post2.id,
          name: 'Post 2',
          slug: 'post-2',
          body: 'content',
          status: POST_STATUS.PUBLISHED,
          cover: null,
        },
      });
    });
  });
});
