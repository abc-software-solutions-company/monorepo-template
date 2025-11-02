import { faker } from '@faker-js/faker';

import { FAQ_STATUS } from '@/modules/faqs/constants/faqs.constant';
import { Faq } from '@/modules/faqs/entities/faq.entity';

const statuses = Object.values(FAQ_STATUS).filter(x => x !== FAQ_STATUS.DELETED);
const defaultLanguage = process.env.AP_LANG_CODE ?? 'en-us';

export function createRandomFaq() {
  const title = faker.lorem.words(10);
  const description = `<p>${faker.lorem.words(20)}</p>`;

  return {
    id: faker.string.uuid(),
    status: statuses[Math.floor(Math.random() * statuses.length)],
    titleLocalized: [{ lang: defaultLanguage, value: title }],
    descriptionLocalized: [{ lang: defaultLanguage, value: description }],
    createdAt: faker.date.past(),
  } as Faq;
}

export const faqFactory = faker.helpers.multiple(createRandomFaq, { count: 30 });
