import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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

    const newCategory = this.categoryRepository.create({ ...createDto, parent: parent });

    if (createDto.status) newCategory.status = createDto.status;
    if (createDto.seoMeta) newCategory.seoMeta = createDto.seoMeta;

    newCategory.creator = creator;

    const categoryResponse = await this.categoryRepository.save({ ...newCategory });

    await Promise.all([
      this.sortImages(createDto.images, categoryResponse.id),
      this.auditLogsService.auditLogCreate(creator, categoryResponse, AUDIT_LOG_TABLE_NAME.CATEGORIES),
    ]);

    return categoryResponse;
  }

  async find(filterDto: FilterCategoryDto) {
    const { q, order, status, sort, excludeId, skip, limit, type } = filterDto;

    const queryBuilder = this.createQueryBuilderWithJoins('category');

    if (q) {
      const searchTerm = `%${q}%`;

      queryBuilder.where(
        "EXISTS (SELECT 1 FROM jsonb_array_elements(category.nameLocalized) AS translation WHERE LOWER(translation->>'value') LIKE LOWER(:searchTerm))",
        { searchTerm }
      );
    } else {
      queryBuilder.where('parent.id IS NULL');
    }

    if (status) queryBuilder.andWhere('category.status in (:...status)', { status });
    if (excludeId) {
      queryBuilder.andWhere('category.id != :id', { id: excludeId });
    }
    if (type) {
      queryBuilder.andWhere('category.type = :type', { type });
    }
    if (sort) {
      if (order) {
        queryBuilder.orderBy(`category.${sort}`, order);
      } else {
        queryBuilder.orderBy(`category.${sort}`, SORT_ORDER.DESC);
      }
    } else {
      queryBuilder.orderBy('category.createdAt', SORT_ORDER.DESC);
    }
    queryBuilder.skip(skip).take(limit);

    const [{ entities }, totalItems] = await Promise.all([queryBuilder.getRawAndEntities(), queryBuilder.getCount()]);

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

    for (const field of CATEGORY_FIELDS_TO_CREATE_OR_UPDATE as string[]) {
      if (updateDto[field] !== undefined) {
        category[field] = updateDto[field];
      }
    }

    if (updateDto.status) category.status = updateDto.status;
    if (updateDto.seoMeta) category.seoMeta = updateDto.seoMeta;

    category.parent = parent;

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

  async findByParentId(id: string) {
    const categories = await this.createQueryBuilderWithJoins('category')
      .where('category.parent.id = :id', { id })
      .orderBy('category.createdAt', SORT_ORDER.DESC)
      .getMany();

    return categories;
  }

  async findByType(type: CATEGORY_TYPE) {
    const categories = await this.createQueryBuilderWithJoins('category')
      .where('category.type = :type', { type })
      .orderBy('category.createdAt', SORT_ORDER.DESC)
      .getMany();

    return categories;
  }

  async findBySlug(slug: string) {
    const category = await this.createQueryBuilderWithJoins('category')
      .where('category.slug = :slug', { slug })
      .addSelect(['user.id', 'user.name', 'user.avatar'])
      .getOne();

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    return category;
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

  private async getChilds(parentId: string) {
    const queryBuilder = this.createQueryBuilderWithJoins('category');

    queryBuilder.where('parent.id = :parentId', { parentId });
    queryBuilder.orderBy('category.createdAt', SORT_ORDER.DESC);

    const children = await queryBuilder.getMany();

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
      .leftJoin(`${alias}.creator`, 'user')
      .leftJoin(`${alias}.parent`, 'parent')
      .leftJoin(`${alias}.categoryFiles`, 'categoryFile')
      .leftJoin('categoryFile.image', 'image');
  }
}
