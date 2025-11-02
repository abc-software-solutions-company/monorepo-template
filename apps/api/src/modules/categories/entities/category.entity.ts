import { Exclude, Expose } from 'class-transformer';
import { Collection, Entity, Enum, ManyToOne, OneToMany, Property } from '@mikro-orm/core';

import { TranslationEntity } from '@/common/entities/translation.entity';

import { File } from '@/modules/files/entities/file.entity';
import { Post } from '@/modules/posts/entities/post.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { User } from '@/modules/users/entities/user.entity';

import { CategoryFile } from './category-file.entity';

import { CATEGORY_STATUS, CATEGORY_TYPE } from '../constants/categories.constant';

@Entity({ tableName: 'categories' })
export class Category extends TranslationEntity {
  @Property({ type: 'varchar', unique: true, length: 255 })
  slug: string;

  @Enum(() => CATEGORY_TYPE)
  type: CATEGORY_TYPE = CATEGORY_TYPE.NEWS;

  @Property({ type: 'varchar', length: 2048, nullable: true })
  externalUrl: string;

  @Enum(() => CATEGORY_STATUS)
  status: CATEGORY_STATUS = CATEGORY_STATUS.PUBLISHED;

  @Property({ type: 'timestamp', nullable: true })
  publishDate: Date;

  @Expose()
  images: File[];

  @ManyToOne(() => User, { nullable: true })
  creator: User;

  @ManyToOne(() => Category, { nullable: true })
  parent: Category;

  @OneToMany(() => Category, category => category.parent)
  children = new Collection<Category>(this);

  @OneToMany(() => File, file => file.category)
  files = new Collection<File>(this);

  @OneToMany(() => Post, post => post.category)
  posts = new Collection<Post>(this);

  @OneToMany(() => Product, product => product.category)
  products = new Collection<Product>(this);

  // Ref: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties
  @OneToMany(() => CategoryFile, categoryFile => categoryFile.category)
  @Exclude()
  categoryFiles = new Collection<CategoryFile>(this);

  transformFilesToImages() {
    if (this.categoryFiles.isInitialized()) {
      this.images = this.categoryFiles.getItems().map(item => {
        return {
          id: item.fileId,
          uniqueName: item.image.uniqueName,
          position: item.position,
        } as File & { position: number };
      });
    }
  }

  get hasChildren(): boolean {
    return this.children.isInitialized() && this.children.length > 0;
  }
}
