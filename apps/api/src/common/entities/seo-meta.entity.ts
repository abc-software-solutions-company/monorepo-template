import { Column } from 'typeorm';

export class SeoMeta {
  @Column({ type: 'varchar', length: 60, nullable: true })
  title?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  description?: string;

  @Column({ type: 'varchar', length: 150, nullable: true })
  keywords?: string;
}
