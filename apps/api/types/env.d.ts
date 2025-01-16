declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: string;
    // APP
    AP_HOST: string;
    AP_PORT: string;
    AP_LANG_CODE: string;
    AP_URL: string;
    AP_FILE_PROVIDER: string;
    // HTTP
    AP_REQUEST_TIMEOUT: string;
    // RATE LIMIT
    AP_THROTTLE_TTL: string;
    AP_THROTTLE_LIMIT: string;
    // CACHE
    AP_CACHE_TIME_TO_LIVE: string;
    // AUTH
    AP_JWT_SECRET_KEY: string;
    AP_JWT_EXPIRES_IN: string;
    AP_JWT_REFRESH_SECRET_KEY: string;
    AP_JWT_REFRESH_EXPIRES_IN: string;
    AP_OAUTH_FACEBOOK_CLIENT_ID: string;
    AP_OAUTH_FACEBOOK_CLIENT_SECRET: string;
    AP_OAUTH_GOOGLE_CLIENT_ID: string;
    AP_OAUTH_GOOGLE_CLIENT_SECRET: string;
    // DOCUMENTATION
    AP_DOCUMENTATION_ENABLED: string;
    // DEFAULT USER
    AP_USER_EMAIL: string;
    AP_USER_PASSWORD: string;
    // EMAIL
    AP_EMAIL_HOST: string;
    AP_EMAIL_PORT: string;
    AP_EMAIL_SECURE: string;
    AP_EMAIL_USERNAME: string;
    AP_EMAIL_PASSWORD: string;
    // DATABASE
    AP_DB_SSL: string;
    AP_DB_HOST: string;
    AP_DB_PORT: string;
    AP_DB_NAME: string;
    AP_DB_USERNAME: string;
    AP_DB_PASSWORD: string;
    AP_DB_SCHEMA: string;
    AP_DB_LOGS: string;
    // REDIS
    AP_REDIS_HOST: string;
    AP_REDIS_PORT: string;
    // ALLOW ORIGIN
    AP_ALLOW_WEB_APP_ORIGIN: string;
    AP_ALLOW_ADMIN_PORTAL_ORIGIN: string;
    // FIREBASE
    AP_FIREBASE_CONFIG: string;
  }
}
