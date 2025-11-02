import { PrimaryKey, Property } from '@mikro-orm/core';

export abstract class AbstractEntity {
  @PrimaryKey({ type: 'uuid', defaultRaw: 'gen_random_uuid()' })
  id: string;

  @Property({ type: 'timestamp', defaultRaw: 'CURRENT_TIMESTAMP', onCreate: () => new Date() })
  createdAt: Date;

  @Property({ type: 'timestamp', nullable: true, onUpdate: () => new Date() })
  updatedAt: Date;
}
