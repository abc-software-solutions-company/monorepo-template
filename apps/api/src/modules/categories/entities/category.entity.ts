import { Exclude, Expose } from 'class-transformer';
import { AfterLoad, Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { TranslationEntity } from '@/common/entities/translation.entity';

import { File } from '@/modules/files/entities/file.entity';
import { Post } from '@/modules/posts/entities/post.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { User } from '@/modules/users/entities/user.entity';

import { CategoryFile } from './category-file.entity';

import { CATEGORY_STATUS, CATEGORY_TYPE } from '../constants/categories.constant';

@Entity({ name: 'categories' })
export class Category extends TranslationEntity {
  @Column({ type: 'varchar', unique: true, length: 255 })
  slug: string;

  @Column({ type: 'varchar', length: 50, default: CATEGORY_TYPE.NEWS })
  type: CATEGORY_TYPE;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  externalUrl: string;

  @Column({ type: 'varchar', length: 50, default: CATEGORY_STATUS.PUBLISHED })
  status: CATEGORY_STATUS;

  @Column({ type: 'timestamp without time zone', nullable: true })
  publishDate: Date;

  @Expose()
  images: File[];

  @ManyToOne(() => User, user => user.categories)
  creator: User;

  @ManyToOne(() => Category, category => category.children, { nullable: true })
  parent: Category;

  @OneToMany(() => Category, category => category.parent)
  children: Category[];

  @OneToMany(() => File, file => file.category)
  files: File[];

  @OneToMany(() => Post, post => post.category)
  posts: Post[];

  @OneToMany(() => Product, product => product.category)
  products: Product[];

  // Ref: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties
  @OneToMany(() => CategoryFile, categoryFile => categoryFile.category)
  @Exclude()
  categoryFiles: CategoryFile[];

  @AfterLoad()
  transformFilesToImages() {
    if (this.categoryFiles) {
      this.images = this.categoryFiles.map(item => {
        return {
          id: item.fileId,
          uniqueName: item.image.uniqueName,
          position: item.position,
        } as File & { position: number };
      });
    }
  }

  get hasChildren(): boolean {
    return this.children && this.children.length > 0;
  }
}
