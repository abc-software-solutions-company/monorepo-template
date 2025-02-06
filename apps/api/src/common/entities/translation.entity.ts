import { Column } from 'typeorm';

import { AbstractEntity } from './abstract.entity';
import { SeoMeta } from './seo-meta.entity';

import { Translation } from '../interfaces/language.interface';

export abstract class TranslationEntity extends AbstractEntity {
  @Column({ type: 'jsonb', nullable: true })
  coverLocalized: Translation[];

  @Column({ type: 'jsonb', nullable: true })
  nameLocalized: Translation[];

  @Column({ type: 'jsonb', nullable: true })
  descriptionLocalized: Translation[];

  @Column({ type: 'jsonb', nullable: true })
  bodyLocalized: Translation[];

  @Column({ type: 'jsonb', nullable: true })
  seoMeta: SeoMeta;
}
