/// <reference types="vite/client" />

// eslint-disable-next-line @typescript-eslint/naming-convention
interface ImportMetaEnv {
  readonly VITE_PUBLIC_API_URL: string;
  readonly VITE_PUBLIC_SITE_URL: string;
  readonly VITE_PUBLIC_MESSENGER_PAGE_ID: string;
  readonly VITE_PUBLIC_GOOGLE_TRACKING: string;
  readonly VITE_PUBLIC_SEGMENT_TRACKING: string;
  readonly VITE_PUBLIC_AWS_S3_END_POINT: string;
  readonly VITE_PUBLIC_AWS_S3_BUCKET_NAME: string;
  readonly VITE_PUBLIC_APP_ENV: string; // 'development' | 'staging' | 'production';
}

// eslint-disable-next-line @typescript-eslint/naming-convention
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
