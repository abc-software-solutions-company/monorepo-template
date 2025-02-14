/*
 * @Author: <Tin Tran> (tin.tran@abcdigital.io)
 * @Created: 2025-02-11 15:47:32
 */

export const IMAGE_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const S3_END_POINT = process.env.VITE_PUBLIC_AWS_S3_END_POINT;
const S3_BUCKET = process.env.VITE_PUBLIC_AWS_S3_BUCKET_NAME;

export const BASE_S3_MG_THUMBNAIL_URL = `${S3_END_POINT}/${S3_BUCKET}/thumbnails/`;
export const BASE_S3_IMG_URL = `${S3_END_POINT}/${S3_BUCKET}/`;
