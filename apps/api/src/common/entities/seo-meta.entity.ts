import { Property, Embeddable } from '@mikro-orm/core';

import { Translation } from '../interfaces/language.interface';

@Embeddable()
export class SeoMeta {
  // TODO: Will be removed
  @Property({ type: 'varchar', length: 60, nullable: true })
  title?: string;

  // TODO: Will be removed
  @Property({ type: 'varchar', length: 150, nullable: true })
  description?: string;

  @Property({ type: 'jsonb', nullable: true })
  titleLocalized?: Translation[];

  @Property({ type: 'jsonb', nullable: true })
  descriptionLocalized?: Translation[];

  @Property({ type: 'varchar', length: 150, nullable: true })
  keywords?: string;
}
