import { Post } from '../entities/post.entity';

export const POST_GET_FIELDS = [
  [
    'post.id post.slug post.type post.status post.coverLocalized post.nameLocalized post.descriptionLocalized post.bodyLocalized post.seoMeta post.order post.externalUrl post.publishDate post.createdAt post.updatedAt',
  ],
  ['user.id user.name user.avatar'],
  ['category.id category.nameLocalized'],
  ['postFile.fileId postFile.position'],
  ['image.id image.uniqueName'],
]
  .flat()
  .flatMap(item => item.trim().split(/\s+/));

export const POST_FIELDS_TO_CREATE_OR_UPDATE = [
  'slug',
  'coverLocalized',
  'nameLocalized',
  'descriptionLocalized',
  'bodyLocalized',
  'type',
  'order',
  'publishDate',
  'externalUrl',
] as (keyof Post)[];

export enum POST_STATUS {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DELETED = 'deleted',
}

export enum POST_TYPE {
  NEWS = 'news',
  PAGE = 'page',
}
