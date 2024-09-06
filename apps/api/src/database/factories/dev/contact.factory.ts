import { faker } from '@faker-js/faker';

import { CONTACT_STATUS } from '@/modules/contacts/constants/contacts.constant';
import { Contact } from '@/modules/contacts/entities/contact.entity';

const statuses = Object.values(CONTACT_STATUS).filter(x => x !== CONTACT_STATUS.DELETED);

export function createRandomContact() {
  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    message: faker.lorem.paragraphs({ min: 1, max: 3 }),
    isRead: faker.datatype.boolean(),
    status: faker.helpers.arrayElement(statuses),
    createdAt: faker.date.past(),
  } as Contact;
}

export const contactFactory = faker.helpers.multiple(createRandomContact, {
  count: 30,
});
