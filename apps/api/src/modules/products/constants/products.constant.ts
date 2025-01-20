export const PRODUCT_GET_FIELDS = [
  [
    'product.id product.slug product.type product.status product.coverLocalized product.nameLocalized product.descriptionLocalized product.bodyLocalized product.seoMeta product.createdAt',
  ],
  ['user.id user.name user.email'],
  ['category.id category.nameLocalized'],
  ['productFile.fileId productFile.position'],
  ['image.id image.uniqueName'],
]
  .flat()
  .flatMap(item => item.trim().split(/\s+/));

export const PRODUCT_FIELDS_TO_CREATE_OR_UPDATE = ['slug', 'type', 'coverLocalized', 'nameLocalized', 'descriptionLocalized', 'bodyLocalized'];

export enum PRODUCT_STATUS {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DELETED = 'deleted',
}

export enum PRODUCT_TYPE {
  DEFAULT = 'default',
}
