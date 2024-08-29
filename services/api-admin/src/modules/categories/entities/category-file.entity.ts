import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { File } from '@/modules/files/entities/file.entity';

import { Category } from './category.entity';

@Entity({ name: 'categories_files' })
export class CategoryFile {
  @PrimaryGeneratedColumn('uuid', { name: 'category_id' })
  categoryId: string;

  @PrimaryGeneratedColumn('uuid', { name: 'file_id' })
  fileId: string;

  @Column({ type: 'int', nullable: true })
  position: number;

  // Ref: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties
  @ManyToOne(() => Category, category => category.categoryFiles)
  @JoinColumn([{ name: 'category_id', referencedColumnName: 'id' }])
  category: Category;

  // Ref: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties
  @ManyToOne(() => File, file => file.categoryFiles)
  @JoinColumn([{ name: 'file_id', referencedColumnName: 'id' }])
  image: File;
}
