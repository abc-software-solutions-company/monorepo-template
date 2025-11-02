import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';

import { BulkDeleteDto } from '@/common/dtos/bulk-delete.dto';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PaginationResponseDto } from '@/common/dtos/pagination-response.dto';

import { SORT_ORDER } from '@/common/constants/order.constant';

import { FAQ_FIELDS_TO_CREATE_OR_UPDATE, FAQ_GET_FIELDS, FAQ_STATUS } from './constants/faqs.constant';
import { CreateFaqDto } from './dto/create-faq.dto';
import { FilterFaqDto } from './dto/filter-faq.dto';
import { UpdateFaqDto } from './dto/update-faq.dto';
import { Faq } from './entities/faq.entity';

@Injectable()
export class FaqsService {
  constructor(
    @InjectRepository(Faq)
    private readonly faqRepository: EntityRepository<Faq>,
    private readonly em: EntityManager
  ) {}

  async create(createDto: CreateFaqDto) {
    const newFaq = new Faq();

    for (const field of FAQ_FIELDS_TO_CREATE_OR_UPDATE as string[]) {
      if (createDto[field] !== undefined) {
        newFaq[field] = createDto[field];
      }
    }

    if (createDto.status) newFaq.status = createDto.status;

    await this.em.persistAndFlush(newFaq);

    return newFaq;
  }

  async find(filterDto: FilterFaqDto) {
    const { q, order, status, sort, skip, limit } = filterDto;

    const queryBuilder = this.createQueryBuilderWithJoins('faq');

    if (status) {
      queryBuilder.andWhere({ status: { $in: status } });
    }
    if (q) {
      const searchTerm = `%${q}%`;

      queryBuilder.andWhere({
        $raw: `EXISTS (SELECT 1 FROM jsonb_array_elements(title_localized) AS translation WHERE LOWER(translation->>'value') LIKE LOWER('${searchTerm}'))`,
      });
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
    const queryBuilder = this.createQueryBuilderWithJoins('faq');

    queryBuilder.where({ id });

    const faq = await queryBuilder.getSingleResult();

    if (!faq) {
      throw new NotFoundException('Faq not found');
    }

    return faq;
  }

  async update(id: string, updateDto: UpdateFaqDto) {
    const faq = await this.faqRepository.findOne({ id });

    if (!faq) {
      throw new NotFoundException('Faq not found');
    }

    for (const field of FAQ_FIELDS_TO_CREATE_OR_UPDATE as string[]) {
      if (updateDto[field] !== undefined) {
        faq[field] = updateDto[field];
      }
    }

    await this.em.flush();

    return faq;
  }

  async remove(id: string) {
    const faq = await this.faqRepository.findOne({ id });

    if (!faq) {
      throw new NotFoundException('Faq not found');
    }

    faq.status = FAQ_STATUS.DELETED;

    await this.em.flush();

    return faq;
  }

  async bulkDelete(bulkDeleteDto: BulkDeleteDto) {
    const faqs = await this.faqRepository
      .createQueryBuilder('post')
      .where({ id: { $in: bulkDeleteDto.ids } })
      .orderBy({ createdAt: SORT_ORDER.ASC })
      .getResult();

    faqs.forEach(post => (post.status = FAQ_STATUS.DELETED));

    await this.em.flush();

    return faqs;
  }

  private createQueryBuilderWithJoins(alias: string) {
    return this.faqRepository.createQueryBuilder(alias).select(FAQ_GET_FIELDS);
  }
}
