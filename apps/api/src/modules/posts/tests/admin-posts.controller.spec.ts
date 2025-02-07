import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Request } from 'express';

import { BulkDeleteDto } from '@/common/dtos/bulk-delete.dto';

import { AccessTokenGuard } from '@/modules/auth/guards/access-token.guard';
import { User } from '@/modules/users/entities/user.entity';

import { AdminPostsController } from '../admin-posts.controller';
import { POST_STATUS, POST_TYPE } from '../constants/posts.constant';
import { CreatePostDto } from '../dto/create-post.dto';
import { FilterPostDto } from '../dto/filter-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { PostsService } from '../posts.service';

const defaultLanguage = process.env.AP_LANG_CODE ?? 'en-us';

describe('AdminPostsController', () => {
  let controller: AdminPostsController;
  let service: PostsService;

  const mockPostsService = {
    create: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    bulkDelete: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  const mockUser = { id: 'user-id' } as User;
  const mockRequest = { user: mockUser } as Request & { user: User };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminPostsController],
      providers: [
        {
          provide: PostsService,
          useValue: mockPostsService,
        },
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        AccessTokenGuard,
      ],
    }).compile();

    controller = module.get<AdminPostsController>(AdminPostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should call postsService.create with correct parameters', async () => {
      const createPostDto: CreatePostDto = {
        slug: 'test-post',
        type: POST_TYPE.NEWS,
        nameLocalized: [{ lang: defaultLanguage, value: 'Test Name' }],
        descriptionLocalized: [{ lang: defaultLanguage, value: 'Test Description' }],
        bodyLocalized: [{ lang: defaultLanguage, value: 'Test Body' }],
        status: POST_STATUS.PUBLISHED,
      };

      await controller.create(mockRequest, createPostDto);

      expect(service.create).toHaveBeenCalledWith(mockUser, createPostDto);
    });
  });

  describe('find', () => {
    it('should call postsService.find with correct parameters', async () => {
      const filterDto = { q: 'test', page: 1, limit: 10 } as FilterPostDto;

      await controller.find(filterDto);
      expect(service.find).toHaveBeenCalledWith(filterDto);
    });
  });

  describe('findOne', () => {
    it('should call postsService.findOne with correct id', async () => {
      const postId = 'some-id';

      await controller.findOne(postId);

      expect(service.findOne).toHaveBeenCalledWith(postId);
    });
  });

  describe('update', () => {
    it('should call postsService.update with correct parameters', async () => {
      const postId = 'some-id';
      const updatePostDto: UpdatePostDto = { nameLocalized: [{ lang: defaultLanguage, value: 'Updated Name' }] };

      await controller.update(mockRequest, postId, updatePostDto);

      expect(service.update).toHaveBeenCalledWith(postId, mockUser, updatePostDto);
    });
  });

  describe('remove', () => {
    it('should call postsService.remove with correct parameters', async () => {
      const postId = 'some-id';

      await controller.remove(mockRequest, postId);

      expect(service.remove).toHaveBeenCalledWith(postId, mockUser);
    });
  });

  describe('bulkDelete', () => {
    it('should call postsService.bulkDelete with correct parameters', async () => {
      const bulkDeletePostDto: BulkDeleteDto = { ids: ['id1', 'id2'] };

      await controller.bulkDelete(mockRequest, bulkDeletePostDto);

      expect(service.bulkDelete).toHaveBeenCalledWith(mockUser, bulkDeletePostDto);
    });
  });
});
