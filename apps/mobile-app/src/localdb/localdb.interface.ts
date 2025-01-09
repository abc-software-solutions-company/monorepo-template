export type LocalDbSyncData = {
  posts: WMPostEntity[];
};

export type WMPostEntity = {
  [key: string]: unknown;
  id: string;
  title?: string;
  body?: string;
  tags: string[];
  seo?: WMPostSeoData;
};

export type WMPostSeoData = {
  keywords?: string[];
  title?: string;
  description?: string;
};
