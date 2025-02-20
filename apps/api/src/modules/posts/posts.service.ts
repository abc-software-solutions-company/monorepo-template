import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BulkDeleteDto } from '@/common/dtos/bulk-delete.dto';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PaginationResponseDto } from '@/common/dtos/pagination-response.dto';

import { SORT_ORDER } from '@/common/constants/order.constant';

import { POST_FIELDS_TO_CREATE_OR_UPDATE, POST_GET_FIELDS, POST_STATUS } from './constants/posts.constant';
import { CreatePostDto } from './dto/create-post.dto';
import { FilterPostDto } from './dto/filter-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { PostFile } from './entities/post-file.entity';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AUDIT_LOG_TABLE_NAME } from '../audit-logs/constants/audit-logs.constant';
import { CategoriesService } from '../categories/categories.service';
import { File } from '../files/entities/file.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postRepository: Repository<Post>,
    @InjectRepository(PostFile)
    private readonly postFileRepository: Repository<PostFile>,
    private readonly categoriesService: CategoriesService,
    private readonly auditLogsService: AuditLogsService
  ) {}

  async create(creator: User, createDto: CreatePostDto) {
    const newPost = new Post();

    for (const field of POST_FIELDS_TO_CREATE_OR_UPDATE as string[]) {
      if (createDto[field] !== undefined) {
        newPost[field] = createDto[field];
      }
    }

    if (createDto.categoryId) {
      const category = await this.categoriesService.findOne(createDto.categoryId);

      newPost.category = category;
    }

    if (createDto.status) newPost.status = createDto.status;
    if (createDto.seoMeta) newPost.seoMeta = createDto.seoMeta;

    newPost.creator = creator;

    const createdPost = await this.postRepository.save(newPost);

    await Promise.all([
      this.sortImages(createDto.images, createdPost.id),
      this.auditLogsService.auditLogCreate(creator, createdPost, AUDIT_LOG_TABLE_NAME.POSTS),
    ]);

    return createdPost;
  }

  async find(filterDto: FilterPostDto) {
    const { q, order, status, sort, skip, limit, type, categoryId, year } = filterDto;

    const queryBuilder = this.createQueryBuilderWithJoins('post');

    queryBuilder.where('post.type = :type', { type });

    if (status) {
      queryBuilder.andWhere('post.status IN (:...status)', { status });
    }
    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }
    if (q) {
      const searchTerm = `%${q}%`;

      queryBuilder.andWhere(
        "EXISTS (SELECT 1 FROM jsonb_array_elements(post.nameLocalized) AS translation WHERE LOWER(translation->>'value') LIKE LOWER(:searchTerm))",
        { searchTerm }
      );
    }
    if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

      queryBuilder.andWhere('post.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
    }
    if (sort) {
      if (order) {
        queryBuilder.orderBy(`post.${sort}`, order);
      } else {
        queryBuilder.orderBy(`post.${sort}`, SORT_ORDER.DESC);
      }
    } else {
      queryBuilder.orderBy('post.createdAt', SORT_ORDER.DESC);
    }
    queryBuilder.skip(skip).take(limit);

    const [{ entities }, totalItems] = await Promise.all([queryBuilder.getRawAndEntities(), queryBuilder.getCount()]);
    const paginationDto = new PaginationDto({ totalItems, filterDto });

    return new PaginationResponseDto(entities, { paging: paginationDto });
  }

  async findOne(id: string) {
    const post = await this.createQueryBuilderWithJoins('post').where('post.id = :id', { id }).orderBy('postFile.position', SORT_ORDER.ASC).getOne();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async findBySlug(slug: string, status: POST_STATUS = POST_STATUS.PUBLISHED, hasNavigation = true) {
    const post = await this.createQueryBuilderWithJoins('post')
      .where('post.slug = :slug', { slug })
      .andWhere('post.status = :status', { status })
      .orderBy('postFile.position', SORT_ORDER.ASC)
      .getOne();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let meta = undefined;

    if (hasNavigation) {
      const [previousPost, nextPost] = await Promise.all([
        // Get previous post
        this.postRepository
          .createQueryBuilder('post')
          .select(['post.id', 'post.slug', 'post.nameLocalized'])
          .where('post.type = :type', { type: post.type })
          .andWhere('post.status = :status', { status })
          .andWhere('post.createdAt < :createdAt', { createdAt: post.createdAt })
          .orderBy('post.createdAt', 'DESC')
          .take(1)
          .getOne(),
        // Get next post
        this.postRepository
          .createQueryBuilder('post')
          .select(['post.id', 'post.slug', 'post.nameLocalized'])
          .where('post.type = :type', { type: post.type })
          .andWhere('post.status = :status', { status })
          .andWhere('post.createdAt > :createdAt', { createdAt: post.createdAt })
          .orderBy('post.createdAt', 'ASC')
          .take(1)
          .getOne(),
      ]);

      meta = {
        previous: previousPost ?? null,
        next: nextPost ?? null,
      };
    }

    return { ...post, meta };
  }

  async update(id: string, creator: User, updateDto: UpdatePostDto) {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const originalPost = structuredClone(post);

    for (const field of POST_FIELDS_TO_CREATE_OR_UPDATE as string[]) {
      if (updateDto[field] !== undefined) {
        post[field] = updateDto[field];
      }
    }
    if (updateDto.categoryId) {
      const category = await this.categoriesService.findOne(updateDto.categoryId);

      post.category = category;
    }

    if (updateDto.status) post.status = updateDto.status;
    if (updateDto.seoMeta) post.seoMeta = updateDto.seoMeta;

    const updatedPost = await this.postRepository.save(post);

    await Promise.all([
      this.sortImages(updateDto.images, originalPost.id),
      this.auditLogsService.auditLogUpdate(creator, originalPost, updatedPost, AUDIT_LOG_TABLE_NAME.POSTS),
    ]);

    return updatedPost;
  }

  async remove(id: string, creator: User) {
    const post = await this.postRepository.findOneBy({ id });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const originalPost = structuredClone(post);

    post.status = POST_STATUS.DELETED;

    const deletedPost = await this.postRepository.save(post);

    await this.auditLogsService.auditLogDelete(creator, [originalPost], [deletedPost], AUDIT_LOG_TABLE_NAME.POSTS);

    return deletedPost;
  }

  async bulkDelete(creator: User, bulkDeleteDto: BulkDeleteDto) {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .where('post.id IN (:...ids)', { ids: bulkDeleteDto.ids })
      .orderBy('post.createdAt', SORT_ORDER.ASC)
      .getMany();

    const originalPosts = posts.map(post => structuredClone(post));

    posts.forEach(post => (post.status = POST_STATUS.DELETED));

    const deletedPosts = await this.postRepository.save(posts);

    await this.auditLogsService.auditLogDelete(creator, originalPosts, deletedPosts, AUDIT_LOG_TABLE_NAME.POSTS);

    return deletedPosts;
  }

  async sortImages(images: File[] | undefined, postId: string) {
    if (!images) return;

    const existingFiles = await this.postFileRepository.find({ where: { postId } });
    const newFileIds = images.map(image => image.id);
    const filesToRemove = existingFiles.filter(file => !newFileIds.includes(file.fileId));

    if (filesToRemove.length > 0) {
      await this.postFileRepository.remove(filesToRemove);
    }

    for (let i = 0; i < images.length; i++) {
      const existingFile = await this.postFileRepository.findOne({ where: { fileId: images[i].id, postId } });

      if (existingFile) {
        existingFile.position = i + 1;
        await this.postFileRepository.save(existingFile);
      } else {
        const newFile = this.postFileRepository.create({ fileId: images[i].id, postId, position: i + 1 });

        await this.postFileRepository.save(newFile);
      }
    }
  }

  private createQueryBuilderWithJoins(alias: string) {
    return this.postRepository
      .createQueryBuilder(alias)
      .select(POST_GET_FIELDS)
      .leftJoin(`${alias}.creator`, 'user')
      .leftJoin(`${alias}.category`, 'category')
      .leftJoin(`${alias}.postFiles`, 'postFile')
      .leftJoin('postFile.image', 'image');
  }
}
