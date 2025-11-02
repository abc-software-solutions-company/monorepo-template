import { faker } from '@faker-js/faker';

import { toSlug } from '@/common/utils/string.util';

import { CATEGORY_STATUS, CATEGORY_TYPE } from '@/modules/categories/constants/categories.constant';
import { Category } from '@/modules/categories/entities/category.entity';

import { userFactory } from '../user.factory';

const statuses = Object.values(CATEGORY_STATUS).filter(x => x !== CATEGORY_STATUS.DELETED);
const defaultLanguage = process.env.AP_LANG_CODE ?? 'en-us';

export const categoryFactory = [
  {
    id: '47dbd699-b483-4cf5-aa5c-64120ce8cfdb',
    slug: toSlug('Technology'),
    type: CATEGORY_TYPE.PRODUCT,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    coverLocalized: null,
    nameLocalized: [{ lang: defaultLanguage, value: 'Technology' }],
    descriptionLocalized: [{ lang: defaultLanguage, value: `<p>${faker.lorem.words(20)}</p>` }],
    bodyLocalized: [{ lang: defaultLanguage, value: `<p>${faker.lorem.words(20)}</p>` }],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: 'd34f6046-1f3c-4acf-9b03-910398694b76',
    slug: toSlug('Fashion'),
    type: CATEGORY_TYPE.PRODUCT,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    coverLocalized: null,
    nameLocalized: [{ lang: defaultLanguage, value: 'Fashion' }],
    descriptionLocalized: [{ lang: defaultLanguage, value: `<p>${faker.lorem.words(20)}</p>` }],
    bodyLocalized: [{ lang: defaultLanguage, value: `<p>${faker.lorem.words(20)}</p>` }],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: '4e13a831-24ba-46bc-9705-0a5723e9427a',
    slug: toSlug('Recruit'),
    type: CATEGORY_TYPE.NEWS,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    coverLocalized: null,
    nameLocalized: [{ lang: defaultLanguage, value: 'Recruit' }],
    descriptionLocalized: [{ lang: defaultLanguage, value: `<p>${faker.lorem.words(20)}</p>` }],
    bodyLocalized: [{ lang: defaultLanguage, value: `<p>${faker.lorem.words(20)}</p>` }],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: 'bb323cd2-384e-438e-a31a-775ffc031aa7',
    slug: toSlug('Service'),
    type: CATEGORY_TYPE.NEWS,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    coverLocalized: null,
    nameLocalized: [{ lang: defaultLanguage, value: 'Service' }],
    descriptionLocalized: [{ lang: defaultLanguage, value: `<p>${faker.lorem.words(20)}</p>` }],
    bodyLocalized: [{ lang: defaultLanguage, value: `<p>${faker.lorem.words(20)}</p>` }],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
] as Category[];

categoryFactory.push({
  id: 'ca1a9565-a054-4004-a206-2339ffe026f6',
  slug: toSlug('Phone'),
  type: CATEGORY_TYPE.PRODUCT,
  status: statuses[Math.floor(Math.random() * statuses.length)],
  parent: categoryFactory[0],
  coverLocalized: null,
  nameLocalized: [{ lang: defaultLanguage, value: 'Phone' }],
  descriptionLocalized: [{ lang: defaultLanguage, value: `<p>${faker.lorem.words(20)}</p>` }],
  bodyLocalized: [{ lang: defaultLanguage, value: `<p>${faker.lorem.words(20)}</p>` }],
  creator: userFactory[0],
  createdAt: faker.date.past(),
} as Category);
