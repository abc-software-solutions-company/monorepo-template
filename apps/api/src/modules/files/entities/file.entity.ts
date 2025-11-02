import { Collection, Entity, Enum, ManyToOne, OneToMany, Property } from '@mikro-orm/core';

import { AbstractEntity } from '@/common/entities/abstract.entity';

import { Category } from '@/modules/categories/entities/category.entity';
import { CategoryFile } from '@/modules/categories/entities/category-file.entity';
import { PostFile } from '@/modules/posts/entities/post-file.entity';
import { ProductFile } from '@/modules/products/entities/product-file.entity';

import { FILE_STATUS } from '../constants/files.constant';

@Entity({ tableName: 'files' })
export class File extends AbstractEntity {
  @Property({ type: 'varchar', length: 255 })
  name: string;

  @Property({ type: 'varchar', length: 255 })
  uniqueName: string;

  @Property({ type: 'varchar', length: 255, nullable: true })
  caption: string;

  @Property({ type: 'varchar', length: 5 })
  ext: string;

  @Property({ type: 'bigint' })
  size: number;

  @Property({ type: 'varchar', length: 50 })
  mime: string;

  @Property({ type: 'boolean', default: true })
  isTemp: boolean = true;

  @Enum(() => FILE_STATUS)
  status: FILE_STATUS = FILE_STATUS.PUBLISHED;

  @ManyToOne(() => Category, { nullable: true })
  category: Category;

  // Ref: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties
  @OneToMany(() => PostFile, postFile => postFile.image)
  postFiles = new Collection<PostFile>(this);

  // Ref: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties
  @OneToMany(() => ProductFile, productFile => productFile.image)
  productFiles = new Collection<ProductFile>(this);

  // Ref: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties
  @OneToMany(() => CategoryFile, categoryFile => categoryFile.image)
  categoryFiles = new Collection<CategoryFile>(this);
}
