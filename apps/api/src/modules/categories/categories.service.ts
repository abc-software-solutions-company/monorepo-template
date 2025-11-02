import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { wrap } from '@mikro-orm/core';

import { BulkDeleteDto } from '@/common/dtos/bulk-delete.dto';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PaginationResponseDto } from '@/common/dtos/pagination-response.dto';

import { SORT_ORDER } from '@/common/constants/order.constant';

import { CATEGORY_FIELDS_TO_CREATE_OR_UPDATE, CATEGORY_GET_FIELDS, CATEGORY_STATUS, CATEGORY_TYPE } from './constants/categories.constant';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { CategoryFile } from './entities/category-file.entity';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AUDIT_LOG_TABLE_NAME } from '../audit-logs/constants/audit-logs.constant';
import { File } from '../files/entities/file.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: EntityRepository<Category>,
    @InjectRepository(CategoryFile)
    private readonly categoryFileRepository: EntityRepository<CategoryFile>,
    private readonly auditLogsService: AuditLogsService,
    private readonly em: EntityManager
  ) {}

  async create(creator: User, createDto: CreateCategoryDto) {
    let parent: Category | null = null;

    if (createDto.parentId) {
      parent = await this.categoryRepository.findOne({
        id: createDto.parentId,
        type: createDto.type,
      });
    }

    if (createDto.parentId && !parent) {
      throw new NotFoundException('Parent category does not exist.');
    }

    const newCategory = this.categoryRepository.create({ ...createDto, parent: parent });

    if (createDto.status) newCategory.status = createDto.status;
    if (createDto.seoMeta) newCategory.seoMeta = createDto.seoMeta;

    newCategory.creator = creator;

    await this.em.persistAndFlush(newCategory);

    await Promise.all([
      this.sortImages(createDto.images, newCategory.id),
      this.auditLogsService.auditLogCreate(creator, newCategory, AUDIT_LOG_TABLE_NAME.CATEGORIES),
    ]);

    return newCategory;
  }

  async find(filterDto: FilterCategoryDto) {
    const { q, order, status, sort, excludeId, skip, limit, type } = filterDto;

    const queryBuilder = this.createQueryBuilderWithJoins('category');

    if (q) {
      const searchTerm = `%${q}%`;

      queryBuilder.where({
        $raw: `EXISTS (SELECT 1 FROM jsonb_array_elements(name_localized) AS translation WHERE LOWER(translation->>'value') LIKE LOWER('${searchTerm}'))`,
      });
    } else {
      queryBuilder.where({ parent: null });
    }

    if (status) queryBuilder.andWhere({ status: { $in: status } });
    if (excludeId) {
      queryBuilder.andWhere({ id: { $ne: excludeId } });
    }
    if (type) {
      queryBuilder.andWhere({ type });
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

    const categoriesWithChildren = await Promise.all(
      entities.map(async category => {
        if (category.parent) {
          return { ...category, children: [] };
        }
        const children = await this.getChilds(category.id);

        return { ...category, children };
      })
    );

    const paginationDto = new PaginationDto({ totalItems, filterDto });

    return new PaginationResponseDto(categoriesWithChildren, { paging: paginationDto });
  }

  async findOne(id: string) {
    const category = await this.createQueryBuilderWithJoins('category')
      .where({ id })
      .orderBy({ 'categoryFile.position': SORT_ORDER.ASC })
      .getSingleResult();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, creator: User, updateDto: UpdateCategoryDto) {
    let parent: Category | null = null;

    if (updateDto.parentId) {
      parent = await this.categoryRepository.findOne({ id: updateDto.parentId });
    }

    if (updateDto.parentId && !parent) {
      throw new NotFoundException('Parent category does not exist.');
    }

    const category = await this.categoryRepository.findOne({ id: id });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const originalCategory = structuredClone(category);

    if (updateDto.type && updateDto.type !== category.type) {
      throw new BadRequestException('Category Type change is not allowed');
    }

    for (const field of CATEGORY_FIELDS_TO_CREATE_OR_UPDATE as string[]) {
      if (updateDto[field] !== undefined) {
        category[field] = updateDto[field];
      }
    }

    if (updateDto.status) category.status = updateDto.status;
    if (updateDto.seoMeta) category.seoMeta = updateDto.seoMeta;

    category.parent = parent;

    await this.em.flush();

    await Promise.all([
      this.sortImages(updateDto.images, originalCategory.id),
      this.auditLogsService.auditLogUpdate(creator, originalCategory, category, AUDIT_LOG_TABLE_NAME.CATEGORIES),
    ]);

    return category;
  }

  async remove(id: string, creator: User) {
    const category = await this.categoryRepository.findOne({ id }, { populate: ['children'] });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.hasChildren) {
      throw new BadRequestException('Category has children, please remove them first.');
    }

    const originalCategory = structuredClone(category);

    category.status = CATEGORY_STATUS.DELETED;

    await this.em.flush();

    await this.auditLogsService.auditLogDelete(creator, [originalCategory], [category], AUDIT_LOG_TABLE_NAME.CATEGORIES);

    return category;
  }

  async bulkDelete(creator: User, bulkDeleteDto: BulkDeleteDto) {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .where({ id: { $in: bulkDeleteDto.ids } })
      .orderBy({ createdAt: SORT_ORDER.ASC })
      .getResult();

    const originalCategories = categories.map(category => structuredClone(category));

    categories.forEach(category => (category.status = CATEGORY_STATUS.DELETED));

    await this.em.flush();

    await this.auditLogsService.auditLogDelete(creator, originalCategories, categories, AUDIT_LOG_TABLE_NAME.CATEGORIES);

    return categories;
  }

  async findByParentId(id: string) {
    const categories = await this.createQueryBuilderWithJoins('category')
      .where({ 'parent.id': id })
      .orderBy({ createdAt: SORT_ORDER.DESC })
      .getResult();

    return categories;
  }

  async findByType(type: CATEGORY_TYPE) {
    const categories = await this.createQueryBuilderWithJoins('category')
      .where({ type })
      .orderBy({ createdAt: SORT_ORDER.DESC })
      .getResult();

    return categories;
  }

  async findBySlug(slug: string) {
    const category = await this.createQueryBuilderWithJoins('category')
      .where({ slug })
      .getSingleResult();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async sortImages(images: File[] | undefined, categoryId: string) {
    if (!images) return;

    for (let i = 0; i < images.length; i++) {
      const existingFile = await this.categoryFileRepository.findOne({ fileId: images[i].id, categoryId });

      if (existingFile) {
        existingFile.position = i + 1;
        await this.em.flush();
      } else {
        const newFile = this.categoryFileRepository.create({ fileId: images[i].id, categoryId, position: i + 1 });

        await this.em.persistAndFlush(newFile);
      }
    }
  }

  private async getChilds(parentId: string) {
    const queryBuilder = this.createQueryBuilderWithJoins('category');

    queryBuilder.where({ 'parent.id': parentId });
    queryBuilder.orderBy({ createdAt: SORT_ORDER.DESC });

    const children = await queryBuilder.getResult();

    const childrenWithSubChildren = await Promise.all(
      children.map(async child => {
        const subChildren = await this.getChilds(child.id);

        return { ...child, children: subChildren };
      })
    );

    return childrenWithSubChildren;
  }

  private createQueryBuilderWithJoins(alias: string) {
    return this.categoryRepository
      .createQueryBuilder(alias)
      .select(CATEGORY_GET_FIELDS)
      .leftJoinAndSelect(`${alias}.creator`, 'user')
      .leftJoinAndSelect(`${alias}.parent`, 'parent')
      .leftJoinAndSelect(`${alias}.categoryFiles`, 'categoryFile')
      .leftJoinAndSelect('categoryFile.image', 'image');
  }
}
