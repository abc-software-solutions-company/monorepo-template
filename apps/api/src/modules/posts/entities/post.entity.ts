import { Exclude, Expose } from 'class-transformer';
import { AfterLoad, Column, Entity, ManyToOne, OneToMany } from 'typeorm';

import { TranslationEntity } from '@/common/entities/translation.entity';

import { Category } from '@/modules/categories/entities/category.entity';
import { File } from '@/modules/files/entities/file.entity';
import { User } from '@/modules/users/entities/user.entity';

import { PostFile } from './post-file.entity';

import { POST_STATUS } from '../constants/posts.constant';

@Entity({ name: 'posts' })
export class Post extends TranslationEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  type: string;

  @Column({ type: 'varchar', length: 2048, nullable: true })
  externalUrl: string;

  @Column({ type: 'varchar', length: 50, default: POST_STATUS.DRAFT })
  status: POST_STATUS;

  @Column({ type: 'int', default: 0 })
  order: number;

  @Column({ type: 'timestamp without time zone', nullable: true })
  publishDate: Date;

  @Expose()
  images: File[];

  @ManyToOne(() => User, user => user.posts)
  creator: User;

  @ManyToOne(() => Category, category => category.posts)
  category: Category;

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
