export const POST_GET_FIELDS = [
  [
    'post.id post.slug post.type post.status post.coverLocalized post.nameLocalized post.descriptionLocalized post.bodyLocalized post.seoMeta post.createdAt',
  ],
  ['user.id user.name user.email'],
  ['category.id category.nameLocalized'],
  ['postFile.fileId postFile.position'],
  ['image.id image.uniqueName'],
]
  .flat()
  .flatMap(item => item.trim().split(/\s+/));

export const POST_FIELDS_TO_CREATE_OR_UPDATE = ['type', 'slug', 'coverLocalized', 'nameLocalized', 'descriptionLocalized', 'bodyLocalized'];

export enum POST_STATUS {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DELETED = 'deleted',
}

export enum POST_TYPE {
  DEFAULT = 'default',
  PAGE = 'page',
  RECRUIT = 'recruit',
  PROMOTION = 'promotion',
  SERVICE = 'service',
}
