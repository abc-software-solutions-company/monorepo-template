export const CATEGORY_GET_FIELDS = [
  [
    'category.id category.name category.slug category.description category.body category.type category.parent category.status category.cover category.seoMeta category.createdAt category.nameLocalized category.descriptionLocalized category.bodyLocalized category.coverLocalized',
  ],
  ['user.id user.name user.email'],
  ['parent.id parent.name'],
  ['categoryFile.fileId categoryFile.position'],
  ['image.id image.uniqueName'],
  [],
]
  .flat()
  .flatMap(item => item.trim().split(/\s+/));

export const CATEGORY_FIELDS_TO_CREATE_OR_UPDATE = ['name', 'slug', 'description', 'body', 'cover'] as const;

export enum CATEGORY_STATUS {
  VISIBLED = 'visibled',
  DELETED = 'deleted',
}

export enum CATEGORY_TYPE {
  FILE = 'file',
  PRODUCT = 'product',
  POST = 'post',
}
