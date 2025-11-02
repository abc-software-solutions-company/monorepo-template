import { registerAs } from '@nestjs/config';

import { IConfigs } from '@/common/interfaces/configs.interface';

export default registerAs('email', (): IConfigs['email'] => ({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  username: process.env.EMAIL_USERNAME,
  password: process.env.EMAIL_PASSWORD,
}));
