import { faker } from '@faker-js/faker';

import { toSlug } from '@/common/utils/string.util';

import { POST_STATUS } from '@/modules/posts/constants/posts.constant';
import { Post } from '@/modules/posts/entities/post.entity';

import { userFactory } from '../user.factory';

const statuses = Object.values(POST_STATUS).filter(x => x !== POST_STATUS.DELETED);

export function createRandomPost() {
  const name = faker.lorem.words(10);

  return {
    id: faker.string.uuid(),
    name,
    slug: toSlug(name),
    description: `<p>${faker.lorem.words(20)}</p>`,
    body: `<p>${faker.lorem.words(120)}</p>`,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  } as Post;
}

export const postFactory = faker.helpers.multiple(createRandomPost, {
  count: 30,
});
