import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { File } from '@/modules/files/entities/file.entity';
import { Post } from '@/modules/posts/entities/post.entity';

@Entity({ tableName: 'posts_files' })
export class PostFile {
  @Property({ type: 'int', nullable: true })
  position: number;

  // Ref: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties
  @ManyToOne(() => Post, { primary: true, fieldName: 'post_id' })
  post: Post;

  // Ref: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties
  @ManyToOne(() => File, { primary: true, fieldName: 'file_id' })
  image: File;
}
