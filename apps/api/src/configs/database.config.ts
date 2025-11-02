import { registerAs } from '@nestjs/config';

import { IConfigs } from '@/common/interfaces/configs.interface';

export default registerAs('database', (): IConfigs['database'] => ({
  url: process.env.DB_URL,
  schema: process.env.DB_SCHEMA || 'public',
  isLoggingEnable: process.env.AP_DB_LOGS === 'true',
}));
