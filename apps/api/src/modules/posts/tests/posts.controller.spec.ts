import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';

import { AccessTokenGuard } from '@/modules/auth/guards/access-token.guard';

import { POST_STATUS } from '../constants/posts.constant';
import { FilterPostDto } from '../dto/filter-post.dto';
import { PostsController } from '../posts.controller';
import { PostsService } from '../posts.service';

describe('PostsController', () => {
  let controller: PostsController;
  let service: PostsService;

  const mockPostsService = {
    find: jest.fn(),
    findBySlug: jest.fn(),
  };

  const mockConfigService = {
    get: jest.fn(),
  };

  const mockJwtService = {
    verifyAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostsController],
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

    controller = module.get<PostsController>(PostsController);
    service = module.get<PostsService>(PostsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('find', () => {
    it('should call postsService.find with correct filterDto including status', async () => {
      const filterDto = { q: 'test' } as FilterPostDto;

      await controller.find(filterDto);

      expect(service.find).toHaveBeenCalledWith({ ...filterDto, status: [POST_STATUS.PUBLISHED] });
    });
  });

  describe('findBySlug', () => {
    const slug = 'test-post';
    const post = {
      id: '1',
      nameLocalized: [{ lang: 'defaultLanguage', value: 'Test Name' }],
      slug: 'post-1',
    };

    it('should get post by slug', async () => {
      mockPostsService.findBySlug.mockResolvedValue(post);

      const result = await controller.findBySlug(slug, true);

      expect(mockPostsService.findBySlug).toHaveBeenCalledWith(slug, POST_STATUS.PUBLISHED, true);
      expect(result).toBe(post);
    });

    it('should get post by slug without navigation', async () => {
      mockPostsService.findBySlug.mockResolvedValue(post);

      const result = await controller.findBySlug(slug, false);

      expect(mockPostsService.findBySlug).toHaveBeenCalledWith(slug, POST_STATUS.PUBLISHED, false);
      expect(result).toBe(post);
    });
  });
});
