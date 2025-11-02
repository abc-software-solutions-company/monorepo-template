import { Exclude, Expose } from 'class-transformer';
import { Collection, Entity, Enum, ManyToOne, OneToMany, Property } from '@mikro-orm/core';

import { TranslationEntity } from '@/common/entities/translation.entity';

import { Category } from '@/modules/categories/entities/category.entity';
import { File } from '@/modules/files/entities/file.entity';
import { User } from '@/modules/users/entities/user.entity';

import { ProductFile } from './product-file.entity';

import { PRODUCT_STATUS } from '../constants/products.constant';

@Entity({ tableName: 'products' })
export class Product extends TranslationEntity {
  @Property({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Property({ type: 'varchar', length: 50, nullable: true })
  type: string;

  @Property({ type: 'varchar', length: 2048, nullable: true })
  externalUrl: string;

  @Enum(() => PRODUCT_STATUS)
  status: PRODUCT_STATUS = PRODUCT_STATUS.DRAFT;

  @Property({ type: 'timestamp', nullable: true })
  publishDate: Date;

  @Expose()
  images: File[];

  @ManyToOne(() => User, { nullable: true })
  creator: User;

  @ManyToOne(() => Category, { nullable: true })
  category: Category;

  // Ref: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties
  @OneToMany(() => ProductFile, productFile => productFile.product)
  @Exclude()
  productFiles = new Collection<ProductFile>(this);

  transformFilesToImages() {
    if (this.productFiles.isInitialized()) {
      this.images = this.productFiles.getItems().map(item => {
        return {
          id: item.fileId,
          uniqueName: item.image.uniqueName,
          position: item.position,
        } as File & { position: number };
      });
    }
  }
}
