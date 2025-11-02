import { faker } from '@faker-js/faker';

import { toSlug } from '@/common/utils/string.util';

import { PRODUCT_STATUS, PRODUCT_TYPE } from '@/modules/products/constants/products.constant';
import { Product } from '@/modules/products/entities/product.entity';

import { categoryFactory } from './category.factory';

import { userFactory } from '../user.factory';

const statuses = Object.values(PRODUCT_STATUS).filter(x => x !== PRODUCT_STATUS.DELETED);
const defaultLanguage = process.env.AP_LANG_CODE ?? 'en-us';
const description =
  '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>';
const body = `
  <h3>What is Lorem Ipsum?</h3>
  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
  <h3>Where does it come from?</h3>
  <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>
  <p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p>
`;

export const productFactory = [
  {
    id: '83fd7a2e-0181-439f-9c41-4fa78071bc5b',
    slug: toSlug('Canon EOS R6'),
    type: PRODUCT_TYPE.DEFAULT,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    coverLocalized: [{ lang: defaultLanguage, value: 'pexels-babydov-7789210.jpg' }],
    nameLocalized: [{ lang: defaultLanguage, value: 'Canon EOS R6' }],
    descriptionLocalized: [{ lang: defaultLanguage, value: description }],
    bodyLocalized: [{ lang: defaultLanguage, value: body }],
    category: categoryFactory[0],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: '932cf676-1be9-4cdf-9f7d-4032f9ed4d4b',
    slug: toSlug('Fujifilm X-T30 II'),
    type: PRODUCT_TYPE.DEFAULT,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    coverLocalized: [{ lang: defaultLanguage, value: 'pexels-fujifilmusa-3497065.jpg' }],
    nameLocalized: [{ lang: defaultLanguage, value: 'Fujifilm X-T30 II' }],
    descriptionLocalized: [{ lang: defaultLanguage, value: description }],
    bodyLocalized: [{ lang: defaultLanguage, value: body }],
    category: categoryFactory[0],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: 'd01142b1-88a3-4524-bb63-3e2df44ec257',
    slug: toSlug('Fujifilm X-T10'),
    type: PRODUCT_TYPE.DEFAULT,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    coverLocalized: [{ lang: defaultLanguage, value: 'pexels-madebymath-90946.jpg' }],
    nameLocalized: [{ lang: defaultLanguage, value: 'Fujifilm X-T10' }],
    descriptionLocalized: [{ lang: defaultLanguage, value: description }],
    bodyLocalized: [{ lang: defaultLanguage, value: body }],
    category: categoryFactory[0],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: '38a7df8c-93cd-4bc5-ba1e-7bd4c356f9dd',
    slug: toSlug('Pink Sunglasses With Gold Frames'),
    type: PRODUCT_TYPE.DEFAULT,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    coverLocalized: [{ lang: defaultLanguage, value: 'pexels-didsss-1669595.jpg' }],
    nameLocalized: [{ lang: defaultLanguage, value: 'Pink Sunglasses With Gold Frames' }],
    descriptionLocalized: [{ lang: defaultLanguage, value: description }],
    bodyLocalized: [{ lang: defaultLanguage, value: body }],
    category: categoryFactory[1],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: '6cac73b7-36c4-4df1-bc0f-85a0fc40d6e1',
    slug: toSlug('Black Framed Hippie Sunglasses'),
    type: PRODUCT_TYPE.DEFAULT,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    coverLocalized: [{ lang: defaultLanguage, value: 'pexels-mota-701877.jpg' }],
    nameLocalized: [{ lang: defaultLanguage, value: 'Black Framed Hippie Sunglasses' }],
    descriptionLocalized: [{ lang: defaultLanguage, value: description }],
    bodyLocalized: [{ lang: defaultLanguage, value: body }],
    category: categoryFactory[1],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: '126f4f23-ca69-4b7e-9552-2e24bd586d3c',
    slug: toSlug('Sony Alpha 7'),
    type: PRODUCT_TYPE.DEFAULT,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    coverLocalized: [{ lang: defaultLanguage, value: 'pexels-pixabay-45889.jpg' }],
    nameLocalized: [{ lang: defaultLanguage, value: 'Sony Alpha 7' }],
    descriptionLocalized: [{ lang: defaultLanguage, value: description }],
    bodyLocalized: [{ lang: defaultLanguage, value: body }],
    category: categoryFactory[0],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: 'f1263028-6c86-4799-8c64-0cc990ad19b2',
    slug: toSlug('Canon EOS 80D'),
    type: PRODUCT_TYPE.DEFAULT,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    coverLocalized: [{ lang: defaultLanguage, value: 'pexels-sparkphotopro-10775338.jpg' }],
    nameLocalized: [{ lang: defaultLanguage, value: 'Canon EOS 80D' }],
    descriptionLocalized: [{ lang: defaultLanguage, value: description }],
    bodyLocalized: [{ lang: defaultLanguage, value: body }],
    category: categoryFactory[0],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: '0be7f289-7937-47cc-89c5-7f8e2c9ef741',
    slug: toSlug('Sunglasses With Brown Frame'),
    type: PRODUCT_TYPE.DEFAULT,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    coverLocalized: [{ lang: defaultLanguage, value: 'pexels-teejay-1362558.jpg' }],
    nameLocalized: [{ lang: defaultLanguage, value: 'Sunglasses With Brown Frame' }],
    descriptionLocalized: [{ lang: defaultLanguage, value: description }],
    bodyLocalized: [{ lang: defaultLanguage, value: body }],
    category: categoryFactory[1],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: '793484cd-9796-41c4-86a8-d098bf0b4d21',
    slug: toSlug('Adam Kimmel Watch S7'),
    type: PRODUCT_TYPE.DEFAULT,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    coverLocalized: [{ lang: defaultLanguage, value: 'pexels-pixabay-277390.jpg' }],
    nameLocalized: [{ lang: defaultLanguage, value: 'Adam Kimmel Watch S7' }],
    descriptionLocalized: [{ lang: defaultLanguage, value: description }],
    bodyLocalized: [{ lang: defaultLanguage, value: body }],
    category: categoryFactory[1],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: '5db3eaca-7568-48e8-b851-7b72496f4bc0',
    slug: toSlug('Maurice de Mauriac L3'),
    type: PRODUCT_TYPE.DEFAULT,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    coverLocalized: [{ lang: defaultLanguage, value: 'pexels-pixabay-280250.jpg' }],
    nameLocalized: [{ lang: defaultLanguage, value: 'Maurice de Mauriac L3' }],
    descriptionLocalized: [{ lang: defaultLanguage, value: description }],
    bodyLocalized: [{ lang: defaultLanguage, value: body }],
    category: categoryFactory[1],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
] as Product[];
