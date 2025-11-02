import { Entity, ManyToOne, Property } from '@mikro-orm/core';

import { File } from '@/modules/files/entities/file.entity';

import { Product } from './product.entity';

@Entity({ tableName: 'products_files' })
export class ProductFile {
  @Property({ type: 'int', nullable: true })
  position: number;

  // Ref: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties
  @ManyToOne(() => Product, { primary: true, fieldName: 'product_id' })
  product: Product;

  // Ref: https://orkhan.gitbook.io/typeorm/docs/many-to-many-relations#many-to-many-relations-with-custom-properties
  @ManyToOne(() => File, { primary: true, fieldName: 'file_id' })
  image: File;
}
