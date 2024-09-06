import { Model, tableSchema } from '@nozbe/watermelondb';
import { field } from '@nozbe/watermelondb/decorators';

import { WMTableName } from '../localdb.constant';

export class WMSeed extends Model {
  static table = WMTableName.SEEDS;

  @field('is_seeded')
  isSeeded!: boolean;
}

export const seedSchema = tableSchema({
  name: WMTableName.SEEDS,
  columns: [{ name: 'is_seeded', type: 'boolean' }],
});
