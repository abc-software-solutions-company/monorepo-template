const S3_ENDPOINT = import.meta.env.VITE_PUBLIC_AWS_S3_END_POINT;
const S3_BUCKET_NAME = import.meta.env.VITE_PUBLIC_AWS_S3_BUCKET_NAME;

export const IMAGE_BASE_URL = S3_ENDPOINT + '/' + S3_BUCKET_NAME + '/';
export const IMAGE_THUMBNAIL_URL = IMAGE_BASE_URL + '/thumbnails/';
export const IMAGE_AVATAR_URL = IMAGE_BASE_URL + '/avatars/';
