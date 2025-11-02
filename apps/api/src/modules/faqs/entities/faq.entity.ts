import { Entity, Enum, Property } from '@mikro-orm/core';

import { AbstractEntity } from '@/common/entities/abstract.entity';

import { Translation } from '@/common/interfaces/language.interface';

import { FAQ_STATUS } from '../constants/faqs.constant';

@Entity({ tableName: 'faqs' })
export class Faq extends AbstractEntity {
  @Property({ type: 'jsonb', nullable: true })
  titleLocalized: Translation[];

  @Property({ type: 'jsonb', nullable: true })
  descriptionLocalized: Translation[];

  @Enum(() => FAQ_STATUS)
  status: FAQ_STATUS = FAQ_STATUS.DRAFT;
}
