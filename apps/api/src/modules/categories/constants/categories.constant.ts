export const CATEGORY_GET_FIELDS = [
  [
    'category.id category.slug category.type category.status category.parent category.coverLocalized category.nameLocalized category.descriptionLocalized category.bodyLocalized category.seoMeta category.createdAt',
  ],
  ['user.id user.name user.email'],
  ['parent.id parent.nameLocalized'],
  ['categoryFile.fileId categoryFile.position'],
  ['image.id image.uniqueName'],
]
  .flat()
  .flatMap(item => item.trim().split(/\s+/));

export const CATEGORY_FIELDS_TO_CREATE_OR_UPDATE = ['slug', 'coverLocalized', 'nameLocalized', 'descriptionLocalized', 'bodyLocalized'];

export enum CATEGORY_STATUS {
  VISIBLED = 'visibled',
  DELETED = 'deleted',
}

export enum CATEGORY_TYPE {
  DEFAULT = 'default',
  FILE = 'file',
  PRODUCT = 'product',
  POST = 'post',
}
