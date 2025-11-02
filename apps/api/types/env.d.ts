declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    // APP
    HOST: string;
    PORT: string;
    LANG_CODE: string;
    // HTTP
    REQUEST_TIMEOUT: string;
    // RATE LIMIT
    THROTTLE_TTL: string;
    THROTTLE_LIMIT: string;
    // CACHE
    CACHE_TIME_TO_LIVE: string;
    // AUTH
    JWT_SECRET_KEY: string;
    JWT_EXPIRES_IN: string;
    JWT_REFRESH_SECRET_KEY: string;
    JWT_REFRESH_EXPIRES_IN: string;
    OAUTH_FACEBOOK_CLIENT_ID: string;
    OAUTH_FACEBOOK_CLIENT_SECRET: string;
    OAUTH_GOOGLE_CLIENT_ID: string;
    OAUTH_GOOGLE_CLIENT_SECRET: string;
    // DOCUMENTATION
    DOCUMENTATION_ENABLED: string;
    // DEFAULT USER
    ADMIN_USER_EMAIL: string;
    ADMIN_USER_PASSWORD: string;
    // EMAIL
    EMAIL_HOST: string;
    EMAIL_PORT: string;
    EMAIL_SECURE: string;
    EMAIL_USERNAME: string;
    EMAIL_PASSWORD: string;
    // DATABASE
    AP_DB_SSL: string;
    AP_DB_HOST: string;
    AP_DB_PORT: string;
    AP_DB_NAME: string;
    AP_DB_USERNAME: string;
    AP_DB_PASSWORD: string;
    DB_SCHEMA: string;
    AP_DB_LOGS: string;
    // REDIS
    REDIS_HOST: string;
    REDIS_PORT: string;
    // ALLOW ORIGIN
    ALLOW_WEB_APP_ORIGIN: string;
    ALLOW_ADMIN_PORTAL_ORIGIN: string;
    // AWS
    AWS_ENDPOINT: string;
    AWS_REGION: string;
    AWS_ACCESS_KEY_ID: string;
    AWS_SECRET_ACCESS_KEY: string;
    // S3
    AWS_S3_BUCKET_NAME: string;
    AP_AWS_S3_BASE_URL: string;
    // FIREBASE
    FIREBASE_CONFIG: string;
  }
}
