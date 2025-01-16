import { faker } from '@faker-js/faker';

import { FAQ_STATUS } from '@/modules/faqs/constants/faqs.constant';
import { Faq } from '@/modules/faqs/entities/faq.entity';

const statuses = Object.values(FAQ_STATUS).filter(x => x !== FAQ_STATUS.DELETED);

export function createRandomFaq() {
  const title = faker.lorem.words(10);
  const defaultLanguage = 'en-us';

  return {
    id: faker.string.uuid(),
    title,
    titleLocalized: [{ lang: defaultLanguage, value: title }],
    content: `<p>${faker.lorem.words(20)}</p>`,
    contentLocalized: [{ lang: defaultLanguage, value: faker.lorem.words(20) }],
    status: faker.helpers.arrayElement(statuses),
    createdAt: faker.date.past(),
  } as Faq;
}

export const faqFactory = faker.helpers.multiple(createRandomFaq, {
  count: 30,
});
