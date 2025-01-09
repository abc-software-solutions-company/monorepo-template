import { Database, Q } from '@nozbe/watermelondb';

import BaseRepository from './base.repository';

import { WMTableName } from '../localdb.constant';
import { WMPost } from '../models/post.model';

class PostRepository extends BaseRepository<WMPost> {
  constructor(database: Database) {
    super(database, WMTableName.POSTS);
  }

  async getAllDrafts() {
    const response = await this.getCollection().query(Q.where('is_public', false)).fetch();

    return response;
  }
}

export default PostRepository;
