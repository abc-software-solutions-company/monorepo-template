export const POST_GET_FIELDS = [
  [
    'post.id post.name post.nameLocalized post.slug post.description post.descriptionLocalized post.body post.bodyLocalized post.status post.cover post.seoMeta post.createdAt',
  ],
  ['user.id user.name user.email'],
  ['category.id category.name'],
  ['postFile.fileId postFile.position'],
  ['image.id image.uniqueName'],
]
  .flat()
  .flatMap(item => item.trim().split(/\s+/));

export const POST_FIELDS_TO_CREATE_OR_UPDATE = [
  'name',
  'slug',
  'description',
  'body',
  'cover',
  'nameLocalized',
  'descriptionLocalized',
  'bodyLocalized',
];

export enum POST_STATUS {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DELETED = 'deleted',
}
