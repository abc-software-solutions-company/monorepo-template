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
  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  type: string;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  externalUrl: string;

  @Column({ type: 'varchar', length: 50, default: PRODUCT_STATUS.DRAFT })
  status: PRODUCT_STATUS;

  @Column({ type: 'timestamp without time zone', nullable: true })
  publishDate: Date;

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
