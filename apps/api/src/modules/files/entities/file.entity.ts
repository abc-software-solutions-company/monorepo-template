import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '@/common/entities/abstract.entity';

import { Category } from '@/modules/categories/entities/category.entity';
import { CategoryFile } from '@/modules/categories/entities/category-file.entity';
import { PostFile } from '@/modules/posts/entities/post-file.entity';
import { ProductFile } from '@/modules/products/entities/product-file.entity';

import { FILE_STATUS } from '../constants/files.constant';

@Entity({ name: 'files' })
export class File extends AbstractEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  uniqueName: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  caption: string;

  @Column({ type: 'varchar', length: 5 })
  ext: string;

  @Column({ type: 'bigint' })
  size: number;

  @Column({ type: 'varchar', length: 50 })
  mime: string;

  @Column({ type: 'boolean', default: true })
  isTemp: boolean;

  @Column({ type: 'varchar', length: 50, default: FILE_STATUS.PUBLISHED })
  status: FILE_STATUS;

  @ManyToOne(() => Category, category => category.files)
  category: Category;

  // Ref: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties
  @OneToMany(() => PostFile, postFile => postFile.image)
  postFiles: PostFile[];

  // Ref: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties
  @OneToMany(() => ProductFile, productFile => productFile.image)
  productFiles: ProductFile[];

  // Ref: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties
  @OneToMany(() => CategoryFile, categoryFile => categoryFile.image)
  categoryFiles: CategoryFile[];
}
