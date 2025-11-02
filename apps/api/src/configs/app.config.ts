import { registerAs } from '@nestjs/config';

import { IConfigs } from '@/common/interfaces/configs.interface';

export default registerAs('app', (): IConfigs['app'] => ({
  host: process.env.HOST,
  port: parseInt(process.env.PORT) || 3500,
  isDocumentationEnabled: process.env.DOCUMENTATION_ENABLED === 'true',
  appEnv: process.env.APP_ENV || 'development',
}));
