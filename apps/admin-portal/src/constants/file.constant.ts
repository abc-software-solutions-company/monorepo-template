const S3_ENDPOINT = import.meta.env.VITE_PUBLIC_AWS_S3_END_POINT;
const S3_BUCKET_NAME = import.meta.env.VITE_PUBLIC_AWS_S3_BUCKET_NAME;

export const IMAGE_BASE_URL = S3_ENDPOINT + '/' + S3_BUCKET_NAME || 'http://localhost:3000';
