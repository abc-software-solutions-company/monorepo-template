import { Category } from '../entities/category.entity';

export const CATEGORY_GET_FIELDS = [
  [
    'category.id category.slug category.type category.status category.parent category.coverLocalized category.nameLocalized category.descriptionLocalized category.bodyLocalized category.seoMeta category.externalUrl category.publishDate category.createdAt category.updatedAt',
  ],
  ['user.id user.name user.avatar'],
  ['parent.id parent.nameLocalized'],
  ['categoryFile.fileId categoryFile.position'],
  ['image.id image.uniqueName'],
]
  .flat()
  .flatMap(item => item.trim().split(/\s+/));

export const CATEGORY_FIELDS_TO_CREATE_OR_UPDATE = [
  'slug',
  'coverLocalized',
  'nameLocalized',
  'descriptionLocalized',
  'bodyLocalized',
  'publishDate',
  'externalUrl',
] as (keyof Category)[];

export enum CATEGORY_STATUS {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DELETED = 'deleted',
}

export enum CATEGORY_TYPE {
  NEWS = 'news',
  PAGE = 'page',
  PRODUCT = 'product',
}
