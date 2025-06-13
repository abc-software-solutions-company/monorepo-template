export const KAFKA_TOPICS = {
    POSTS: {
      GET: 'monorepo-admin.posts.get',
      GET_BY_SLUG: 'monorepo-admin.posts.get-by-slug',
      ADMIN: {
        CREATE: 'monorepo-admin.posts.admin.create',
        GET: 'monorepo-admin.posts.admin.get',
        GET_BY_ID: 'monorepo-admin.posts.admin.get-by-id',
        UPDATE: 'monorepo-admin.posts.admin.update',
        DELETE: 'monorepo-admin.posts.admin.delete',
        BULK_DELETE: 'monorepo-admin.posts.admin.bulk-delete',
      },
    },
    CATEGORIES: {
      GET: 'monorepo-admin.categories.get',
      GET_BY_ID: 'monorepo-admin.categories.get-by-id',
      GET_BY_PARENT_ID: 'monorepo-admin.categories.get-by-parent-id',
      GET_BY_TYPE: 'monorepo-admin.categories.get-by-type',
      GET_BY_SLUG: 'monorepo-admin.categories.get-by-slug',
      ADMIN: {
        CREATE: 'monorepo-admin.categories.admin.create',
        GET: 'monorepo-admin.categories.admin.get',
        GET_BY_ID: 'monorepo-admin.categories.admin.get-by-id',
        UPDATE: 'monorepo-admin.categories.admin.update',
        DELETE: 'monorepo-admin.categories.admin.delete',
        BULK_DELETE: 'monorepo-admin.categories.admin.bulk-delete',
      },
    },
    PRODUCTS: {
      GET: 'monorepo-admin.products.get',
      GET_BY_SLUG: 'monorepo-admin.products.get-by-slug',
      ADMIN: {
        CREATE: 'monorepo-admin.products.admin.create',
        GET: 'monorepo-admin.products.admin.get',
        GET_BY_ID: 'monorepo-admin.products.admin.get-by-id',
        UPDATE: 'monorepo-admin.products.admin.update',
        DELETE: 'monorepo-admin.products.admin.delete',
        BULK_DELETE: 'monorepo-admin.products.admin.bulk-delete',
      },
    },
  };