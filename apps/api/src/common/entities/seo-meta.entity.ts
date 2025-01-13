import { Column } from 'typeorm';

import { Translation } from '../interfaces/language.interface';

export class SeoMeta {
  // TODO: Will be removed
  @Column({ type: 'varchar', length: 60, nullable: true })
  title?: string;

  // TODO: Will be removed
  @Column({ type: 'varchar', length: 150, nullable: true })
  description?: string;

  @Column({ type: 'jsonb', nullable: true })
  titleLocalized?: Translation[];

  @Column({ type: 'jsonb', nullable: true })
  descriptionLocalized?: Translation[];

  @Column({ type: 'varchar', length: 150, nullable: true })
  keywords?: string;
}
