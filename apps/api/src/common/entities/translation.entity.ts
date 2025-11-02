import { Property } from '@mikro-orm/core';

import { AbstractEntity } from './abstract.entity';
import { SeoMeta } from './seo-meta.entity';

import { Translation } from '../interfaces/language.interface';

export abstract class TranslationEntity extends AbstractEntity {
  @Property({ type: 'jsonb', nullable: true })
  coverLocalized: Translation[];

  @Property({ type: 'jsonb', nullable: true })
  nameLocalized: Translation[];

  @Property({ type: 'jsonb', nullable: true })
  descriptionLocalized: Translation[];

  @Property({ type: 'jsonb', nullable: true })
  bodyLocalized: Translation[];

  @Property({ type: 'jsonb', nullable: true })
  seoMeta: SeoMeta;
}
