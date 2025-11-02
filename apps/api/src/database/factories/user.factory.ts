import { faker } from '@faker-js/faker';

import countries from '@/fixtures/country-list.json';

import { hashPassword } from '@/common/utils/password.util';

import { AUTH_PROVIDER, AUTH_TYPE } from '@/modules/auth/constants/auth.constant';
import { USER_GENDER, USER_ROLE, USER_STATUS } from '@/modules/users/constants/users.constant';
import { User } from '@/modules/users/entities/user.entity';

const statuses = Object.values(USER_STATUS);
const genders = Object.values(USER_GENDER);
const roles = Object.values(USER_ROLE);

const users = [
  {
    id: '6090075c-a393-4a8e-96d5-db8f8d4a971f',
    name: 'Ammodesk',
    email: process.env.AP_USER_EMAIL,
    password: hashPassword(process.env.AP_USER_PASSWORD),
    gender: USER_GENDER.OTHER,
    status: USER_STATUS.ACTIVE,
    role: USER_ROLE.SUPER_ADMIN,
    provider: AUTH_PROVIDER.CREDENTIALS,
    authType: AUTH_TYPE.CREDENTIALS,
    country: 'US',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  },
  {
    id: '5bc778a0-2675-45c5-8294-3dadd79e3b53',
    name: 'Kilobyte',
    email: 'mrkilobyte@gmail.com',
    password: hashPassword(process.env.AP_USER_PASSWORD),
    gender: USER_GENDER.OTHER,
    status: USER_STATUS.ACTIVE,
    role: USER_ROLE.USER,
    provider: AUTH_PROVIDER.CREDENTIALS,
    authType: AUTH_TYPE.CREDENTIALS,
    country: 'US',
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  },
] as User[];

function createRandomUser() {
  const countryCodes = ['91', '65', '1'];
  const randomCountry = countryCodes[Math.floor(Math.random() * countryCodes.length)];

  return {
    id: faker.string.uuid(),
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: hashPassword(process.env.AP_USER_PASSWORD),
    gender: genders[Math.floor(Math.random() * genders.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    role: roles[Math.floor(Math.random() * roles.length)],
    phoneNumber: generatePhoneNumber(randomCountry),
    provider: AUTH_PROVIDER.CREDENTIALS,
    authType: AUTH_TYPE.CREDENTIALS,
    country: countries[Math.floor(Math.random() * countries.length)].code,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  } as User;
}

const randomUsers = faker.helpers.multiple(createRandomUser, {
  count: 30,
});

export const userFactory = [...users, ...randomUsers];

export function generatePhoneNumber(countryCode: string) {
  let randomNumber: string;

  switch (countryCode) {
    case '91': // India
      randomNumber = faker.number.int({ min: 6000000000, max: 9999999999 }).toString();
      break;
    case '65': // Singapore
      randomNumber = faker.number.int({ min: 80000000, max: 99999999 }).toString();
      break;
    case '1': // US
      const validAreaCodes = [201, 202, 203, 212, 213, 305, 312, 415, 510, 617, 718, 805, 917];
      const validCentralOfficeCodes = [201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217];
      const areaCode = validAreaCodes[Math.floor(Math.random() * validAreaCodes.length)];
      const centralOfficeCode = validCentralOfficeCodes[Math.floor(Math.random() * validCentralOfficeCodes.length)];
      const lineNumber = faker.number.int({ min: 1000, max: 9999 });

      randomNumber = `${areaCode}${centralOfficeCode}${lineNumber}`;
      break;
    default:
      throw new Error('Unsupported country code');
  }

  return `+${countryCode}${randomNumber}`;
}
