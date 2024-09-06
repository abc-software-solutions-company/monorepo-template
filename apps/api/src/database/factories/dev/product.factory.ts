import { faker } from '@faker-js/faker';

import { toSlug } from '@/common/utils/string.util';

import { PRODUCT_STATUS } from '@/modules/products/constants/products.constant';
import { Product } from '@/modules/products/entities/product.entity';

import { categoryFactory } from './category.factory';

import { userFactory } from '../user.factory';

const statuses = Object.values(PRODUCT_STATUS).filter(x => x !== PRODUCT_STATUS.DELETED);

const description =
  '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>';
const body = `
  <h3>What is Lorem Ipsum?</h3>
  <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
  <h3>Where does it come from?</h3>
  <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections 1.10.32 and 1.10.33 of "de Finibus Bonorum et Malorum" (The Extremes of Good and Evil) by Cicero, written in 45 BC. This book is a treatise on the theory of ethics, very popular during the Renaissance. The first line of Lorem Ipsum, "Lorem ipsum dolor sit amet..", comes from a line in section 1.10.32.</p>
  <p>The standard chunk of Lorem Ipsum used since the 1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from "de Finibus Bonorum et Malorum" by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.</p>
  <h3>Why do we use it?</h3>
  <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English.</p>
  <p>Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. Various versions have evolved over the years, sometimes by accident, sometimes on purpose (injected humour and the like).</p>
  <p>On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain. These cases are perfectly simple and easy to distinguish. In a free hour, when our power of choice is untrammelled and when nothing prevents our being able to do what we like best, every pleasure is to be welcomed and every pain avoided. But in certain circumstances and owing to the claims of duty or the obligations of business it will frequently occur that pleasures have to be repudiated and annoyances accepted. The wise man therefore always holds in these matters to this principle of selection: he rejects pleasures to secure other greater pleasures, or else he endures pains to avoid worse pains.</p>
  <h3>Where can I get some?</h3>
  <p>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</p>
  <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo. Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam, nisi ut aliquid ex ea commodi consequatur? Quis autem vel eum iure reprehenderit qui in ea voluptate velit esse quam nihil molestiae consequatur, vel illum qui dolorem eum fugiat quo voluptas nulla pariatur?</p>
`;

export const productFactory = [
  {
    id: '83fd7a2e-0181-439f-9c41-4fa78071bc5b',
    name: 'Canon EOS R6',
    slug: toSlug('Canon EOS R6'),
    description,
    body,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    cover: 'pexels-babydov-7789210.jpg',
    category: categoryFactory[0],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: '932cf676-1be9-4cdf-9f7d-4032f9ed4d4b',
    name: 'Fujifilm X-T30 II',
    slug: toSlug('Fujifilm X-T30 II'),
    description,
    body,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    cover: 'pexels-fujifilmusa-3497065.jpg',
    category: categoryFactory[0],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: 'd01142b1-88a3-4524-bb63-3e2df44ec257',
    name: 'Fujifilm X-T10',
    slug: toSlug('Fujifilm X-T10'),
    description,
    body,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    cover: 'pexels-madebymath-90946.jpg',
    category: categoryFactory[0],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: '38a7df8c-93cd-4bc5-ba1e-7bd4c356f9dd',
    name: 'Pink Sunglasses With Gold Frames',
    slug: toSlug('Pink Sunglasses With Gold Frames'),
    description,
    body,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    cover: 'pexels-didsss-1669595.jpg',
    category: categoryFactory[1],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: '6cac73b7-36c4-4df1-bc0f-85a0fc40d6e1',
    name: 'Black Framed Hippie Sunglasses',
    slug: toSlug('Black Framed Hippie Sunglasses'),
    description,
    body,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    cover: 'pexels-mota-701877.jpg',
    category: categoryFactory[1],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: '126f4f23-ca69-4b7e-9552-2e24bd586d3c',
    name: 'Sony Alpha 7',
    slug: toSlug('Sony Alpha 7'),
    description,
    body,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    cover: 'pexels-pixabay-45889.jpg',
    category: categoryFactory[0],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: 'f1263028-6c86-4799-8c64-0cc990ad19b2',
    name: 'Canon EOS 80D',
    slug: toSlug('Canon EOS 80D'),
    description,
    body,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    cover: 'pexels-sparkphotopro-10775338.jpg',
    category: categoryFactory[0],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: '0be7f289-7937-47cc-89c5-7f8e2c9ef741',
    name: 'Sunglasses With Brown Frame',
    slug: toSlug('Sunglasses With Brown Frame'),
    description,
    body,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    cover: 'pexels-teejay-1362558.jpg',
    category: categoryFactory[1],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: '793484cd-9796-41c4-86a8-d098bf0b4d21',
    name: 'Adam Kimmel Watch S7',
    slug: toSlug('Adam Kimmel Watch S7'),
    description,
    body,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    cover: 'pexels-pixabay-277390.jpg',
    category: categoryFactory[1],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
  {
    id: '5db3eaca-7568-48e8-b851-7b72496f4bc0',
    name: 'Maurice de Mauriac L3',
    slug: toSlug('Maurice de Mauriac L3'),
    description,
    body,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    cover: 'pexels-pixabay-280250.jpg',
    category: categoryFactory[1],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  },
] as unknown as Product[];
