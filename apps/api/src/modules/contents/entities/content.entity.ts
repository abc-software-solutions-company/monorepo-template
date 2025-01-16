import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '@/common/entities/abstract.entity';
import { SeoMeta } from '@/common/entities/seo-meta.entity';

import { Translation } from '@/common/interfaces/language.interface';

import { CONTENT_STATUS } from '../constants/contents.constant';

@Entity({ name: 'contents' })
export class Content extends AbstractEntity {
  @Column({ type: 'varchar', nullable: true, length: 255 })
  name: string;

  @Column({ type: 'jsonb', nullable: true })
  nameLocalized: Translation[];

  @Column({ type: 'varchar', unique: true, length: 255 })
  slug: string;

  @Column({ type: 'varchar', nullable: true, length: 2000 })
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  descriptionLocalized: Translation[];

  @Column({ type: 'text', nullable: true })
  body: string;

  @Column({ type: 'jsonb', nullable: true })
  bodyLocalized: Translation[];

  @Column({ type: 'varchar', length: 50 })
  type: string;

  @Column({ type: 'enum', enum: CONTENT_STATUS, default: CONTENT_STATUS.DRAFT })
  status: CONTENT_STATUS;

  @Column({ type: 'json', nullable: true })
  seoMeta: SeoMeta;
}
