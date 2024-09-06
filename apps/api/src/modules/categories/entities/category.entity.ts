import { Exclude, Expose } from 'class-transformer';
import { AfterLoad, Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '@/common/entities/abstract.entity';

import { File } from '@/modules/files/entities/file.entity';
import { Post } from '@/modules/posts/entities/post.entity';
import { Product } from '@/modules/products/entities/product.entity';
import { User } from '@/modules/users/entities/user.entity';

import { CategoryFile } from './category-file.entity';

import { CATEGORY_STATUS, CATEGORY_TYPE } from '../constants/categories.constant';

@Entity({ name: 'categories' })
export class Category extends AbstractEntity {
  @Column()
  name: string;

  @Column({ type: 'varchar', unique: true, length: 255 })
  slug: string;

  @Column({ type: 'enum', enum: CATEGORY_TYPE, default: CATEGORY_TYPE.POST })
  type: CATEGORY_TYPE;

  @Column({ type: 'varchar', nullable: true, length: 2000 })
  description: string;

  @Column({ type: 'text', nullable: true })
  body: string;

  @Column({ type: 'enum', enum: CATEGORY_STATUS, default: CATEGORY_STATUS.VISIBLED })
  status: CATEGORY_STATUS;

  @Column({ type: 'varchar', nullable: true, length: 1000 })
  cover: string;

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
