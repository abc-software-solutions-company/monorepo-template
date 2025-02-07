import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '@/common/entities/abstract.entity';

import { CONTACT_STATUS } from '../constants/contacts.constant';

@Entity({ name: 'contacts' })
export class Contact extends AbstractEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 320 })
  email: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  subject: string;

  @Column({ type: 'varchar', length: 5000 })
  message: string;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'varchar', length: 50, default: CONTACT_STATUS.PUBLISHED })
  status: CONTACT_STATUS;
}
