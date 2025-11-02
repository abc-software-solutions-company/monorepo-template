import { registerAs } from '@nestjs/config';

import { IConfigs } from '@/common/interfaces/configs.interface';

export default registerAs('aws', (): IConfigs['aws'] => ({
  region: process.env.AP_AWS_REGION,
  endPoint: process.env.AP_AWS_ENDPOINT,
  credentials: {
    accessKeyId: process.env.AP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AP_AWS_SECRET_ACCESS_KEY,
  },
  s3: {
    bucketName: process.env.AP_AWS_S3_BUCKET_NAME,
    baseUrl: `${process.env.AP_AWS_ENDPOINT}/${process.env.AP_AWS_S3_BUCKET_NAME}`,
  },
}));
