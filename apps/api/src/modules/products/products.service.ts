import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

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
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductFile)
    private readonly productFileRepository: Repository<ProductFile>,
    private readonly categoriesService: CategoriesService,
    private readonly auditLogsService: AuditLogsService
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

    const createdProduct = await this.productRepository.save(newProduct);

    await Promise.all([
      this.sortImages(createDto.images, createdProduct.id),
      this.auditLogsService.auditLogCreate(creator, createdProduct, AUDIT_LOG_TABLE_NAME.PRODUCTS),
    ]);

    return createdProduct;
  }

  async find(filterDto: FilterProductDto) {
    const { q, order, status, sort, skip, limit, type, categoryId } = filterDto;

    const queryBuilder = this.createQueryBuilderWithJoins('product');

    queryBuilder.andWhere('product.type = :type', { type });

    if (status) {
      queryBuilder.andWhere('product.status IN (:...status)', { status });
    }
    if (categoryId) {
      queryBuilder.andWhere('category.id = :categoryId', { categoryId });
    }
    if (q) {
      const searchTerm = `%${q}%`;

      queryBuilder.andWhere(
        "EXISTS (SELECT 1 FROM jsonb_array_elements(product.nameLocalized) AS translation WHERE LOWER(translation->>'value') LIKE LOWER(:searchTerm))",
        { searchTerm }
      );
    }
    if (sort) {
      if (order) {
        queryBuilder.orderBy(`product.${sort}`, order);
      } else {
        queryBuilder.orderBy(`product.${sort}`, SORT_ORDER.DESC);
      }
    } else {
      queryBuilder.orderBy('product.createdAt', SORT_ORDER.DESC);
    }
    queryBuilder.skip(skip).take(limit);

    const [{ entities }, totalItems] = await Promise.all([queryBuilder.getRawAndEntities(), queryBuilder.getCount()]);
    const paginationDto = new PaginationDto({ totalItems, filterDto });

    return new PaginationResponseDto(entities, { paging: paginationDto });
  }

  async findOne(id: string) {
    const product = await this.createQueryBuilderWithJoins('product')
      .where('product.id = :id', { id })
      .orderBy('productFile.position', SORT_ORDER.ASC)
      .getOne();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async findBySlug(slug: string, status: PRODUCT_STATUS = PRODUCT_STATUS.PUBLISHED) {
    const product = await this.createQueryBuilderWithJoins('product')
      .where('product.slug = :slug', { slug })
      .andWhere('product.status = :status', { status })
      .orderBy('productFile.position', SORT_ORDER.ASC)
      .getOne();

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    return product;
  }

  async update(id: string, creator: User, updateDto: UpdateProductDto) {
    const product = await this.productRepository.findOneBy({ id });

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

    const updatedProduct = await this.productRepository.save(product);

    await Promise.all([
      this.sortImages(updateDto.images, originalProduct.id),
      this.auditLogsService.auditLogUpdate(creator, originalProduct, updatedProduct, AUDIT_LOG_TABLE_NAME.PRODUCTS),
    ]);

    return updatedProduct;
  }

  async remove(id: string, creator: User) {
    const product = await this.productRepository.findOneBy({ id });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const originalProduct = structuredClone(product);

    product.status = PRODUCT_STATUS.DELETED;

    const deletedProduct = await this.productRepository.save(product);

    await this.auditLogsService.auditLogDelete(creator, [originalProduct], [deletedProduct], AUDIT_LOG_TABLE_NAME.PRODUCTS);

    return deletedProduct;
  }

  async bulkDelete(creator: User, bulkDeleteDto: BulkDeleteDto) {
    const products = await this.productRepository
      .createQueryBuilder('product')
      .where('product.id IN (:...ids)', { ids: bulkDeleteDto.ids })
      .orderBy('product.createdAt', SORT_ORDER.ASC)
      .getMany();

    const originalProducts = products.map(product => structuredClone(product));

    products.forEach(product => (product.status = PRODUCT_STATUS.DELETED));

    const deletedProducts = await this.productRepository.save(products);

    await this.auditLogsService.auditLogDelete(creator, originalProducts, deletedProducts, AUDIT_LOG_TABLE_NAME.PRODUCTS);

    return deletedProducts;
  }

  async sortImages(images: File[] | undefined, productId: string) {
    if (!images) return;

    const existingFiles = await this.productFileRepository.find({ where: { productId } });
    const newFileIds = images.map(image => image.id);
    const filesToRemove = existingFiles.filter(file => !newFileIds.includes(file.fileId));

    if (filesToRemove.length > 0) {
      await this.productFileRepository.remove(filesToRemove);
    }

    for (let i = 0; i < images.length; i++) {
      const existingFile = await this.productFileRepository.findOne({ where: { fileId: images[i].id, productId } });

      if (existingFile) {
        existingFile.position = i + 1;
        await this.productFileRepository.save(existingFile);
      } else {
        const newFile = this.productFileRepository.create({ fileId: images[i].id, productId, position: i + 1 });

        await this.productFileRepository.save(newFile);
      }
    }
  }

  private createQueryBuilderWithJoins(alias: string) {
    return this.productRepository
      .createQueryBuilder(alias)
      .select(PRODUCT_GET_FIELDS)
      .leftJoin(`${alias}.creator`, 'user')
      .leftJoin(`${alias}.category`, 'category')
      .leftJoin(`${alias}.productFiles`, 'productFile')
      .leftJoin('productFile.image', 'image');
  }
}
