import { registerAs } from '@nestjs/config';

import { IConfigs } from '@/common/interfaces/configs.interface';

export default registerAs('database', (): IConfigs['database'] => ({
  url: process.env.AP_DB_URL,
  schema: process.env.AP_DB_SCHEMA || 'public',
  isLoggingEnable: process.env.AP_DB_LOGS === 'true',
}));
