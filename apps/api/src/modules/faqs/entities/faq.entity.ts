import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '@/common/entities/abstract.entity';

import { Translation } from '@/common/interfaces/language.interface';

import { FAQ_STATUS } from '../constants/faqs.constant';

@Entity({ name: 'faqs' })
export class Faq extends AbstractEntity {
  @Column({ type: 'jsonb', nullable: true })
  titleLocalized: Translation[];

  @Column({ type: 'jsonb', nullable: true })
  descriptionLocalized: Translation[];

  @Column({ type: 'varchar', length: 50, default: FAQ_STATUS.DRAFT })
  status: FAQ_STATUS;
}
