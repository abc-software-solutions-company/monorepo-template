import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '@/common/entities/abstract.entity';

import { FAQ_STATUS } from '../constants/faqs.constant';

@Entity({ name: 'faqs' })
export class Faq extends AbstractEntity {
  @Column({ type: 'varchar', length: 255 })
  title: string;

  @Column({ type: 'varchar', length: 2000 })
  content: string;

  @Column({ type: 'enum', enum: FAQ_STATUS, default: FAQ_STATUS.DRAFT })
  status: FAQ_STATUS;
}
