import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BulkDeleteDto } from '@/common/dtos/bulk-delete.dto';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PaginationResponseDto } from '@/common/dtos/pagination-response.dto';

import { SORT_ORDER } from '@/common/constants/order.constant';

import { CATEGORY_FIELDS_TO_CREATE_OR_UPDATE, CATEGORY_GET_FIELDS, CATEGORY_STATUS } from './constants/categories.constant';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FilterCategoryDto } from './dto/filter-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { CategoryFile } from './entities/category-file.entity';
import { buildTree } from './utils/categories.util';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AUDIT_LOG_TABLE_NAME } from '../audit-logs/constants/audit-logs.constant';
import { File } from '../files/entities/file.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(CategoryFile)
    private readonly categoryFileRepository: Repository<CategoryFile>,
    private readonly auditLogsService: AuditLogsService
  ) {}

  async create(creator: User, createDto: CreateCategoryDto) {
    let parent: Category | null = null;

    if (createDto.parentId) {
      parent = await this.categoryRepository.findOne({
        where: { id: createDto.parentId, type: createDto.type },
      });
    }

    if (createDto.parentId && !parent) {
      throw new NotFoundException('Parent category does not exist.');
    }

    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createDto.name, type: createDto.type, parent: { id: createDto.parentId } },
    });

    if (existingCategory) {
      throw new ConflictException('Category with the same name already exists.');
    }
    const newCategory = this.categoryRepository.create({ ...createDto, parent: parent });

    if (createDto.status) newCategory.status = createDto.status;
    if (createDto.seoMeta) newCategory.seoMeta = createDto.seoMeta;

    const categoryResponse = await this.categoryRepository.save({ ...newCategory });

    await Promise.all([
      this.sortImages(createDto.images, categoryResponse.id),
      this.auditLogsService.auditLogCreate(creator, categoryResponse, AUDIT_LOG_TABLE_NAME.CATEGORIES),
    ]);

    return categoryResponse;
  }

  async findAll(filterDto: FilterCategoryDto) {
    const { q, type, excludeId, status } = filterDto;

    const queryBuilder = this.createQueryBuilderWithJoins('category');

    if (status) queryBuilder.where('category.status in (:...status)', { status });
    if (q) {
      queryBuilder
        .andWhere('LOWER(category.name) LIKE LOWER(:name)', { name: `%${q}%` })
        .orWhere('LOWER(category.description) LIKE LOWER(:description)', { description: `%${q}%` })
        .orWhere('LOWER(category.body) LIKE LOWER(:body)', { body: `%${q}%` });
    }
    if (type) {
      queryBuilder.andWhere('category.type = :type', { type });
    }
    if (excludeId) {
      queryBuilder.andWhere('category.id != :id', { id: excludeId });
    }

    const categories = await queryBuilder.getMany();

    return categories;
  }

  async find(filterDto: FilterCategoryDto) {
    const { q, order, status, sort, type, excludeId, skip, limit } = filterDto;

    const queryBuilder = this.createQueryBuilderWithJoins('category');

    queryBuilder.where('parent.id IS NULL');
    if (status) queryBuilder.andWhere('category.status in (:...status)', { status });
    if (q) {
      queryBuilder.andWhere('LOWER(category.name) LIKE LOWER(:name)', { name: `%${q}%` });
    }
    if (excludeId) {
      queryBuilder.andWhere('category.id != :id', { id: excludeId });
    }
    if (type) {
      queryBuilder.andWhere('category.type = :type', { type });
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

  async getTrees(filterDto: FilterCategoryDto) {
    const categories = await this.findAll(filterDto);

    return buildTree(categories, filterDto.parentId || null, '/');
  }

  async findOne(id: string) {
    const category = await this.createQueryBuilderWithJoins('category')
      .where('category.id = :id', { id })
      .orderBy('categoryFile.position', SORT_ORDER.ASC)
      .getOne();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
  }

  async update(id: string, creator: User, updateDto: UpdateCategoryDto) {
    let parent: Category | null = null;

    if (updateDto.parentId) {
      parent = await this.categoryRepository.findOneBy({ id: updateDto.parentId });
    }

    if (updateDto.parentId && !parent) {
      throw new NotFoundException('Parent category does not exist.');
    }

    const category = await this.categoryRepository.findOneBy({ id: id });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const originalCategory = structuredClone(category);

    if (updateDto.type && updateDto.type !== category.type) {
      throw new BadRequestException('Category Type change is not allowed');
    }

    category.parent = parent;

    for (const field of CATEGORY_FIELDS_TO_CREATE_OR_UPDATE) {
      if (updateDto[field] !== undefined) {
        category[field] = updateDto[field];
      }
    }

    // Update some localized property
    if (updateDto.nameLocalized !== undefined) category.nameLocalized = updateDto.nameLocalized;
    if (updateDto.descriptionLocalized !== undefined) category.descriptionLocalized = updateDto.descriptionLocalized;
    if (updateDto.bodyLocalized !== undefined) category.bodyLocalized = updateDto.bodyLocalized;
    if (updateDto.coverLocalized !== undefined) category.coverLocalized = updateDto.coverLocalized;

    if (updateDto.status) category.status = updateDto.status;
    if (updateDto.seoMeta) category.seoMeta = updateDto.seoMeta;

    const updatedCategory = await this.categoryRepository.save(category);

    await Promise.all([
      this.sortImages(updateDto.images, originalCategory.id),
      this.auditLogsService.auditLogUpdate(creator, originalCategory, updatedCategory, AUDIT_LOG_TABLE_NAME.CATEGORIES),
    ]);

    return updatedCategory;
  }

  async remove(id: string, creator: User) {
    const category = await this.categoryRepository.findOne({ where: { id }, relations: ['children'] });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category.hasChildren) {
      throw new BadRequestException('Category has children, please remove them first.');
    }

    const originalCategory = structuredClone(category);

    category.status = CATEGORY_STATUS.DELETED;

    const deletedCategory = await this.categoryRepository.save(category);

    await this.auditLogsService.auditLogDelete(creator, [originalCategory], [deletedCategory], AUDIT_LOG_TABLE_NAME.CATEGORIES);

    return deletedCategory;
  }

  async bulkDelete(creator: User, bulkDeleteDto: BulkDeleteDto) {
    const categories = await this.categoryRepository
      .createQueryBuilder('category')
      .where('category.id IN (:...ids)', { ids: bulkDeleteDto.ids })
      .orderBy('category.createdAt', SORT_ORDER.ASC)
      .getMany();

    const originalCategories = categories.map(category => structuredClone(category));

    categories.forEach(category => (category.status = CATEGORY_STATUS.DELETED));

    const newCategories = await this.categoryRepository.save(categories);

    await this.auditLogsService.auditLogDelete(creator, originalCategories, newCategories, AUDIT_LOG_TABLE_NAME.CATEGORIES);

    return newCategories;
  }

  async sortImages(images: File[] | undefined, categoryId: string) {
    if (!images) return;

    for (let i = 0; i < images.length; i++) {
      const existingFile = await this.categoryFileRepository.findOne({ where: { fileId: images[i].id, categoryId } });

      if (existingFile) {
        existingFile.position = i + 1;
        await this.categoryFileRepository.save(existingFile);
      } else {
        const newFile = this.categoryFileRepository.create({ fileId: images[i].id, categoryId, position: i + 1 });

        await this.categoryFileRepository.save(newFile);
      }
    }
  }

  private createQueryBuilderWithJoins(alias: string) {
    return this.categoryRepository
      .createQueryBuilder(alias)
      .select(CATEGORY_GET_FIELDS)
      .leftJoin(`${alias}.creator`, 'user')
      .leftJoin(`${alias}.parent`, 'parent')
      .leftJoin(`${alias}.categoryFiles`, 'categoryFile')
      .leftJoin('categoryFile.image', 'image');
  }
}
