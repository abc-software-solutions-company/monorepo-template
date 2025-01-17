import { faker } from '@faker-js/faker';

import { toSlug } from '@/common/utils/string.util';

import { POST_STATUS, POST_TYPE } from '@/modules/posts/constants/posts.constant';
import { Post } from '@/modules/posts/entities/post.entity';

import { userFactory } from '../user.factory';

const statuses = Object.values(POST_STATUS).filter(x => x !== POST_STATUS.DELETED);

export function createRandomPost() {
  const name = faker.lorem.words(10);
  const defaultLanguage = 'en-us';

  return {
    id: faker.string.uuid(),
    name: null,
    nameLocalized: [{ lang: defaultLanguage, value: name }],
    slug: toSlug(name),
    type: POST_TYPE.DEFAULT,
    description: null,
    descriptionLocalized: [{ lang: defaultLanguage, value: `<p>${faker.lorem.words(20)}</p>` }],
    body: null,
    bodyLocalized: [{ lang: defaultLanguage, value: `<p>${faker.lorem.words(20)}</p>` }],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    category: null,
    creator: userFactory[0],
    createdAt: faker.date.past(),
  } as Post;
}

export const postFactory = faker.helpers.multiple(createRandomPost, {
  count: 30,
});
