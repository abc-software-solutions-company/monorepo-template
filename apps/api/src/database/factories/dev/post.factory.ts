import { faker } from '@faker-js/faker';

import { toSlug } from '@/common/utils/string.util';

import { POST_STATUS, POST_TYPE } from '@/modules/posts/constants/posts.constant';
import { Post } from '@/modules/posts/entities/post.entity';

import { categoryFactory } from './category.factory';

import { userFactory } from '../user.factory';

const statuses = Object.values(POST_STATUS).filter(x => x !== POST_STATUS.DELETED);
const defaultLanguage = process.env.AP_LANG_CODE ?? 'en-us';

export function createRandomPost() {
  const name = faker.lorem.words(10);
  const description = `<p>${faker.lorem.words(20)}</p>`;
  const body = `<p>${faker.lorem.words(50)}</p>`;

  return {
    id: faker.string.uuid(),
    slug: toSlug(name),
    type: POST_TYPE.NEWS,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    coverLocalized: null,
    nameLocalized: [{ lang: defaultLanguage, value: name }],
    descriptionLocalized: [{ lang: defaultLanguage, value: description }],
    bodyLocalized: [{ lang: defaultLanguage, value: body }],
    category: categoryFactory[[2, 3][Math.floor(Math.random() * 2)]],
    creator: userFactory[0],
    createdAt: faker.date.past(),
  } as Post;
}

export const postFactory = [
  ...faker.helpers.multiple(createRandomPost, { count: 30 }),
  {
    id: '3cdc7d47-9afe-40cc-8aa4-4bfa3f311d7c',
    slug: 'privacy-policy',
    nameLocalized: [{ lang: defaultLanguage, value: 'Privacy Policy' }],
    descriptionLocalized: [{ lang: defaultLanguage, value: '<p>Privacy Policy</p>' }],
    bodyLocalized: [
      {
        lang: defaultLanguage,
        value: `
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam gravida suscipit odio id suscipit. Nam ornare cursus erat id dictum. Sed commodo a dui vitae placerat. Ut fringilla mi a malesuada placerat. Sed faucibus est a congue vestibulum. Phasellus diam elit, tempor ut lectus nec, condimentum luctus augue. Maecenas hendrerit lacus et ullamcorper rhoncus. Nam et tristique felis. Pellentesque eros odio, iaculis id laoreet non, pretium et sapien. Donec tempor lectus turpis, gravida posuere arcu pharetra at. Sed at faucibus lacus.</p>
          <p>Donec dolor ante, ornare nec venenatis id, pulvinar in nisl. Etiam tempor dolor vel lectus ornare blandit. Sed rutrum varius arcu, et ultricies nulla auctor at. Praesent dignissim ipsum neque, nec aliquet ligula interdum id. Sed nec dui tortor. Aenean ultrices turpis varius, accumsan tellus sed, auctor massa. Morbi euismod lorem scelerisque, scelerisque dui non, fringilla augue. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Cras sagittis laoreet leo et vulputate. Praesent et nisl at risus tempus gravida. Praesent non tempus dolor. Proin a urna in sem maximus mollis. Suspendisse potenti.</p>
          <p>Ut id fringilla nibh. Proin venenatis venenatis dignissim. Duis at pulvinar quam. Mauris consectetur, odio quis convallis vehicula, sem mauris tincidunt lacus, sit amet mattis odio lorem ut urna. Curabitur posuere nisi et ligula lobortis fringilla. Vestibulum ac odio vestibulum, suscipit ipsum non, lacinia turpis. Fusce imperdiet lobortis sagittis. Morbi vestibulum aliquet turpis luctus aliquam. Proin ut ante ex. Nunc euismod leo quam, nec faucibus diam ultrices vel. Fusce eleifend massa et neque egestas rhoncus. Phasellus sed tincidunt sem, at consectetur ante. Suspendisse venenatis risus sed fringilla iaculis. Curabitur elit orci, varius ac odio ac, laoreet tempor sapien. Aenean consectetur nec ipsum a sollicitudin.</p>
          <p>Nunc velit neque, commodo lacinia lacinia vestibulum, porta consectetur ligula. In consectetur venenatis magna id dictum. Mauris eu libero eu erat tincidunt lobortis id vitae ligula. Morbi in sollicitudin enim. Curabitur iaculis tristique lobortis. Donec in iaculis lectus. Morbi eget magna lacinia mi dictum dignissim. Nulla facilisi.</p>
          <p>Pellentesque tortor erat, ultricies nec ipsum et, tincidunt tincidunt ante. Interdum et malesuada fames ac ante ipsum primis in faucibus. Nam nibh mi, condimentum et neque a, elementum ultrices enim. Phasellus convallis mauris purus. Pellentesque pulvinar arcu tortor, id rutrum magna consectetur in. Pellentesque et dui ullamcorper, sagittis justo non, sollicitudin neque. Integer sed interdum odio. Proin et varius leo, ut fringilla nibh. Suspendisse gravida odio eu varius accumsan. Pellentesque nisi ante, commodo non purus at, consectetur semper sem. Curabitur volutpat lorem lacinia magna efficitur aliquet. Etiam eu magna id dolor pellentesque facilisis. In venenatis sapien quis blandit pharetra.</p>
        `,
      },
    ],
    status: POST_STATUS.PUBLISHED,
    type: POST_TYPE.PAGE,
    creator: userFactory[0],
    createdAt: faker.date.recent(),
  },
  {
    id: 'd8122653-9206-47db-9c42-7afa8433c986',
    slug: 'terms-and-conditions',
    nameLocalized: [{ lang: defaultLanguage, value: 'Terms and Conditions' }],
    descriptionLocalized: [{ lang: defaultLanguage, value: '<p>Terms and Conditions</p>' }],
    bodyLocalized: [
      {
        lang: defaultLanguage,
        value: `
          <p>Integer eget suscipit metus. Cras et elementum augue, a cursus velit. Morbi vitae magna commodo, vulputate ligula vitae, egestas nunc. Proin non placerat risus. Etiam gravida eget ipsum a dapibus. Ut nec porta nisi. Vivamus dui augue, mollis ac tempor quis, auctor ut metus. Donec dolor mauris, interdum vitae lobortis sit amet, pharetra vitae nulla.</p>
          <p>Duis pharetra tortor eu mauris rhoncus lobortis ac nec est. Suspendisse potenti. Integer dapibus odio id urna porttitor, eget dignissim dui efficitur. Maecenas mattis, metus non suscipit malesuada, dui lacus maximus lacus, eget ultricies mi dolor sit amet dui. Nunc lacinia tellus id congue pretium. Suspendisse nisl sapien, mollis quis erat ut, vulputate bibendum lacus. Etiam maximus, risus a rhoncus pharetra, ligula mi tincidunt nisi, a suscipit tortor diam ut erat. Suspendisse vulputate ipsum in rhoncus malesuada. Nulla a mauris in massa rhoncus lacinia. Mauris posuere congue commodo. Nunc ut ex sed elit sollicitudin fringilla nec quis sapien. Sed et commodo nisl, nec pellentesque enim. Etiam hendrerit magna at ipsum convallis, non semper sem aliquam. Nunc ut convallis est, vitae hendrerit ex.</p>
          <p>Mauris congue eleifend nibh eu pharetra. Nam feugiat in risus in auctor. Sed id massa lacinia, pretium turpis ac, posuere erat. Proin quis nulla aliquet, sollicitudin justo et, maximus ligula. Sed at elementum ligula. Etiam vitae massa condimentum, accumsan odio eget, condimentum diam. Proin congue metus aliquet, luctus diam eu, hendrerit diam. Integer placerat ut leo aliquam ornare. Vivamus aliquet semper tortor, quis vestibulum nunc euismod in. Aenean laoreet egestas urna ut tincidunt.</p>
          <p>Ut varius porta metus et vulputate. Morbi a arcu orci. Duis lacinia varius nisi sit amet eleifend. In nec convallis ante. In eu congue justo. Sed vel dolor lacus. Cras a ipsum risus. Vestibulum cursus magna sed laoreet varius. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
          <p>Phasellus in malesuada arcu. Cras condimentum mattis libero a lacinia. Donec ex nisi, gravida et fermentum vitae, cursus id risus. Nullam mattis velit facilisis mattis congue. Nunc porttitor aliquam vehicula. Nunc lobortis fringilla ex fringilla consequat. Nullam sed aliquam erat. Vestibulum pellentesque massa ipsum, et rutrum quam mollis sed. Suspendisse aliquam lacus massa, in tincidunt nisl accumsan ac. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce quis bibendum nulla.</p>
          <p>Integer in pretium urna, ac molestie dolor. Integer egestas quis arcu et mollis. Duis volutpat, augue non blandit convallis, diam nunc rutrum orci, non gravida magna magna in odio. Donec vitae augue urna. Aenean ornare risus mauris, vel vehicula sapien aliquet ut. Sed dui risus, mattis sed ornare molestie, hendrerit dignissim ante. Sed hendrerit interdum ipsum, vel porta justo. Integer porta ullamcorper lobortis.</p>
          <p>Duis suscipit blandit leo. Aliquam ultricies risus tempus libero mollis fermentum. Suspendisse non viverra orci. Aliquam varius enim id faucibus laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Proin vel elit vitae massa bibendum ultricies. Etiam lacinia augue lacus, quis mollis elit placerat sit amet. Pellentesque malesuada rutrum tortor. Ut mauris orci, facilisis eu arcu id, volutpat maximus urna.</p>
        `,
      },
    ],
    status: POST_STATUS.PUBLISHED,
    type: POST_TYPE.PAGE,
    creator: userFactory[0],
    createdAt: faker.date.recent(),
  },
  {
    id: '6cefe7a6-af7a-4622-bda3-168bd16f3aa2',
    slug: 'about-us',
    nameLocalized: [{ lang: defaultLanguage, value: 'About Us' }],
    descriptionLocalized: [{ lang: defaultLanguage, value: '<p>About Us</p>' }],
    bodyLocalized: [
      {
        lang: defaultLanguage,
        value: `
          <p>Integer eget suscipit metus. Cras et elementum augue, a cursus velit. Morbi vitae magna commodo, vulputate ligula vitae, egestas nunc. Proin non placerat risus. Etiam gravida eget ipsum a dapibus. Ut nec porta nisi. Vivamus dui augue, mollis ac tempor quis, auctor ut metus. Donec dolor mauris, interdum vitae lobortis sit amet, pharetra vitae nulla.</p>
          <p>Duis pharetra tortor eu mauris rhoncus lobortis ac nec est. Suspendisse potenti. Integer dapibus odio id urna porttitor, eget dignissim dui efficitur. Maecenas mattis, metus non suscipit malesuada, dui lacus maximus lacus, eget ultricies mi dolor sit amet dui. Nunc lacinia tellus id congue pretium. Suspendisse nisl sapien, mollis quis erat ut, vulputate bibendum lacus. Etiam maximus, risus a rhoncus pharetra, ligula mi tincidunt nisi, a suscipit tortor diam ut erat. Suspendisse vulputate ipsum in rhoncus malesuada. Nulla a mauris in massa rhoncus lacinia. Mauris posuere congue commodo. Nunc ut ex sed elit sollicitudin fringilla nec quis sapien. Sed et commodo nisl, nec pellentesque enim. Etiam hendrerit magna at ipsum convallis, non semper sem aliquam. Nunc ut convallis est, vitae hendrerit ex.</p>
          <p>Mauris congue eleifend nibh eu pharetra. Nam feugiat in risus in auctor. Sed id massa lacinia, pretium turpis ac, posuere erat. Proin quis nulla aliquet, sollicitudin justo et, maximus ligula. Sed at elementum ligula. Etiam vitae massa condimentum, accumsan odio eget, condimentum diam. Proin congue metus aliquet, luctus diam eu, hendrerit diam. Integer placerat ut leo aliquam ornare. Vivamus aliquet semper tortor, quis vestibulum nunc euismod in. Aenean laoreet egestas urna ut tincidunt.</p>
          <p>Ut varius porta metus et vulputate. Morbi a arcu orci. Duis lacinia varius nisi sit amet eleifend. In nec convallis ante. In eu congue justo. Sed vel dolor lacus. Cras a ipsum risus. Vestibulum cursus magna sed laoreet varius. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas.</p>
          <p>Phasellus in malesuada arcu. Cras condimentum mattis libero a lacinia. Donec ex nisi, gravida et fermentum vitae, cursus id risus. Nullam mattis velit facilisis mattis congue. Nunc porttitor aliquam vehicula. Nunc lobortis fringilla ex fringilla consequat. Nullam sed aliquam erat. Vestibulum pellentesque massa ipsum, et rutrum quam mollis sed. Suspendisse aliquam lacus massa, in tincidunt nisl accumsan ac. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Fusce quis bibendum nulla.</p>
          <p>Integer in pretium urna, ac molestie dolor. Integer egestas quis arcu et mollis. Duis volutpat, augue non blandit convallis, diam nunc rutrum orci, non gravida magna magna in odio. Donec vitae augue urna. Aenean ornare risus mauris, vel vehicula sapien aliquet ut. Sed dui risus, mattis sed ornare molestie, hendrerit dignissim ante. Sed hendrerit interdum ipsum, vel porta justo. Integer porta ullamcorper lobortis.</p>
          <p>Duis suscipit blandit leo. Aliquam ultricies risus tempus libero mollis fermentum. Suspendisse non viverra orci. Aliquam varius enim id faucibus laoreet. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Proin vel elit vitae massa bibendum ultricies. Etiam lacinia augue lacus, quis mollis elit placerat sit amet. Pellentesque malesuada rutrum tortor. Ut mauris orci, facilisis eu arcu id, volutpat maximus urna.</p>
        `,
      },
    ],
    status: POST_STATUS.PUBLISHED,
    type: POST_TYPE.PAGE,
    creator: userFactory[0],
    createdAt: faker.date.recent(),
  },
];
