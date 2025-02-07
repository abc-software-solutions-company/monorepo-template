import { NestExpressApplication } from '@nestjs/platform-express';
import { getRepositoryToken } from '@nestjs/typeorm';
import supertest from 'supertest';
import { In, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import { BulkDeleteDto } from '@/common/dtos/bulk-delete.dto';

import { SORT_ORDER } from '@/common/constants/order.constant';

import { hashPassword } from '@/common/utils/password.util';

import { AuditLogsModule } from '@/modules/audit-logs/audit-logs.module';
import { AuditLog } from '@/modules/audit-logs/entities/audit-log.entity';
import { AuthModule } from '@/modules/auth/auth.module';
import { CategoriesModule } from '@/modules/categories/categories.module';
import { CATEGORY_STATUS, CATEGORY_TYPE } from '@/modules/categories/constants/categories.constant';
import { Category } from '@/modules/categories/entities/category.entity';
import { File } from '@/modules/files/entities/file.entity';
import { FilesModule } from '@/modules/files/files.module';
import { POST_STATUS, POST_TYPE } from '@/modules/posts/constants/posts.constant';
import { CreatePostDto } from '@/modules/posts/dto/create-post.dto';
import { FilterPostDto } from '@/modules/posts/dto/filter-post.dto';
import { UpdatePostDto } from '@/modules/posts/dto/update-post.dto';
import { Post } from '@/modules/posts/entities/post.entity';
import { PostFile } from '@/modules/posts/entities/post-file.entity';
import { PostsModule } from '@/modules/posts/posts.module';
import { RefreshToken } from '@/modules/refresh-tokens/entities/refresh-token.entity';
import { RefreshTokensModule } from '@/modules/refresh-tokens/refresh-tokens.module';
import { USER_ROLE, USER_STATUS } from '@/modules/users/constants/users.constant';
import { User } from '@/modules/users/entities/user.entity';
import { UserPreference } from '@/modules/users/entities/user-preference.entity';
import { UsersModule } from '@/modules/users/users.module';

import { adminLogin } from './utils/auth.util';
import { setupTestingModules } from './utils/setup.util';

const defaultLanguage = process.env.AP_LANG_CODE ?? 'en-us';

describe('AdminPostsController (e2e)', () => {
  let app: NestExpressApplication;
  let userRepository: Repository<User>;
  let userPreferenceRepository: Repository<UserPreference>;
  let auditLogRepository: Repository<AuditLog>;
  let refreshTokenRepository: Repository<RefreshToken>;
  let fileRepository: Repository<File>;
  let categoryRepository: Repository<Category>;
  let postFileRepository: Repository<PostFile>;
  let postRepository: Repository<Post>;

  let accessToken: string;

  let category: Category;
  let file1: File;
  let file2: File;
  let file3: File;

  beforeAll(async () => {
    const { app: application, moduleFixture } = await setupTestingModules([
      AuthModule,
      UsersModule,
      RefreshTokensModule,
      AuditLogsModule,
      FilesModule,
      PostsModule,
      CategoriesModule,
    ]);

    app = application;
    auditLogRepository = moduleFixture.get(getRepositoryToken(AuditLog));
    refreshTokenRepository = moduleFixture.get(getRepositoryToken(RefreshToken));
    userPreferenceRepository = moduleFixture.get(getRepositoryToken(UserPreference));
    userRepository = moduleFixture.get(getRepositoryToken(User));
    fileRepository = moduleFixture.get(getRepositoryToken(File));
    categoryRepository = moduleFixture.get(getRepositoryToken(Category));
    postFileRepository = moduleFixture.get(getRepositoryToken(PostFile));
    postRepository = moduleFixture.get(getRepositoryToken(Post));

    await auditLogRepository.delete({});
    await userPreferenceRepository.delete({});
    await refreshTokenRepository.delete({});
    await postRepository.delete({});
    await categoryRepository.delete({});
    await fileRepository.delete({});
    await userRepository.delete({});

    await userRepository.save({
      email: 'dummy@gmail.com',
      password: hashPassword('DummyPassword@123'),
      name: 'Post Manager',
      role: USER_ROLE.ADMIN,
      status: USER_STATUS.ACTIVE,
      preference: new UserPreference(),
    });
    category = await categoryRepository.save({
      name: 'Category A',
      slug: 'category-a',
      description: 'This is a category.',
      body: 'This is the body of the category.',
      type: CATEGORY_TYPE.NEWS,
      status: CATEGORY_STATUS.PUBLISHED,
    });
    file1 = await fileRepository.save({ name: 'File A', uniqueName: 'file-a', caption: 'caption', size: 1024, ext: 'jpg', mime: 'image/jpeg' });
    file2 = await fileRepository.save({ name: 'File B', uniqueName: 'file-b', caption: 'caption', size: 1024, ext: 'jpg', mime: 'image/jpeg' });
    file3 = await fileRepository.save({ name: 'File C', uniqueName: 'file-c', caption: 'caption', size: 1024, ext: 'jpg', mime: 'image/jpeg' });

    const loginResponse = await adminLogin(app, { email: 'dummy@gmail.com', password: 'DummyPassword@123' });

    accessToken = loginResponse.body.data.accessToken;
  });

  afterAll(async () => {
    await app.close();
  });

  describe('#create', () => {
    afterEach(async () => {
      await postFileRepository.delete({});
      await postRepository.delete({});
    });

    it('should throw BadRequest if categoryId is not a UUID', async () => {
      const createPostDto: CreatePostDto = {
        slug: 'invalid-category',
        type: POST_TYPE.NEWS,
        nameLocalized: [{ lang: defaultLanguage, value: 'Invalid Category' }],
        descriptionLocalized: [{ lang: defaultLanguage, value: 'This post has a non-UUID categoryId.' }],
        bodyLocalized: [{ lang: defaultLanguage, value: 'Full content with non-UUID categoryId.' }],
        status: POST_STATUS.DRAFT,
        categoryId: 'wrong-uuid-format',
      };

      const response = await supertest(app.getHttpServer())
        .post('/api/v1/admin/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPostDto);

      expect(response.body).toMatchObject({
        statusCode: 400,
        message: ['categoryId must be a UUID'],
      });
    });

    it('should throw Unauthorized if accessToken is missing', async () => {
      const createPostDto: CreatePostDto = {
        slug: 'nestjs',
        type: POST_TYPE.NEWS,
        nameLocalized: [{ lang: defaultLanguage, value: 'NestJS' }],
        descriptionLocalized: [{ lang: defaultLanguage, value: 'short' }],
        bodyLocalized: [{ lang: defaultLanguage, value: 'full' }],
        status: POST_STATUS.PUBLISHED,
      };

      const response = await supertest(app.getHttpServer()).post('/api/v1/admin/posts').send(createPostDto);

      expect(response.body).toMatchObject({
        statusCode: 401,
        message: 'Unauthorized',
      });
    });

    it('should assign category to the post if categoryId is valid', async () => {
      const createPostDto: CreatePostDto = {
        slug: 'nestjs',
        type: POST_TYPE.NEWS,
        nameLocalized: [{ lang: defaultLanguage, value: 'NestJS' }],
        descriptionLocalized: [{ lang: defaultLanguage, value: 'short' }],
        bodyLocalized: [{ lang: defaultLanguage, value: 'full content' }],
        status: POST_STATUS.DRAFT,
        categoryId: category.id,
      };

      const response = await supertest(app.getHttpServer())
        .post('/api/v1/admin/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPostDto);

      expect(response.body.data).toMatchObject({
        id: expect.any(String),
        slug: createPostDto.slug,
        nameLocalized: createPostDto.nameLocalized,
        descriptionLocalized: createPostDto.descriptionLocalized,
        bodyLocalized: createPostDto.bodyLocalized,
        status: createPostDto.status,
        category: {
          id: category.id,
          nameLocalized: category.nameLocalized,
        } as Category,
        cover: null,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      });
    });

    it('should not assign category to the post if categoryId is invalid', async () => {
      const createPostDto: CreatePostDto = {
        slug: 'nestjs',
        type: POST_TYPE.NEWS,
        nameLocalized: [{ lang: defaultLanguage, value: 'NestJS' }],
        descriptionLocalized: [{ lang: defaultLanguage, value: 'short' }],
        bodyLocalized: [{ lang: defaultLanguage, value: 'full' }],
        status: POST_STATUS.PUBLISHED,
        categoryId: uuidv4(),
      };

      const response = await supertest(app.getHttpServer())
        .post('/api/v1/admin/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPostDto);

      expect(response.body).toMatchObject({
        statusCode: 404,
        message: 'Category not found',
      });
    });

    it('should throw NotFoundException if categoryId does not exist', async () => {
      const createPostDto: CreatePostDto = {
        slug: 'test-post',
        type: POST_TYPE.NEWS,
        nameLocalized: [{ lang: defaultLanguage, value: 'Test Post' }],
        descriptionLocalized: [{ lang: defaultLanguage, value: 'Test Description' }],
        bodyLocalized: [{ lang: defaultLanguage, value: 'Test Body' }],
        status: POST_STATUS.PUBLISHED,
        categoryId: uuidv4(),
      };
      const response = await supertest(app.getHttpServer())
        .post('/api/v1/admin/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPostDto);

      expect(response.body).toMatchObject({
        statusCode: 404,
        message: 'Category not found',
      });
    });

    it('should create a new post successfully without categoryId', async () => {
      const createPostDto: CreatePostDto = {
        slug: 'test-post',
        type: POST_TYPE.NEWS,
        nameLocalized: [{ lang: defaultLanguage, value: 'Test Post' }],
        descriptionLocalized: [{ lang: defaultLanguage, value: 'Test Description' }],
        bodyLocalized: [{ lang: defaultLanguage, value: 'Test Body' }],
        status: POST_STATUS.PUBLISHED,
      };

      const response = await supertest(app.getHttpServer())
        .post('/api/v1/admin/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPostDto);

      expect(response.body).toMatchObject({
        statusCode: 200,
        message: 'Create post successfully',
        data: { ...createPostDto, id: expect.any(String), cover: null },
      });
    });

    it('should create a new post successfully with all fields provided', async () => {
      const createPostDto: CreatePostDto = {
        slug: 'test-post',
        type: POST_TYPE.NEWS,
        nameLocalized: [{ lang: defaultLanguage, value: 'Test Post' }],
        descriptionLocalized: [{ lang: defaultLanguage, value: 'Test Description' }],
        bodyLocalized: [{ lang: defaultLanguage, value: 'Test Body' }],
        status: POST_STATUS.PUBLISHED,
        categoryId: category.id,
        images: [{ id: file1.id }, { id: file2.id }] as File[],
      };

      const response = await supertest(app.getHttpServer())
        .post('/api/v1/admin/posts')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(createPostDto);

      delete createPostDto.categoryId;
      delete createPostDto.images;

      expect(response.body).toMatchObject({
        statusCode: 200,
        message: 'Create post successfully',
        data: {
          ...createPostDto,
          id: expect.any(String),
          category: {
            id: category.id,
            nameLocalized: category.nameLocalized,
          } as Category,
          status: POST_STATUS.PUBLISHED,
          cover: null,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        },
      });
    });
  });

  describe('#find', () => {
    let post1: Post;
    let post2: Post;

    beforeEach(async () => {
      post1 = await postRepository.save({ name: 'Post A', slug: 'post-a', description: 'intro', body: 'content', status: POST_STATUS.PUBLISHED });
      post2 = await postRepository.save({ name: 'Post B', slug: 'post-b', description: 'intro', body: 'content', status: POST_STATUS.DRAFT });
    });

    afterEach(async () => {
      await postRepository.delete({ id: In([post1.id, post2.id]) });
    });

    it('returns 401 - Unauthorized if accessToken is missing', async () => {
      const response = await supertest(app.getHttpServer()).get(`/api/v1/admin/posts`);

      expect(response.body).toMatchObject({
        statusCode: 401,
        message: 'Unauthorized',
      });
    });

    it('should return a list of posts depending on the pagination', async () => {
      const filterDto = { page: 1, limit: 10 } as FilterPostDto;

      const response = await supertest(app.getHttpServer()).get(`/api/v1/admin/posts`).set('Authorization', `Bearer ${accessToken}`).send(filterDto);

      expect(response.body).toMatchObject({
        statusCode: 200,
        message: 'Get posts successfully',
        data: [
          expect.objectContaining({ name: 'Post B', slug: 'post-b', status: POST_STATUS.DRAFT }),
          expect.objectContaining({ name: 'Post A', slug: 'post-a', status: POST_STATUS.PUBLISHED }),
        ],
      });
    });

    it('should return a list of posts depending on the pagination and status filter', async () => {
      const filterDto = { page: 1, limit: 10, status: [POST_STATUS.DRAFT] } as FilterPostDto;

      const response = await supertest(app.getHttpServer())
        .get(`/api/v1/admin/posts`)
        .query(filterDto)
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      expect(response.body).toMatchObject({
        statusCode: 200,
        message: 'Get posts successfully',
        data: [expect.objectContaining({ name: 'Post B', slug: 'post-b', status: POST_STATUS.DRAFT })],
      });
    });

    it('should return a list of posts depending on the pagination and sort filter', async () => {
      const filterDto = { page: 1, limit: 10, sort: 'name' } as FilterPostDto;

      const response = await supertest(app.getHttpServer())
        .get(`/api/v1/admin/posts`)
        .query(filterDto)
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      expect(response.body).toMatchObject({
        statusCode: 200,
        message: 'Get posts successfully',
        data: [
          expect.objectContaining({ name: 'Post B', slug: 'post-b', status: POST_STATUS.DRAFT }),
          expect.objectContaining({ name: 'Post A', slug: 'post-a', status: POST_STATUS.PUBLISHED }),
        ],
      });
    });

    it('should return a list of posts depending on the pagination and sort and order filter', async () => {
      const filterDto = { page: 1, limit: 10, sort: 'name', order: SORT_ORDER.ASC } as FilterPostDto;

      const response = await supertest(app.getHttpServer())
        .get(`/api/v1/admin/posts`)
        .query(filterDto)
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      expect(response.body).toMatchObject({
        statusCode: 200,
        message: 'Get posts successfully',
        data: [
          expect.objectContaining({ name: 'Post A', slug: 'post-a', status: POST_STATUS.PUBLISHED }),
          expect.objectContaining({ name: 'Post B', slug: 'post-b', status: POST_STATUS.DRAFT }),
        ],
      });
    });

    it('should return a list of posts depending on the pagination and q filter', async () => {
      const filterDto = { page: 1, limit: 10, q: 'Post B' } as FilterPostDto;

      const response = await supertest(app.getHttpServer())
        .get(`/api/v1/admin/posts`)
        .query(filterDto)
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      expect(response.body).toMatchObject({
        statusCode: 200,
        message: 'Get posts successfully',
        data: [expect.objectContaining({ name: 'Post B', slug: 'post-b', status: POST_STATUS.DRAFT })],
      });
    });
  });

  describe('#findOne', () => {
    let post: Post;

    beforeEach(async () => {
      post = await postRepository.save({ name: 'Post A', slug: 'post-a', description: 'intro', body: 'content', status: POST_STATUS.PUBLISHED });
    });

    afterEach(async () => {
      await postRepository.delete({});
    });

    it('returns 401 - Unauthorized if accessToken is missing', async () => {
      const response = await supertest(app.getHttpServer()).get(`/api/v1/admin/posts/${post.id}`);

      expect(response.body).toMatchObject({
        statusCode: 401,
        message: 'Unauthorized',
      });
    });

    it('returns 404 - Not Found if post does not exist', async () => {
      const response = await supertest(app.getHttpServer())
        .get(`/api/v1/admin/posts/${uuidv4()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      expect(response.body).toMatchObject({
        statusCode: 404,
        message: 'Post not found',
      });
    });

    it('returns 200 - Success if post is retrieved successfully', async () => {
      const response = await supertest(app.getHttpServer())
        .get(`/api/v1/admin/posts/${post.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      expect(response.body).toMatchObject({
        statusCode: 200,
        message: 'Get post successfully',
        data: {
          id: expect.any(String),
          name: 'Post A',
          slug: 'post-a',
          description: 'intro',
          body: 'content',
          status: POST_STATUS.PUBLISHED,
          cover: null,
        },
      });
    });
  });

  describe('#update', () => {
    let post: Post;

    beforeAll(async () => {
      post = await postRepository.save({ name: 'Post A', slug: 'post-a', description: 'intro', body: 'content', status: POST_STATUS.PUBLISHED });
      await postFileRepository.save({ postId: post.id, fileId: file1.id, position: 1 });
      await postFileRepository.save({ postId: post.id, fileId: file2.id, position: 2 });
    });

    afterAll(async () => {
      await postFileRepository.delete({});
      await postRepository.delete({});
    });

    it('should throw Unauthorized if accessToken is missing', async () => {
      const updatePostDto: UpdatePostDto = {
        nameLocalized: [{ lang: defaultLanguage, value: 'New NestJS' }],
        bodyLocalized: [{ lang: defaultLanguage, value: 'full content' }],
      };

      const response = await supertest(app.getHttpServer()).patch(`/api/v1/admin/posts/${post.id}`).send(updatePostDto);

      expect(response.body).toMatchObject({
        statusCode: 401,
        message: 'Unauthorized',
      });
    });

    it('should throw Not Found if post does not exist', async () => {
      const updatePostDto: UpdatePostDto = {
        nameLocalized: [{ lang: defaultLanguage, value: 'New NestJS' }],
        bodyLocalized: [{ lang: defaultLanguage, value: 'full content' }],
      };

      const response = await supertest(app.getHttpServer())
        .patch(`/api/v1/admin/posts/${uuidv4()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatePostDto);

      expect(response.body).toMatchObject({
        statusCode: 404,
        message: 'Post not found',
      });
    });

    it('should update post with status successfully', async () => {
      const updatePostDto: UpdatePostDto = {
        nameLocalized: [{ lang: defaultLanguage, value: 'New NestJS' }],
        bodyLocalized: [{ lang: defaultLanguage, value: 'full content' }],
        status: POST_STATUS.PUBLISHED,
      };

      const response = await supertest(app.getHttpServer())
        .patch(`/api/v1/admin/posts/${post.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatePostDto);

      expect(response.body).toMatchObject({
        statusCode: 200,
        message: 'Update post successfully',
        data: { ...updatePostDto, id: expect.any(String), cover: null },
      });
    });

    it('should update post with category successfully', async () => {
      const updatePostDto: UpdatePostDto = {
        nameLocalized: [{ lang: defaultLanguage, value: 'New NestJS' }],
        bodyLocalized: [{ lang: defaultLanguage, value: 'full content' }],
        categoryId: category.id,
      };

      const response = await supertest(app.getHttpServer())
        .patch(`/api/v1/admin/posts/${post.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatePostDto);

      delete updatePostDto.categoryId;

      expect(response.body).toMatchObject({
        statusCode: 200,
        message: 'Update post successfully',
        data: {
          ...updatePostDto,
          id: expect.any(String),
          category: {
            id: category.id,
            nameLocalized: category.nameLocalized,
          } as Category,
          cover: null,
        },
      });
    });

    it('should update post with images successfully', async () => {
      const updatePostDto: UpdatePostDto = {
        nameLocalized: [{ lang: defaultLanguage, value: 'New NestJS' }],
        images: [{ id: file1.id }, { id: file2.id }, { id: file3.id }] as File[],
      };

      const response = await supertest(app.getHttpServer())
        .patch(`/api/v1/admin/posts/${post.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatePostDto);

      delete updatePostDto.images;

      expect(response.body).toMatchObject({
        statusCode: 200,
        message: 'Update post successfully',
        data: {
          ...updatePostDto,
          id: expect.any(String),
          cover: null,
        },
      });
    });

    it('should update post successfully', async () => {
      const updatePostDto: UpdatePostDto = {
        nameLocalized: [{ lang: defaultLanguage, value: 'New NestJS' }],
        bodyLocalized: [{ lang: defaultLanguage, value: 'full content' }],
      };

      const response = await supertest(app.getHttpServer())
        .patch(`/api/v1/admin/posts/${post.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(updatePostDto);

      expect(response.body).toMatchObject({
        statusCode: 200,
        message: 'Update post successfully',
        data: { ...updatePostDto, id: expect.any(String), cover: null },
      });
    });
  });

  describe('#remove', () => {
    let post: Post;

    beforeEach(async () => {
      post = await postRepository.save({ name: 'Post A', slug: 'post-a', description: 'intro', body: 'content', status: POST_STATUS.PUBLISHED });
    });

    afterEach(async () => {
      await postRepository.delete({});
    });

    it('returns 401 - Unauthorized if accessToken is missing', async () => {
      const response = await supertest(app.getHttpServer()).delete(`/api/v1/admin/posts/${post.id}`);

      expect(response.body).toMatchObject({
        statusCode: 401,
        message: 'Unauthorized',
      });
    });

    it('returns 404 - Not Found if post does not exist', async () => {
      const response = await supertest(app.getHttpServer())
        .delete(`/api/v1/admin/posts/${uuidv4()}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      expect(response.body).toMatchObject({
        statusCode: 404,
        message: 'Post not found',
      });
    });

    it('returns 200 - Success if post is deleted successfully', async () => {
      const response = await supertest(app.getHttpServer())
        .delete(`/api/v1/admin/posts/${post.id}`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send();

      expect(response.body).toMatchObject({
        statusCode: 200,
        message: 'Delete post successfully',
        data: {
          id: expect.any(String),
          name: 'Post A',
          slug: 'post-a',
          description: 'intro',
          body: 'content',
          status: POST_STATUS.DELETED,
          cover: null,
        },
      });
    });
  });

  describe('#bulkDelete', () => {
    let post1: Post;
    let post2: Post;

    beforeEach(async () => {
      [post1, post2] = await postRepository.save([
        { name: 'Post A', slug: 'post-a', description: 'intro', body: 'content', status: POST_STATUS.PUBLISHED },
        { name: 'Post B', slug: 'post-b', description: 'intro', body: 'content', status: POST_STATUS.PUBLISHED },
      ]);
    });

    afterEach(async () => {
      await postRepository.delete({});
    });

    it('should throw UnauthorizedException if accessToken is missing', async () => {
      const bulkDeleteDto: BulkDeleteDto = { ids: [post1.id, post2.id] };

      const response = await supertest(app.getHttpServer()).post(`/api/v1/admin/posts/bulk-delete`).send(bulkDeleteDto);

      expect(response.body).toMatchObject({
        statusCode: 401,
        message: 'Unauthorized',
      });
    });

    it('should throw BadRequestException if selected IDs exceed 100', async () => {
      const bulkDeleteDto: BulkDeleteDto = { ids: Array(101).fill(uuidv4()) };

      const response = await supertest(app.getHttpServer())
        .post(`/api/v1/admin/posts/bulk-delete`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(bulkDeleteDto);

      expect(response.body).toMatchObject({
        statusCode: 400,
        message: ['ids must contain no more than 100 elements'],
      });
    });

    it('should delete selected posts', async () => {
      const bulkDeleteDto: BulkDeleteDto = { ids: [post1.id, post2.id] };

      const response = await supertest(app.getHttpServer())
        .post(`/api/v1/admin/posts/bulk-delete`)
        .set('Authorization', `Bearer ${accessToken}`)
        .send(bulkDeleteDto);

      expect(response.body).toMatchObject({
        statusCode: 200,
        message: 'Delete posts successfully',
        data: expect.arrayContaining([
          {
            ...post1,
            id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            status: POST_STATUS.DELETED,
            cover: null,
          },
          {
            ...post2,
            id: expect.any(String),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            status: POST_STATUS.DELETED,
            cover: null,
          },
        ]),
      });
    });
  });
});
