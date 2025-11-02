import { registerAs } from '@nestjs/config';

import { IConfigs } from '@/common/interfaces/configs.interface';

export default registerAs('cache', (): IConfigs['cache'] => ({
  timeToLive: parseInt(process.env.CACHE_TIME_TO_LIVE) || 900,
}));
