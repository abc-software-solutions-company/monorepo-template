import { registerAs } from '@nestjs/config';

import { IConfigs } from '@/common/interfaces/configs.interface';

export default registerAs('aws', (): IConfigs['aws'] => ({
  region: process.env.AWS_REGION,
  endPoint: process.env.AWS_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  s3: {
    bucketName: process.env.AWS_S3_BUCKET_NAME,
    baseUrl: `${process.env.AWS_ENDPOINT}/${process.env.AWS_S3_BUCKET_NAME}`,
  },
}));
