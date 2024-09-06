import { faker } from '@faker-js/faker';

import { toSlug } from '@/common/utils/string.util';

import { CATEGORY_STATUS, CATEGORY_TYPE } from '@/modules/categories/constants/categories.constant';
import { Category } from '@/modules/categories/entities/category.entity';

import { userFactory } from '../user.factory';

const statuses = Object.values(CATEGORY_STATUS).filter(x => x !== CATEGORY_STATUS.DELETED);

export const categoryFactory = [
  {
    id: '47dbd699-b483-4cf5-aa5c-64120ce8cfdb',
    name: 'Technology',
    slug: toSlug('Technology'),
    type: CATEGORY_TYPE.PRODUCT,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    description: `<p>${faker.lorem.words(20)}</p>`,
    body: `<p>${faker.lorem.words(120)}</p>`,
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: 'd34f6046-1f3c-4acf-9b03-910398694b76',
    name: 'Fashion',
    slug: toSlug('Fashion'),
    type: CATEGORY_TYPE.PRODUCT,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    description: `<p>${faker.lorem.words(20)}</p>`,
    body: `<p>${faker.lorem.words(120)}</p>`,
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
] as unknown as Category[];
