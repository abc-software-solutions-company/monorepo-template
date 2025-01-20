import { Exclude, Expose } from 'class-transformer';
import { AfterLoad, Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { TranslationEntity } from '@/common/entities/translation.entity';

import { Category } from '@/modules/categories/entities/category.entity';
import { File } from '@/modules/files/entities/file.entity';
import { User } from '@/modules/users/entities/user.entity';

import { ProductFile } from './product-file.entity';

import { PRODUCT_STATUS } from '../constants/products.constant';

@Entity({ name: 'products' })
export class Product extends TranslationEntity {
  @Column({ type: 'varchar', unique: true, length: 255 })
  slug: string;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  type: string;

  @Column({ type: 'enum', enum: PRODUCT_STATUS, default: PRODUCT_STATUS.DRAFT })
  status: PRODUCT_STATUS;

  @Expose()
  images: File[];

  @ManyToOne(() => User, user => user.products)
  creator: User;

  @ManyToOne(() => Category, category => category.posts)
  category: Category;

  // Ref: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties
  @OneToMany(() => ProductFile, productFile => productFile.product)
  @Exclude()
  productFiles: ProductFile[];

  @AfterLoad()
  transformFilesToImages() {
    if (this.productFiles) {
      this.images = this.productFiles.map(item => {
        return {
          id: item.fileId,
          uniqueName: item.image.uniqueName,
          position: item.position,
        } as File & { position: number };
      });
    }
  }
}
