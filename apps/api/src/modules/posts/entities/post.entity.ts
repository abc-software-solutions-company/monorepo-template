import { Exclude, Expose } from 'class-transformer';
import { AfterLoad, Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '@/common/entities/abstract.entity';
import { SeoMeta } from '@/common/entities/seo-meta.entity';

import { Translation } from '@/common/interfaces/language.interface';

import { Category } from '@/modules/categories/entities/category.entity';
import { File } from '@/modules/files/entities/file.entity';
import { User } from '@/modules/users/entities/user.entity';

import { PostFile } from './post-file.entity';

import { POST_STATUS } from '../constants/posts.constant';

@Entity({ name: 'posts' })
export class Post extends AbstractEntity {
  @Column({ type: 'varchar', nullable: true, length: 255 })
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  nameLocalized: Translation[];

  @Column({ type: 'varchar', unique: true, length: 255 })
  slug: string;

  @Column({ type: 'varchar', nullable: true, length: 50 })
  type: string;

  @Column({ type: 'varchar', nullable: true, length: 2000 })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  descriptionLocalized: Translation[];

  @Column({ type: 'text', nullable: true })
  body: string;

  @Column({ type: 'jsonb', nullable: true })
  bodyLocalized: Translation[];

  @Column({ type: 'enum', enum: POST_STATUS, default: POST_STATUS.DRAFT })
  status: POST_STATUS;

  @ManyToOne(() => User, user => user.posts)
  creator: User;

  @ManyToOne(() => Category, category => category.posts)
  category: Category;

  @Column({ type: 'varchar', nullable: true, length: 1000 })
  cover: string;

  @Column({ type: 'jsonb', nullable: true })
  coverLocalized: Translation[];

  @Expose()
  images: File[];

  @Column({ type: 'json', nullable: true })
  seoMeta: SeoMeta;

  // Ref: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties
  @OneToMany(() => PostFile, postFile => postFile.post)
  @Exclude()
  postFiles: PostFile[];

  @AfterLoad()
  transformFilesToImages() {
    if (this.postFiles) {
      this.images = this.postFiles.map(item => {
        return {
          id: item.fileId,
          uniqueName: item.image.uniqueName,
          position: item.position,
        } as File & { position: number };
      });
    }
  }
}
