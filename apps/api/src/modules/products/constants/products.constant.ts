export const PRODUCT_GET_FIELDS = [
  ['product.id product.name product.slug product.description product.body product.status product.cover product.createdAt'],
  ['user.id user.name user.email'],
  ['category.id category.name'],
  ['productFile.fileId productFile.position'],
  ['image.id image.uniqueName'],
]
  .flat()
  .flatMap(item => item.trim().split(/\s+/));

export const PRODUCT_FIELDS_TO_CREATE_OR_UPDATE = ['name', 'slug', 'description', 'body', 'cover'] as const;

export enum PRODUCT_STATUS {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DELETED = 'deleted',
}
