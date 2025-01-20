import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { BulkDeleteDto } from '@/common/dtos/bulk-delete.dto';

import { SORT_ORDER } from '@/common/constants/order.constant';

import { AuditLogsService } from '@/modules/audit-logs/audit-logs.service';
import { AUDIT_LOG_TABLE_NAME } from '@/modules/audit-logs/constants/audit-logs.constant';
import { CategoriesService } from '@/modules/categories/categories.service';
import { Category } from '@/modules/categories/entities/category.entity';
import { File } from '@/modules/files/entities/file.entity';
import { User } from '@/modules/users/entities/user.entity';

import { POST_GET_FIELDS, POST_STATUS, POST_TYPE } from '../constants/posts.constant';
import { CreatePostDto } from '../dto/create-post.dto';
import { FilterPostDto } from '../dto/filter-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Post } from '../entities/post.entity';
import { PostFile } from '../entities/post-file.entity';
import { PostsService } from '../posts.service';

const defaultLanguage = process.env.AP_LANG_CODE ?? 'en-us';

describe('PostsService', () => {
  let service: PostsService;

  const mockPostRepository = {
    createQueryBuilder: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getOne: jest.fn(),
      getRawAndEntities: jest.fn(),
      getCount: jest.fn(),
    }),
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    findOneBy: jest.fn(),
    preload: jest.fn(),
    remove: jest.fn(),
  };

  const mockPostFileRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    save: jest.fn(),
    create: jest.fn(),
    remove: jest.fn(),
  };

  const mockCategoriesService = {
    findOne: jest.fn(),
  };

  const mockAuditLogsService = {
    auditLogCreate: jest.fn(),
    auditLogUpdate: jest.fn(),
    auditLogDelete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostsService,
        { provide: getRepositoryToken(Post), useValue: mockPostRepository },
        { provide: getRepositoryToken(PostFile), useValue: mockPostFileRepository },
        { provide: CategoriesService, useValue: mockCategoriesService },
        { provide: AuditLogsService, useValue: mockAuditLogsService },
      ],
    }).compile();

    service = module.get<PostsService>(PostsService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('create', () => {
    const creator = { id: '1', name: 'User' } as User;
    const category = { id: '1', nameLocalized: [{ lang: defaultLanguage, value: 'Category' }] } as Category;
    const post = {
      id: '1',
      slug: 'test-post',
      nameLocalized: [{ lang: defaultLanguage, value: 'Test Name' }],
      bodyLocalized: [{ lang: defaultLanguage, value: 'Test Body' }],
      status: POST_STATUS.PUBLISHED,
    } as Post;
    const baseCreateDto: CreatePostDto = {
      slug: 'test-post',
      type: POST_TYPE.DEFAULT,
      nameLocalized: [{ lang: defaultLanguage, value: 'Test Post' }],
      descriptionLocalized: [{ lang: defaultLanguage, value: 'Test Description' }],
      bodyLocalized: [{ lang: defaultLanguage, value: 'Test Body' }],
      status: POST_STATUS.PUBLISHED,
      images: [{ id: '1' }, { id: '2' }] as File[],
    };

    it('should create a new post successfully with all fields provided', async () => {
      const createDto = baseCreateDto;

      mockPostRepository.save.mockResolvedValue(post);
      jest.spyOn(service, 'sortImages').mockResolvedValue();

      const result = await service.create(creator, createDto);

      expect(mockPostRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: createDto.slug,
          status: createDto.status,
          nameLocalized: createDto.nameLocalized,
          descriptionLocalized: createDto.descriptionLocalized,
          bodyLocalized: createDto.bodyLocalized,
        })
      );
      expect(service.sortImages).toHaveBeenCalledWith(createDto.images, post.id);
      expect(mockAuditLogsService.auditLogCreate).toHaveBeenCalledWith(creator, post, AUDIT_LOG_TABLE_NAME.POSTS);
      expect(result).toEqual(post);
    });

    it('should create a new post successfully with a valid categoryId', async () => {
      const createDto = { ...baseCreateDto, categoryId: 'valid-category-id' };

      mockCategoriesService.findOne.mockResolvedValue(category);
      mockPostRepository.save.mockResolvedValue(post);
      jest.spyOn(service, 'sortImages').mockResolvedValue();

      const result = await service.create(creator, createDto);

      expect(mockCategoriesService.findOne).toHaveBeenCalledWith(createDto.categoryId);
      expect(mockPostRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: createDto.slug,
          status: createDto.status,
          nameLocalized: createDto.nameLocalized,
          descriptionLocalized: createDto.descriptionLocalized,
          bodyLocalized: createDto.bodyLocalized,
          category,
        })
      );
      expect(service.sortImages).toHaveBeenCalledWith(createDto.images, post.id);
      expect(mockAuditLogsService.auditLogCreate).toHaveBeenCalledWith(creator, post, AUDIT_LOG_TABLE_NAME.POSTS);
      expect(result).toEqual(post);
    });

    it('should create a new post successfully without categoryId', async () => {
      const createDto = { ...baseCreateDto, categoryId: undefined };

      mockPostRepository.save.mockResolvedValue(post);
      jest.spyOn(service, 'sortImages').mockResolvedValue();

      const result = await service.create(creator, createDto);

      expect(mockCategoriesService.findOne).not.toHaveBeenCalled();
      expect(mockPostRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: createDto.slug,
          nameLocalized: createDto.nameLocalized,
          descriptionLocalized: createDto.descriptionLocalized,
          bodyLocalized: createDto.bodyLocalized,
          status: createDto.status,
        })
      );
      expect(service.sortImages).toHaveBeenCalledWith(createDto.images, post.id);
      expect(mockAuditLogsService.auditLogCreate).toHaveBeenCalledWith(creator, post, AUDIT_LOG_TABLE_NAME.POSTS);
      expect(result).toEqual(post);
    });

    it('should handle post creation with no status provided', async () => {
      const createDto = { ...baseCreateDto } as CreatePostDto;

      mockPostRepository.save.mockResolvedValue(post);
      jest.spyOn(service, 'sortImages').mockResolvedValue();

      const result = await service.create(creator, createDto);

      expect(mockPostRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          slug: createDto.slug,
        })
      );
      expect(service.sortImages).toHaveBeenCalledWith(createDto.images, post.id);
      expect(mockAuditLogsService.auditLogCreate).toHaveBeenCalledWith(creator, post, AUDIT_LOG_TABLE_NAME.POSTS);
      expect(result).toEqual(post);
    });

    it('should handle post creation with multiple images', async () => {
      const createDto = { ...baseCreateDto, images: [{ id: 'image1' }, { id: 'image2' }] as File[] };

      mockPostRepository.save.mockResolvedValue(post);
      jest.spyOn(service, 'sortImages').mockResolvedValue();

      const result = await service.create(creator, createDto);

      expect(service.sortImages).toHaveBeenCalledWith(createDto.images, post.id);
      expect(mockPostRepository.save).toHaveBeenCalledWith(expect.anything());
      expect(mockAuditLogsService.auditLogCreate).toHaveBeenCalledWith(creator, post, AUDIT_LOG_TABLE_NAME.POSTS);
      expect(result).toEqual(post);
    });
  });

  describe('find', () => {
    it('should return a list of posts depending on the pagination', async () => {
      const filterDto = { page: 1, limit: 10 } as FilterPostDto;
      const posts = [{ id: 'post1' }, { id: 'post2' }] as Post[];

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(2),
        getRawAndEntities: jest.fn().mockResolvedValue({ entities: posts }),
      };

      mockPostRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.find(filterDto);

      expect(mockPostRepository.createQueryBuilder).toHaveBeenCalledWith('post');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(POST_GET_FIELDS);
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.creator', 'user');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.category', 'category');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.postFiles', 'postFile');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('postFile.image', 'image');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('post.type = :type', { type: filterDto.type });
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(filterDto.skip);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(filterDto.limit);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('post.createdAt', SORT_ORDER.DESC);
      expect(mockQueryBuilder.getCount).toHaveBeenCalled();
      expect(mockQueryBuilder.getRawAndEntities).toHaveBeenCalled();

      expect(result).toEqual(
        expect.objectContaining({
          data: [{ id: 'post1' }, { id: 'post2' }],
          meta: expect.objectContaining({
            paging: expect.objectContaining({ currentPage: 1, itemsPerPage: 10, totalItems: 2, totalPages: 1 }),
          }),
        })
      );
    });

    it('should return a list of posts depending on the pagination and status filter', async () => {
      const filterDto = { page: 1, limit: 10, status: [POST_STATUS.PUBLISHED] } as FilterPostDto;
      const posts = [
        { id: 'post1', status: POST_STATUS.PUBLISHED },
        { id: 'post2', status: POST_STATUS.PUBLISHED },
      ] as Post[];

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(2),
        getRawAndEntities: jest.fn().mockResolvedValue({ entities: posts }),
      };

      mockPostRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.find(filterDto);

      expect(mockPostRepository.createQueryBuilder).toHaveBeenCalledWith('post');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(POST_GET_FIELDS);
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.creator', 'user');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.category', 'category');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.postFiles', 'postFile');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('postFile.image', 'image');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('post.type = :type', { type: filterDto.type });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('post.status IN (:...status)', { status: filterDto.status });
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(filterDto.skip);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(filterDto.limit);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('post.createdAt', SORT_ORDER.DESC);
      expect(mockQueryBuilder.getCount).toHaveBeenCalled();
      expect(mockQueryBuilder.getRawAndEntities).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          data: posts,
          meta: expect.objectContaining({
            paging: expect.objectContaining({ currentPage: 1, itemsPerPage: 10, totalItems: 2, totalPages: 1 }),
          }),
        })
      );
    });

    it('should return a list of posts depending on the pagination and sort filter', async () => {
      const filterDto = { page: 1, limit: 10, status: [POST_STATUS.PUBLISHED], sort: 'createdAt', order: SORT_ORDER.ASC } as FilterPostDto;
      const posts = [
        { id: 'post1', status: POST_STATUS.PUBLISHED },
        { id: 'post2', status: POST_STATUS.PUBLISHED },
      ] as Post[];

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(2),
        getRawAndEntities: jest.fn().mockResolvedValue({ entities: posts }),
      };

      mockPostRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.find(filterDto);

      expect(mockPostRepository.createQueryBuilder).toHaveBeenCalledWith('post');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(POST_GET_FIELDS);
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.creator', 'user');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.category', 'category');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.postFiles', 'postFile');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('postFile.image', 'image');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('post.type = :type', { type: filterDto.type });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('post.status IN (:...status)', { status: filterDto.status });
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(filterDto.skip);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(filterDto.limit);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('post.createdAt', SORT_ORDER.ASC);
      expect(mockQueryBuilder.getCount).toHaveBeenCalled();
      expect(mockQueryBuilder.getRawAndEntities).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          data: posts,
          meta: expect.objectContaining({
            paging: expect.objectContaining({ currentPage: 1, itemsPerPage: 10, totalItems: 2, totalPages: 1 }),
          }),
        })
      );
    });

    it('should return a list of posts depending on the pagination and sort filter with default order', async () => {
      const filterDto = { page: 1, limit: 10, status: [POST_STATUS.PUBLISHED], sort: 'createdAt' } as FilterPostDto;
      const posts = [
        { id: 'post1', status: POST_STATUS.PUBLISHED },
        { id: 'post2', status: POST_STATUS.PUBLISHED },
      ] as Post[];

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(2),
        getRawAndEntities: jest.fn().mockResolvedValue({ entities: posts }),
      };

      mockPostRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.find(filterDto);

      expect(mockPostRepository.createQueryBuilder).toHaveBeenCalledWith('post');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(POST_GET_FIELDS);
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.creator', 'user');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.category', 'category');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.postFiles', 'postFile');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('postFile.image', 'image');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('post.type = :type', { type: filterDto.type });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('post.status IN (:...status)', { status: filterDto.status });
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(filterDto.skip);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(filterDto.limit);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('post.createdAt', SORT_ORDER.DESC);
      expect(mockQueryBuilder.getCount).toHaveBeenCalled();
      expect(mockQueryBuilder.getRawAndEntities).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          data: posts,
          meta: expect.objectContaining({
            paging: expect.objectContaining({ currentPage: 1, itemsPerPage: 10, totalItems: 2, totalPages: 1 }),
          }),
        })
      );
    });

    it('should return a list of posts depending on the pagination and q filter', async () => {
      const filterDto = { page: 1, limit: 10, q: 'test', status: [POST_STATUS.PUBLISHED], sort: 'createdAt', order: SORT_ORDER.ASC } as FilterPostDto;
      const posts = [
        { id: 'post1', status: POST_STATUS.PUBLISHED },
        { id: 'post2', status: POST_STATUS.PUBLISHED },
      ] as Post[];

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(2),
        getRawAndEntities: jest.fn().mockResolvedValue({ entities: posts }),
      };

      mockPostRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.find(filterDto);

      const searchTerm = `%${filterDto.q}%`;

      expect(mockPostRepository.createQueryBuilder).toHaveBeenCalledWith('post');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(POST_GET_FIELDS);
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.creator', 'user');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.category', 'category');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.postFiles', 'postFile');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('postFile.image', 'image');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('post.type = :type', { type: filterDto.type });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('post.status IN (:...status)', { status: filterDto.status });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith(
        "EXISTS (SELECT 1 FROM jsonb_array_elements(post.nameLocalized) AS translation WHERE LOWER(translation->>'value') LIKE LOWER(:searchTerm))",
        { searchTerm }
      );
      expect(mockQueryBuilder.skip).toHaveBeenCalledWith(filterDto.skip);
      expect(mockQueryBuilder.take).toHaveBeenCalledWith(filterDto.limit);
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('post.createdAt', SORT_ORDER.ASC);
      expect(mockQueryBuilder.getCount).toHaveBeenCalled();
      expect(mockQueryBuilder.getRawAndEntities).toHaveBeenCalled();
      expect(result).toEqual(
        expect.objectContaining({
          data: posts,
          meta: expect.objectContaining({
            paging: expect.objectContaining({ currentPage: 1, itemsPerPage: 10, totalItems: 2, totalPages: 1 }),
          }),
        })
      );
    });
  });

  describe('findOne', () => {
    it('should throw NotFoundException if post is not found', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      mockPostRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await expect(service.findOne('unknown-id')).rejects.toThrow(NotFoundException);
    });

    it('should retrieve a post by ID', async () => {
      const post = { id: '1', nameLocalized: [{ lang: defaultLanguage, value: 'Test Name' }] } as Post;

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(post),
      };

      mockPostRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findOne(post.id);

      expect(mockPostRepository.createQueryBuilder).toHaveBeenCalledWith('post');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(POST_GET_FIELDS);
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.creator', 'user');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.category', 'category');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.postFiles', 'postFile');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('postFile.image', 'image');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('post.id = :id', { id: post.id });
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('postFile.position', SORT_ORDER.ASC);
      expect(result).toEqual(post);
    });
  });

  describe('findBySlug', () => {
    it('should throw NotFoundException if post is not found by slug', async () => {
      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(null),
      };

      mockPostRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      await expect(service.findBySlug('unknown-slug', POST_STATUS.PUBLISHED)).rejects.toThrow(NotFoundException);
    });

    it('should use default status if none is provided', async () => {
      const post = { id: '1', slug: 'post-1', nameLocalized: [{ lang: defaultLanguage, value: 'Test Name' }] } as Post;

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(post),
      };

      mockPostRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findBySlug(post.slug);

      expect(mockPostRepository.createQueryBuilder).toHaveBeenCalledWith('post');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(POST_GET_FIELDS);
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.creator', 'user');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.category', 'category');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.postFiles', 'postFile');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('postFile.image', 'image');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('post.slug = :slug', { slug: post.slug });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('post.status = :status', { status: POST_STATUS.PUBLISHED });
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('postFile.position', SORT_ORDER.ASC);
      expect(result).toEqual(post);
    });

    it('should retrieve a post by slug', async () => {
      const post = { id: '1', slug: 'post-1', nameLocalized: [{ lang: defaultLanguage, value: 'Test Name' }] } as Post;
      const status = POST_STATUS.PUBLISHED;

      const mockQueryBuilder = {
        select: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(post),
      };

      mockPostRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);

      const result = await service.findBySlug(post.slug, status);

      expect(mockPostRepository.createQueryBuilder).toHaveBeenCalledWith('post');
      expect(mockQueryBuilder.select).toHaveBeenCalledWith(POST_GET_FIELDS);
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.creator', 'user');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.category', 'category');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('post.postFiles', 'postFile');
      expect(mockQueryBuilder.leftJoin).toHaveBeenCalledWith('postFile.image', 'image');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('post.slug = :slug', { slug: post.slug });
      expect(mockQueryBuilder.andWhere).toHaveBeenCalledWith('post.status = :status', { status });
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('postFile.position', SORT_ORDER.ASC);
      expect(result).toEqual(post);
    });
  });

  describe('update', () => {
    it('should update an existing post and return it', async () => {
      const updateDto: UpdatePostDto = { nameLocalized: [{ lang: defaultLanguage, value: 'Updated Name' }] };
      const postId = 'post-id';
      const creator = { id: 'user-id' } as User;
      const existingPost = { id: postId, nameLocalized: [{ lang: defaultLanguage, value: 'Old Name' }] } as Post;
      const savedPost = { ...existingPost, ...updateDto } as Post;

      mockPostRepository.findOneBy.mockResolvedValue(existingPost);
      mockPostRepository.save.mockResolvedValue(savedPost);

      const result = await service.update(postId, creator, updateDto);

      expect(mockPostRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.findOneBy).toHaveBeenCalledWith({ id: postId });
      expect(mockPostRepository.save).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.save).toHaveBeenCalledWith(expect.objectContaining(updateDto));
      expect(mockAuditLogsService.auditLogUpdate).toHaveBeenCalledTimes(1);
      expect(result).toEqual(savedPost);
    });

    it('should throw NotFoundException if post is not found', async () => {
      const updateDto: UpdatePostDto = { nameLocalized: [{ lang: defaultLanguage, value: 'Old Name' }] };
      const postId = 'post-id';
      const creator = { id: 'user-id' } as User;

      mockPostRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(postId, creator, updateDto)).rejects.toThrow(NotFoundException);
      expect(mockPostRepository.save).not.toHaveBeenCalled();
      expect(mockAuditLogsService.auditLogUpdate).not.toHaveBeenCalled();
    });

    it('should update category when provided', async () => {
      const updateDto: UpdatePostDto = { categoryId: 'new-category-id' };
      const postId = 'post-id';
      const creator = { id: 'user-id' } as User;
      const existingPost = { id: postId, category: null } as Post;
      const newCategory = { id: 'new-category-id' };

      mockPostRepository.findOneBy.mockResolvedValue(existingPost);
      mockCategoriesService.findOne.mockResolvedValue(newCategory);
      mockPostRepository.save.mockResolvedValue({ ...existingPost, category: newCategory });

      await service.update(postId, creator, updateDto);

      expect(mockCategoriesService.findOne).toHaveBeenCalledWith('new-category-id');
      expect(mockPostRepository.save).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.save).toHaveBeenCalledWith(expect.objectContaining({ category: newCategory }));
    });

    it('should update post status when provided', async () => {
      const updateDto: UpdatePostDto = { status: POST_STATUS.PUBLISHED };
      const postId = 'post-id';
      const creator = { id: 'user-id' } as User;
      const existingPost = { id: postId, status: POST_STATUS.DRAFT } as Post;

      mockPostRepository.findOneBy.mockResolvedValue(existingPost);
      mockPostRepository.save.mockResolvedValue({ ...existingPost, status: updateDto.status });

      const result = await service.update(postId, creator, updateDto);

      expect(mockPostRepository.findOneBy).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.findOneBy).toHaveBeenCalledWith({ id: postId });
      expect(mockPostRepository.save).toHaveBeenCalledTimes(1);
      expect(mockPostRepository.save).toHaveBeenCalledWith(expect.objectContaining({ status: updateDto.status }));
      expect(mockAuditLogsService.auditLogUpdate).toHaveBeenCalledTimes(1);
      expect(result.status).toEqual(updateDto.status);
    });

    it('should handle images and audit log update', async () => {
      const updateDto: UpdatePostDto = {
        images: [{ id: 'image1' }, { id: 'image2' }] as File[],
      };
      const postId = 'post-id';
      const creator = { id: 'user-id' } as User;
      const existingPost = { id: postId, images: [] } as Post;

      mockPostRepository.findOneBy.mockResolvedValue(existingPost);
      mockPostRepository.save.mockResolvedValue({ ...existingPost, images: updateDto.images });

      mockPostFileRepository.find.mockResolvedValue([]);
      mockPostFileRepository.findOne.mockResolvedValueOnce(null).mockResolvedValueOnce(null);
      mockPostFileRepository.create.mockImplementation(entity => entity);

      await service.update(postId, creator, updateDto);

      expect(mockPostFileRepository.find).toHaveBeenCalledWith({ where: { postId } });

      expect(mockPostFileRepository.findOne).toHaveBeenCalledWith({ where: { fileId: 'image1', postId } });
      expect(mockPostFileRepository.findOne).toHaveBeenCalledWith({ where: { fileId: 'image2', postId } });

      expect(mockPostFileRepository.create).toHaveBeenCalledWith({ fileId: 'image1', postId, position: 1 });
      expect(mockPostFileRepository.create).toHaveBeenCalledWith({ fileId: 'image2', postId, position: 2 });
      expect(mockPostFileRepository.save).toHaveBeenCalledWith({ fileId: 'image1', postId, position: 1 });
      expect(mockPostFileRepository.save).toHaveBeenCalledWith({ fileId: 'image2', postId, position: 2 });

      expect(mockAuditLogsService.auditLogUpdate).toHaveBeenCalledTimes(1);
    });
  });

  describe('remove', () => {
    it('should throw NotFoundException if post does not exist', async () => {
      const creator = { id: '1', name: 'User' } as User;

      mockPostRepository.findOneBy.mockResolvedValue(null);

      await expect(service.remove('unknown-id', creator)).rejects.toThrow(NotFoundException);
    });

    it('should delete a post by ID', async () => {
      const creator = { id: '1', name: 'User' } as User;
      const originalPost = { id: '1', nameLocalized: [{ lang: defaultLanguage, value: 'Original Name' }], status: POST_STATUS.PUBLISHED } as Post;
      const originalPostClone = structuredClone(originalPost);
      const deletedPost = { ...originalPost, status: POST_STATUS.DELETED } as Post;

      mockPostRepository.findOneBy.mockResolvedValue(originalPost);
      mockPostRepository.save.mockResolvedValue(deletedPost);

      const result = await service.remove(originalPost.id, creator);

      expect(mockPostRepository.findOneBy).toHaveBeenCalledWith({ id: originalPost.id });
      expect(mockPostRepository.save).toHaveBeenCalledWith(deletedPost);
      expect(mockAuditLogsService.auditLogDelete).toHaveBeenCalledWith(creator, [originalPostClone], [deletedPost], AUDIT_LOG_TABLE_NAME.POSTS);
      expect(result).toEqual(deletedPost);
    });
  });

  describe('bulkDelete', () => {
    it('should delete selected posts', async () => {
      const creator = { id: '1' } as User;
      const bulkDeleteDto: BulkDeleteDto = { ids: ['1', '2'] };
      const originalPosts = [
        { id: '1', status: POST_STATUS.PUBLISHED },
        { id: '2', status: POST_STATUS.PUBLISHED },
      ] as Post[];
      const deletedPosts = [
        { id: '1', status: POST_STATUS.DELETED },
        { id: '2', status: POST_STATUS.DELETED },
      ] as Post[];
      const originalPostsClone = structuredClone(originalPosts);

      const mockQueryBuilder = {
        where: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue(originalPosts),
      };

      mockPostRepository.createQueryBuilder.mockReturnValue(mockQueryBuilder);
      mockPostRepository.save.mockResolvedValue(deletedPosts);

      const result = await service.bulkDelete(creator, bulkDeleteDto);

      expect(mockPostRepository.createQueryBuilder).toHaveBeenCalledWith('post');
      expect(mockQueryBuilder.where).toHaveBeenCalledWith('post.id IN (:...ids)', { ids: bulkDeleteDto.ids });
      expect(mockQueryBuilder.orderBy).toHaveBeenCalledWith('post.createdAt', SORT_ORDER.ASC);
      expect(mockQueryBuilder.getMany).toHaveBeenCalled();
      expect(mockPostRepository.save).toHaveBeenCalledWith(deletedPosts);
      expect(mockAuditLogsService.auditLogDelete).toHaveBeenCalledWith(creator, originalPostsClone, deletedPosts, 'posts');
      expect(result).toEqual(deletedPosts);
    });
  });

  describe('sortImages', () => {
    it('should not sort images if images are undefined', async () => {
      await service.sortImages(undefined, 'some-post-id');

      expect(mockPostFileRepository.findOne).not.toHaveBeenCalled();
      expect(mockPostFileRepository.save).not.toHaveBeenCalled();
    });

    it('should update position of existing images and remove non-matching files', async () => {
      const images = [{ id: 'image1' }, { id: 'image2' }] as File[];
      const postId = 'post-id';

      const existingFiles = [
        { fileId: 'image1', postId, position: 1 },
        { fileId: 'image2', postId, position: 2 },
        { fileId: 'image3', postId, position: 3 },
      ] as PostFile[];

      const existingFile1 = { fileId: 'image1', postId, position: 1 } as PostFile;
      const existingFile2 = { fileId: 'image2', postId, position: 2 } as PostFile;

      mockPostFileRepository.find.mockResolvedValue(existingFiles);
      mockPostFileRepository.findOne.mockResolvedValueOnce(existingFile1).mockResolvedValueOnce(existingFile2);

      await service.sortImages(images, postId);

      expect(mockPostFileRepository.find).toHaveBeenCalledWith({ where: { postId } });
      expect(mockPostFileRepository.remove).toHaveBeenCalledWith([existingFiles[2]]);

      expect(mockPostFileRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockPostFileRepository.findOne).toHaveBeenCalledWith({ where: { fileId: 'image1', postId } });
      expect(mockPostFileRepository.findOne).toHaveBeenCalledWith({ where: { fileId: 'image2', postId } });
      expect(mockPostFileRepository.save).toHaveBeenCalledWith({ ...existingFile1, position: 1 });
      expect(mockPostFileRepository.save).toHaveBeenCalledWith({ ...existingFile2, position: 2 });
    });

    it('should create new PostFile entries for new images', async () => {
      const images = [{ id: 'image1' }, { id: 'image2' }] as File[];
      const postId = 'post-id';

      mockPostFileRepository.find.mockResolvedValue([]);
      mockPostFileRepository.findOne.mockResolvedValue(null);
      mockPostFileRepository.create.mockImplementation(entity => entity);

      await service.sortImages(images, postId);

      expect(mockPostFileRepository.find).toHaveBeenCalledWith({ where: { postId } });
      expect(mockPostFileRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockPostFileRepository.findOne).toHaveBeenCalledWith({ where: { fileId: 'image1', postId } });
      expect(mockPostFileRepository.findOne).toHaveBeenCalledWith({ where: { fileId: 'image2', postId } });
      expect(mockPostFileRepository.create).toHaveBeenCalledTimes(2);
      expect(mockPostFileRepository.create).toHaveBeenCalledWith({ fileId: 'image1', postId, position: 1 });
      expect(mockPostFileRepository.create).toHaveBeenCalledWith({ fileId: 'image2', postId, position: 2 });
      expect(mockPostFileRepository.save).toHaveBeenCalledTimes(2);
      expect(mockPostFileRepository.save).toHaveBeenCalledWith({ fileId: 'image1', postId, position: 1 });
      expect(mockPostFileRepository.save).toHaveBeenCalledWith({ fileId: 'image2', postId, position: 2 });
    });

    it('should handle a mix of existing and new images', async () => {
      const images = [{ id: 'image1' }, { id: 'image2' }] as File[];
      const postId = 'post-id';

      const existingFile1 = { fileId: 'image1', postId, position: 1 } as PostFile;

      mockPostFileRepository.find.mockResolvedValue([existingFile1]);
      mockPostFileRepository.findOne.mockResolvedValueOnce(existingFile1).mockResolvedValueOnce(null);
      mockPostFileRepository.create.mockImplementation(entity => entity);

      await service.sortImages(images, postId);

      expect(mockPostFileRepository.find).toHaveBeenCalledWith({ where: { postId } });
      expect(mockPostFileRepository.findOne).toHaveBeenCalledTimes(2);
      expect(mockPostFileRepository.findOne).toHaveBeenCalledWith({ where: { fileId: 'image1', postId } });
      expect(mockPostFileRepository.findOne).toHaveBeenCalledWith({ where: { fileId: 'image2', postId } });

      expect(mockPostFileRepository.save).toHaveBeenCalledTimes(2);
      expect(mockPostFileRepository.save).toHaveBeenCalledWith({ ...existingFile1, position: 1 });
      expect(mockPostFileRepository.save).toHaveBeenCalledWith({ fileId: 'image2', postId, position: 2 });
    });
  });
});
