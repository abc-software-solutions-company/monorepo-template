import { Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';

import { File } from '@/modules/files/entities/file.entity';

import { Category } from './category.entity';

@Entity({ tableName: 'categories_files' })
export class CategoryFile {
  @Property({ type: 'int', nullable: true })
  position: number;

  // Ref: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties
  @ManyToOne(() => Category, { primary: true, fieldName: 'category_id' })
  category: Category;

  // Ref: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties
  @ManyToOne(() => File, { primary: true, fieldName: 'file_id' })
  image: File;
}
