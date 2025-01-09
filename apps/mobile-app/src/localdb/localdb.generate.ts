import log from '@/utils/logger.util';

import { WMSeed } from './models/seed.model';
import PostRepository from './repositories/post.repository';
import SeedRepository from './repositories/seed.repository';
import { database } from './localdb.bootstrap';
import { WMTableName } from './localdb.constant';

const postRepo = new PostRepository(database);
const seedRepo = new SeedRepository(database);

export async function generateSeed() {
  try {
    const count = await seedRepo.count();

    if (count > 0) {
      log.debug('localdb: Seed already generated');

      return;
    }

    await seedRepo.create({ isSeeded: true });

    log.debug('localdb: Seed generated');
  } catch (error) {
    log.error('localdb: Error generating seed:', error);
  }
}

export async function generatePosts() {
  try {
    const count = await postRepo.count();

    if (count > 0) {
      log.debug('localdb: Posts already generated');

      return;
    }

    Promise.all([
      postRepo.create({ id: '0001', title: 'Post 1', tags: ['tag1', 'tag2'], is_public: true, seo: { title: 'Post 1' } }),
      postRepo.create({ id: '0002', title: 'Post 2', tags: ['tag1', 'tag2'], is_public: false, seo: undefined }),
    ]);

    log.debug('localdb: Posts generated');
  } catch (error) {
    log.error('localdb: Error generating posts:', error);
  }
}

export async function resetLocalDatabase() {
  const isDbEmpty = await isDatabaseEmpty();

  if (isDbEmpty) {
    log.debug('localdb: Database already reset');

    return;
  }

  await database.write(async () => {
    await database.unsafeResetDatabase();
  });
}

export async function isDatabaseEmpty() {
  const count = await database.get<WMSeed>(WMTableName.SEEDS).query().fetchCount();

  return count === 0;
}
