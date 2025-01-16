export const FAQ_GET_FIELDS = [['faq.id faq.title faq.content faq.status faq.createdAt faq.updatedAt faq.contentLocalized faq.titleLocalized']]
  .flat()
  .flatMap(item => item.trim().split(/\s+/));

export const FAQ_FIELDS_TO_CREATE_OR_UPDATE = ['title', 'content'] as const;

export enum FAQ_STATUS {
  PUBLISHED = 'published',
  DRAFT = 'draft',
  DELETED = 'deleted',
}
