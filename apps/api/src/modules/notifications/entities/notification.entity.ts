import { Entity, Property } from '@mikro-orm/core';

import { AbstractEntity } from '@/common/entities/abstract.entity';

@Entity({ tableName: 'notifications' })
export class Notification extends AbstractEntity {
  @Property({ type: 'varchar', length: 255 })
  title: string;

  @Property({ type: 'varchar', length: 255 })
  content: string;

  @Property({ type: 'varchar', nullable: true })
  image: string;

  @Property({ type: 'varchar', nullable: true })
  topic: string;

  @Property({ type: 'varchar', nullable: true })
  scheduling: string;

  @Property({ type: 'varchar', nullable: true })
  channelId: string;

  @Property({ type: 'boolean', default: false })
  sound: boolean = false;
}
