import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    private readonly faqRepository: Repository<Faq>
  ) {}

  async create(createDto: CreateFaqDto) {
    const newFaq = new Faq();

    for (const field of FAQ_FIELDS_TO_CREATE_OR_UPDATE as string[]) {
      if (createDto[field] !== undefined) {
        newFaq[field] = createDto[field];
      }
    }

    if (createDto.status) newFaq.status = createDto.status;

    const createdFaq = await this.faqRepository.save(newFaq);

    return createdFaq;
  }

  async find(filterDto: FilterFaqDto) {
    const { q, order, status, sort, skip, limit } = filterDto;

    const queryBuilder = this.createQueryBuilderWithJoins('faq');

    if (status) {
      queryBuilder.andWhere('faq.status in (:...status)', { status });
    }
    if (q) {
      const searchTerm = `%${q}%`;

      queryBuilder.andWhere(
        "EXISTS (SELECT 1 FROM jsonb_array_elements(faq.titleLocalized) AS translation WHERE LOWER(translation->>'value') LIKE LOWER(:searchTerm))",
        { searchTerm }
      );
    }

    if (sort) {
      if (order) {
        queryBuilder.orderBy(`faq.${sort}`, order);
      } else {
        queryBuilder.orderBy(`faq.${sort}`, SORT_ORDER.DESC);
      }
    } else {
      queryBuilder.orderBy('faq.createdAt', SORT_ORDER.DESC);
    }
    queryBuilder.skip(skip).take(limit);

    const [{ entities }, totalItems] = await Promise.all([queryBuilder.getRawAndEntities(), queryBuilder.getCount()]);
    const paginationDto = new PaginationDto({ totalItems, filterDto });

    return new PaginationResponseDto(entities, { paging: paginationDto });
  }

  async findOne(id: string) {
    const queryBuilder = this.createQueryBuilderWithJoins('faq');

    queryBuilder.where('faq.id = :id', { id });

    const faq = await queryBuilder.getOne();

    if (!faq) {
      throw new NotFoundException('Faq not found');
    }

    return faq;
  }

  async update(id: string, updateDto: UpdateFaqDto) {
    const faq = await this.faqRepository.findOneBy({ id });

    if (!faq) {
      throw new NotFoundException('Faq not found');
    }

    for (const field of FAQ_FIELDS_TO_CREATE_OR_UPDATE as string[]) {
      if (updateDto[field] !== undefined) {
        faq[field] = updateDto[field];
      }
    }

    const updatedFaq = await this.faqRepository.save(faq);

    return updatedFaq;
  }

  async remove(id: string) {
    const faq = await this.faqRepository.findOneBy({ id });

    if (!faq) {
      throw new NotFoundException('Faq not found');
    }

    faq.status = FAQ_STATUS.DELETED;

    const deletedFaq = await this.faqRepository.save(faq);

    return deletedFaq;
  }

  async bulkDelete(bulkDeleteDto: BulkDeleteDto) {
    const faqs = await this.faqRepository
      .createQueryBuilder('post')
      .where('post.id IN (:...ids)', { ids: bulkDeleteDto.ids })
      .orderBy('post.createdAt', SORT_ORDER.ASC)
      .getMany();

    faqs.forEach(post => (post.status = FAQ_STATUS.DELETED));

    const deletedFaqs = await this.faqRepository.save(faqs);

    return deletedFaqs;
  }

  private createQueryBuilderWithJoins(alias: string) {
    return this.faqRepository.createQueryBuilder(alias).select(FAQ_GET_FIELDS);
  }
}
