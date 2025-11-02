import { Exclude, Expose } from 'class-transformer';
import { Collection, Entity, Enum, ManyToOne, OneToMany, Property } from '@mikro-orm/core';

import { TranslationEntity } from '@/common/entities/translation.entity';

import { Category } from '@/modules/categories/entities/category.entity';
import { File } from '@/modules/files/entities/file.entity';
import { User } from '@/modules/users/entities/user.entity';

import { PostFile } from './post-file.entity';

import { POST_STATUS } from '../constants/posts.constant';

@Entity({ tableName: 'posts' })
export class Post extends TranslationEntity {
  @Property({ type: 'varchar', length: 255, unique: true })
  slug: string;

  @Property({ type: 'varchar', length: 50, nullable: true })
  type: string;

  @Property({ type: 'varchar', length: 2048, nullable: true })
  externalUrl: string;

  @Enum(() => POST_STATUS)
  status: POST_STATUS = POST_STATUS.DRAFT;

  @Property({ type: 'int', default: 0 })
  order: number = 0;

  @Property({ type: 'timestamp', nullable: true })
  publishDate: Date;

  @Expose()
  images: File[];

  @ManyToOne(() => User, { nullable: true })
  creator: User;

  @ManyToOne(() => Category, { nullable: true })
  category: Category;

  // Ref: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties
  @OneToMany(() => PostFile, postFile => postFile.post)
  @Exclude()
  postFiles = new Collection<PostFile>(this);

  transformFilesToImages() {
    if (this.postFiles.isInitialized()) {
      this.images = this.postFiles.getItems().map(item => {
        return {
          id: item.fileId,
          uniqueName: item.image.uniqueName,
          position: item.position,
        } as File & { position: number };
      });
    }
  }
}
