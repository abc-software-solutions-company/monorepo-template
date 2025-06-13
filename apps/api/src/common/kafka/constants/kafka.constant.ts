export const KAFKA_TOPICS = {
    SYSTEM: {
        HEALTH_CHECK: 'monorepo-admin.health_check'
    },
    POSTS: {
      GET: 'monorepo-admin.posts.get',
      GET_BY_SLUG: 'monorepo-admin.posts.get-by-slug',
      ADMIN: {
        CREATE: 'monorepo-admin.posts.admin.create',
        UPDATE: 'monorepo-admin.posts.admin.update',
        DELETE: 'monorepo-admin.posts.admin.delete',
        BULK_DELETE: 'monorepo-admin.posts.admin.bulk-delete',
      },
    },
    CATEGORIES: {
        CREATE: 'monorepo-admin.categories.admin.create',
        GET: 'monorepo-admin.categories.admin.get',
        GET_BY_ID: 'monorepo-admin.categories.admin.get-by-id',
        UPDATE: 'monorepo-admin.categories.admin.update',
        DELETE: 'monorepo-admin.categories.admin.delete',
        BULK_DELETE: 'monorepo-admin.categories.admin.bulk-delete',
    },
    PRODUCTS: {
        CREATE: 'monorepo-admin.products.admin.create',
        GET: 'monorepo-admin.products.admin.get',
        GET_BY_ID: 'monorepo-admin.products.admin.get-by-id',
        UPDATE: 'monorepo-admin.products.admin.update',
        DELETE: 'monorepo-admin.products.admin.delete',
        BULK_DELETE: 'monorepo-admin.products.admin.bulk-delete',
    },
  };