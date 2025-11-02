import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { wrap } from '@mikro-orm/core';

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
    private readonly postRepository: EntityRepository<Post>,
    @InjectRepository(PostFile)
    private readonly postFileRepository: EntityRepository<PostFile>,
    private readonly categoriesService: CategoriesService,
    private readonly auditLogsService: AuditLogsService,
    private readonly em: EntityManager
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

    await this.em.persistAndFlush(newPost);

    await Promise.all([
      this.sortImages(createDto.images, newPost.id),
      this.auditLogsService.auditLogCreate(creator, newPost, AUDIT_LOG_TABLE_NAME.POSTS),
    ]);

    return newPost;
  }

  async find(filterDto: FilterPostDto) {
    const { q, order, status, sort, skip, limit, type, categoryId, year } = filterDto;

    const queryBuilder = this.createQueryBuilderWithJoins('post');

    queryBuilder.where({ type });

    if (status) {
      queryBuilder.andWhere({ status: { $in: status } });
    }
    if (categoryId) {
      queryBuilder.andWhere({ category: categoryId });
    }
    if (q) {
      const searchTerm = `%${q}%`;

      queryBuilder.andWhere({
        $raw: `EXISTS (SELECT 1 FROM jsonb_array_elements(name_localized) AS translation WHERE LOWER(translation->>'value') LIKE LOWER('${searchTerm}'))`,
      });
    }
    if (year) {
      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59, 999);

      queryBuilder.andWhere({ createdAt: { $gte: startDate, $lte: endDate } });
    }
    if (sort) {
      if (order) {
        queryBuilder.orderBy({ [sort]: order });
      } else {
        queryBuilder.orderBy({ [sort]: SORT_ORDER.DESC });
      }
    } else {
      queryBuilder.orderBy({ createdAt: SORT_ORDER.DESC });
    }
    queryBuilder.offset(skip).limit(limit);

    const [entities, totalItems] = await queryBuilder.getResultAndCount();
    const paginationDto = new PaginationDto({ totalItems, filterDto });

    return new PaginationResponseDto(entities, { paging: paginationDto });
  }

  async findOne(id: string) {
    const post = await this.createQueryBuilderWithJoins('post').where({ id }).orderBy({ 'postFile.position': SORT_ORDER.ASC }).getSingleResult();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    return post;
  }

  async findBySlug(slug: string, status: POST_STATUS = POST_STATUS.PUBLISHED, hasNavigation = true) {
    const post = await this.createQueryBuilderWithJoins('post')
      .where({ slug, status })
      .orderBy({ 'postFile.position': SORT_ORDER.ASC })
      .getSingleResult();

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    let meta = undefined;

    if (hasNavigation) {
      const [previousPost, nextPost] = await Promise.all([
        // Get previous post
        this.postRepository
          .createQueryBuilder('post')
          .select(['id', 'slug', 'nameLocalized'])
          .where({ type: post.type, status, createdAt: { $lt: post.createdAt } })
          .orderBy({ createdAt: 'DESC' })
          .limit(1)
          .getSingleResult(),
        // Get next post
        this.postRepository
          .createQueryBuilder('post')
          .select(['id', 'slug', 'nameLocalized'])
          .where({ type: post.type, status, createdAt: { $gt: post.createdAt } })
          .orderBy({ createdAt: 'ASC' })
          .limit(1)
          .getSingleResult(),
      ]);

      meta = {
        previous: previousPost ?? null,
        next: nextPost ?? null,
      };
    }

    return { ...post, meta };
  }

  async update(id: string, creator: User, updateDto: UpdatePostDto) {
    const post = await this.postRepository.findOne({ id });

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

    await this.em.flush();

    await Promise.all([
      this.sortImages(updateDto.images, originalPost.id),
      this.auditLogsService.auditLogUpdate(creator, originalPost, post, AUDIT_LOG_TABLE_NAME.POSTS),
    ]);

    return post;
  }

  async remove(id: string, creator: User) {
    const post = await this.postRepository.findOne({ id });

    if (!post) {
      throw new NotFoundException('Post not found');
    }

    const originalPost = structuredClone(post);

    post.status = POST_STATUS.DELETED;

    await this.em.flush();

    await this.auditLogsService.auditLogDelete(creator, [originalPost], [post], AUDIT_LOG_TABLE_NAME.POSTS);

    return post;
  }

  async bulkDelete(creator: User, bulkDeleteDto: BulkDeleteDto) {
    const posts = await this.postRepository
      .createQueryBuilder('post')
      .where({ id: { $in: bulkDeleteDto.ids } })
      .orderBy({ createdAt: SORT_ORDER.ASC })
      .getResult();

    const originalPosts = posts.map(post => structuredClone(post));

    posts.forEach(post => (post.status = POST_STATUS.DELETED));

    await this.em.flush();

    await this.auditLogsService.auditLogDelete(creator, originalPosts, posts, AUDIT_LOG_TABLE_NAME.POSTS);

    return posts;
  }

  async sortImages(images: File[] | undefined, postId: string) {
    if (!images) return;

    const existingFiles = await this.postFileRepository.find({ postId });
    const newFileIds = images.map(image => image.id);
    const filesToRemove = existingFiles.filter(file => !newFileIds.includes(file.fileId));

    if (filesToRemove.length > 0) {
      await this.em.removeAndFlush(filesToRemove);
    }

    for (let i = 0; i < images.length; i++) {
      const existingFile = await this.postFileRepository.findOne({ fileId: images[i].id, postId });

      if (existingFile) {
        existingFile.position = i + 1;
        await this.em.flush();
      } else {
        const newFile = this.postFileRepository.create({ fileId: images[i].id, postId, position: i + 1 });

        await this.em.persistAndFlush(newFile);
      }
    }
  }

  private createQueryBuilderWithJoins(alias: string) {
    return this.postRepository
      .createQueryBuilder(alias)
      .select(POST_GET_FIELDS)
      .leftJoinAndSelect(`${alias}.creator`, 'user')
      .leftJoinAndSelect(`${alias}.category`, 'category')
      .leftJoinAndSelect(`${alias}.postFiles`, 'postFile')
      .leftJoinAndSelect('postFile.image', 'image');
  }
}
