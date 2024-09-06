import { Column, Entity } from 'typeorm';

import { AbstractEntity } from '@/common/entities/abstract.entity';

import { CONTACT_STATUS } from '../constants/contacts.constant';

@Entity({ name: 'contacts' })
export class Contact extends AbstractEntity {
  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 1000 })
  message: string;

  @Column({ type: 'boolean', default: false })
  isRead: boolean;

  @Column({ type: 'enum', enum: CONTACT_STATUS, default: CONTACT_STATUS.VISIBLED })
  status: CONTACT_STATUS;
}
