export const CONTENT_GET_FIELDS = [
  [
    'content.id content.name content.slug content.description content.body content.status content.type content.seoMeta content.createdAt content.updatedAt',
  ],
]
  .flat()
  .flatMap(item => item.trim().split(/\s+/));

export const CONTENT_FIELDS_TO_CREATE_OR_UPDATE = ['name', 'slug', 'description', 'body', 'type'] as const;

export enum CONTENT_STATUS {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DELETED = 'deleted',
}

export enum CONTENT_TYPE {
  UNCATEGORIZED = 'uncategorized',
}
