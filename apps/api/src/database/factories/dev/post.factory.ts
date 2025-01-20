import { faker } from '@faker-js/faker';

import { toSlug } from '@/common/utils/string.util';

import { POST_STATUS, POST_TYPE } from '@/modules/posts/constants/posts.constant';
import { Post } from '@/modules/posts/entities/post.entity';

import { userFactory } from '../user.factory';

const statuses = Object.values(POST_STATUS).filter(x => x !== POST_STATUS.DELETED);
const defaultLanguage = 'en-us';

export function createRandomPost() {
  const name = faker.lorem.words(10);
  const description = `<p>${faker.lorem.words(20)}</p>`;
  const body = `<p>${faker.lorem.words(50)}</p>`;

  return {
    id: faker.string.uuid(),
    slug: toSlug(name),
    type: POST_TYPE.DEFAULT,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    coverLocalized: null,
    nameLocalized: [{ lang: defaultLanguage, value: name }],
    descriptionLocalized: [{ lang: defaultLanguage, value: description }],
    bodyLocalized: [{ lang: defaultLanguage, value: body }],
    category: null,
    creator: userFactory[0],
    createdAt: faker.date.past(),
  } as Post;
}

export const postFactory = faker.helpers.multiple(createRandomPost, { count: 30 });
