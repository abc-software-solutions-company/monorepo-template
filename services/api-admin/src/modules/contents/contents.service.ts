import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BulkDeleteDto } from '@/common/dtos/bulk-delete.dto';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PaginationResponseDto } from '@/common/dtos/pagination-response.dto';

import { SORT_ORDER } from '@/common/constants/order.constant';

import { CONTENT_FIELDS_TO_CREATE_OR_UPDATE, CONTENT_GET_FIELDS, CONTENT_STATUS } from './constants/contents.constant';
import { CreateContentDto } from './dto/create-content.dto';
import { FilterContentDto } from './dto/filter-content.dto';
import { UpdateContentDto } from './dto/update-content.dto';
import { Content } from './entities/content.entity';

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content)
    private readonly contentRepository: Repository<Content>
  ) {}

  async create(createDto: CreateContentDto) {
    const newContent = new Content();

    for (const field of CONTENT_FIELDS_TO_CREATE_OR_UPDATE) {
      if (createDto[field] !== undefined) {
        newContent[field] = createDto[field];
      }
    }

    if (createDto.status) newContent.status = createDto.status;

    const createdContent = await this.contentRepository.save(newContent);

    return createdContent;
  }

  async find(filterDto: FilterContentDto) {
    const { q, order, status, sort, skip, limit } = filterDto;

    const queryBuilder = this.contentRepository.createQueryBuilder('content');

    queryBuilder.select(CONTENT_GET_FIELDS);
    if (status) queryBuilder.where('content.status in (:...status)', { status });
    if (q) {
      queryBuilder
        .andWhere('LOWER(content.name) LIKE LOWER(:name)', { name: `%${q}%` })
        .orWhere('LOWER(content.description) LIKE LOWER(:description)', { description: `%${q}%` })
        .orWhere('LOWER(content.body) LIKE LOWER(:body)', { body: `%${q}%` });
    }
    if (sort) {
      if (order) {
        queryBuilder.orderBy(`content.${sort}`, order);
      } else {
        queryBuilder.orderBy(`content.${sort}`, SORT_ORDER.DESC);
      }
    } else {
      queryBuilder.orderBy('content.createdAt', SORT_ORDER.DESC);
    }
    queryBuilder.skip(skip).take(limit);

    const [{ entities }, totalItems] = await Promise.all([queryBuilder.getRawAndEntities(), queryBuilder.getCount()]);
    const paginationDto = new PaginationDto({ totalItems, filterDto });

    return new PaginationResponseDto(entities, { paging: paginationDto });
  }

  async findOne(id: string) {
    const queryBuilder = this.contentRepository.createQueryBuilder('content');

    queryBuilder.select(CONTENT_GET_FIELDS);
    queryBuilder.where('content.id = :id', { id });

    const content = await queryBuilder.getOne();

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return content;
  }

  async findBySlug(slug: string, status: CONTENT_STATUS = CONTENT_STATUS.PUBLISHED) {
    const queryBuilder = this.contentRepository.createQueryBuilder('content');

    queryBuilder.select(CONTENT_GET_FIELDS);
    queryBuilder.where('content.slug = :slug', { slug });
    queryBuilder.andWhere('content.status = :status', { status });

    const content = await queryBuilder.getOne();

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    return content;
  }

  async update(id: string, updateDto: UpdateContentDto) {
    const content = await this.contentRepository.findOneBy({ id });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    for (const field of CONTENT_FIELDS_TO_CREATE_OR_UPDATE) {
      if (updateDto[field] !== undefined) {
        content[field] = updateDto[field];
      }
    }

    if (updateDto.status) content.status = updateDto.status;

    const updatedContent = await this.contentRepository.save(content);

    return updatedContent;
  }

  async remove(id: string) {
    const content = await this.contentRepository.findOneBy({ id });

    if (!content) {
      throw new NotFoundException('Content not found');
    }

    content.status = CONTENT_STATUS.DELETED;

    const deletedContent = await this.contentRepository.save(content);

    return deletedContent;
  }

  async bulkDelete(bulkDeleteDto: BulkDeleteDto) {
    const contents = await this.contentRepository
      .createQueryBuilder('content')
      .where('content.id IN (:...ids)', { ids: bulkDeleteDto.ids })
      .orderBy('content.createdAt', SORT_ORDER.ASC)
      .getMany();

    contents.forEach(content => (content.status = CONTENT_STATUS.DELETED));

    const deletedContents = await this.contentRepository.save(contents);

    return deletedContents;
  }
}
