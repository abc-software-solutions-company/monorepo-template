import { Database } from '@nozbe/watermelondb';

import BaseRepository from './base.repository';

import { WMTableName } from '../localdb.constant';
import { WMSeed } from '../models/seed.model';

class SeedRepository extends BaseRepository<WMSeed> {
  constructor(database: Database) {
    super(database, WMTableName.SEEDS);
  }
}

export default SeedRepository;
