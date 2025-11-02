import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';
import { wrap } from '@mikro-orm/core';

import { BulkDeleteDto } from '@/common/dtos/bulk-delete.dto';
import { PaginationDto } from '@/common/dtos/pagination.dto';
import { PaginationResponseDto } from '@/common/dtos/pagination-response.dto';

import { SORT_ORDER } from '@/common/constants/order.constant';

import { PRODUCT_FIELDS_TO_CREATE_OR_UPDATE, PRODUCT_GET_FIELDS, PRODUCT_STATUS } from './constants/products.constant';
import { CreateProductDto } from './dto/create-product.dto';
import { FilterProductDto } from './dto/filter-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { ProductFile } from './entities/product-file.entity';

import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { AUDIT_LOG_TABLE_NAME } from '../audit-logs/constants/audit-logs.constant';
import { CategoriesService } from '../categories/categories.service';
import { File } from '../files/entities/file.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: EntityRepository<Product>,
    @InjectRepository(ProductFile)
    private readonly productFileRepository: EntityRepository<ProductFile>,
    private readonly categoriesService: CategoriesService,
    private readonly auditLogsService: AuditLogsService,
    private readonly em: EntityManager
  ) {}

  async create(creator: User, createDto: CreateProductDto) {
    const newProduct = new Product();

    for (const field of PRODUCT_FIELDS_TO_CREATE_OR_UPDATE as string[]) {
      if (createDto[field] !== undefined) {
        newProduct[field] = createDto[field];
      }
    }

    if (createDto.categoryId) {
      const category = await this.categoriesService.findOne(createDto.categoryId);

      newProduct.category = category;
    }

    if (createDto.status) newProduct.status = createDto.status;
    if (createDto.seoMeta) newProduct.seoMeta = createDto.seoMeta;

    newProduct.creator = creator;

    await this.em.persistAndFlush(newProduct);

    await Promise.all([
      this.sortImages(createDto.images, newProduct.id),
      this.auditLogsService.auditLogCreate(creator, newProduct, AUDIT_LOG_TABLE_NAME.PRODUCTS),
    ]);

    return newProduct;
  }

  async find(filterDto: FilterProductDto) {
    const { q, order, status, sort, skip, limit, type, categoryId } = filterDto;

    const queryBuilder = this.createQueryBuilderWithJoins('product');

    queryBuilder.andWhere({ type });

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
    const product = await this.createQueryBuilderWithJoins('product')
      .where({ id })
      .orderBy({ 'productFile.position': SORT_ORDER.ASC })
      .getSingleResult();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findBySlug(slug: string, status: PRODUCT_STATUS = PRODUCT_STATUS.PUBLISHED) {
    const product = await this.createQueryBuilderWithJoins('product')
      .where({ slug, status })
      .orderBy({ 'productFile.position': SORT_ORDER.ASC })
      .getSingleResult();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, creator: User, updateDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ id });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const originalProduct = structuredClone(product);

    for (const field of PRODUCT_FIELDS_TO_CREATE_OR_UPDATE as string[]) {
      if (updateDto[field] !== undefined) {
        product[field] = updateDto[field];
      }
    }

    if (updateDto.categoryId) {
      const category = await this.categoriesService.findOne(updateDto.categoryId);

      product.category = category;
    } else {
      product.category = null;
    }

    if (updateDto.status) product.status = updateDto.status;
    if (updateDto.seoMeta) product.seoMeta = updateDto.seoMeta;

    await this.em.flush();

    await Promise.all([
      this.sortImages(updateDto.images, originalProduct.id),
      this.auditLogsService.auditLogUpdate(creator, originalProduct, product, AUDIT_LOG_TABLE_NAME.PRODUCTS),
    ]);

    return product;
  }

  async remove(id: string, creator: User) {
    const product = await this.productRepository.findOne({ id });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const originalProduct = structuredClone(product);

    product.status = PRODUCT_STATUS.DELETED;

    await this.em.flush();

    await this.auditLogsService.auditLogDelete(creator, [originalProduct], [product], AUDIT_LOG_TABLE_NAME.PRODUCTS);

    return product;
  }

  async bulkDelete(creator: User, bulkDeleteDto: BulkDeleteDto) {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .where({ id: { $in: bulkDeleteDto.ids } })
      .orderBy({ createdAt: SORT_ORDER.ASC })
      .getResult();

    const originalProducts = products.map(product => structuredClone(product));

    products.forEach(product => (product.status = PRODUCT_STATUS.DELETED));

    await this.em.flush();

    await this.auditLogsService.auditLogDelete(creator, originalProducts, products, AUDIT_LOG_TABLE_NAME.PRODUCTS);

    return products;
  }

  async sortImages(images: File[] | undefined, productId: string) {
    if (!images) return;

    const existingFiles = await this.productFileRepository.find({ productId });
    const newFileIds = images.map(image => image.id);
    const filesToRemove = existingFiles.filter(file => !newFileIds.includes(file.fileId));

    if (filesToRemove.length > 0) {
      await this.em.removeAndFlush(filesToRemove);
    }

    for (let i = 0; i < images.length; i++) {
      const existingFile = await this.productFileRepository.findOne({ fileId: images[i].id, productId });

      if (existingFile) {
        existingFile.position = i + 1;
        await this.em.flush();
      } else {
        const newFile = this.productFileRepository.create({ fileId: images[i].id, productId, position: i + 1 });

        await this.em.persistAndFlush(newFile);
      }
    }
  }

  private createQueryBuilderWithJoins(alias: string) {
    return this.productRepository
      .createQueryBuilder(alias)
      .select(PRODUCT_GET_FIELDS)
      .leftJoinAndSelect(`${alias}.creator`, 'user')
      .leftJoinAndSelect(`${alias}.category`, 'category')
      .leftJoinAndSelect(`${alias}.productFiles`, 'productFile')
      .leftJoinAndSelect('productFile.image', 'image');
  }
}
