export const POST_GET_FIELDS = [
  ['post.id post.name post.slug post.description post.body post.status post.cover post.createdAt'],
  ['user.id user.name user.email'],
  ['category.id category.name'],
  ['postFile.fileId postFile.position'],
  ['image.id image.uniqueName'],
]
  .flat()
  .flatMap(item => item.trim().split(/\s+/));

export const POST_FIELDS_TO_CREATE_OR_UPDATE = ['name', 'slug', 'description', 'body', 'cover'] as const;

export enum POST_STATUS {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DELETED = 'deleted',
}
