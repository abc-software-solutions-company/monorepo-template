import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '@/common/entities/abstract.entity';

import { Translation } from '@/common/interfaces/language.interface';

import { FAQ_STATUS } from '../constants/faqs.constant';

@Entity({ name: 'faqs' })
export class Faq extends AbstractEntity {
  @Column({ type: 'varchar', nullable: true, length: 255 })
  title: string;

  @Column({ type: 'jsonb', nullable: true })
  titleLocalized: Translation[];

  @Column({ type: 'varchar', nullable: true, length: 2000 })
  content: string;

  @Column({ type: 'jsonb', nullable: true })
  contentLocalized: Translation[];

  @Column({ type: 'enum', enum: FAQ_STATUS, default: FAQ_STATUS.DRAFT })
  status: FAQ_STATUS;
}
