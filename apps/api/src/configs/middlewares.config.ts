import { registerAs } from '@nestjs/config';

import { IConfigs } from '@/common/interfaces/configs.interface';

export default registerAs('middlewares', (): IConfigs['middlewares'] => {
  return {
    cors: {
      allowOrigin: [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3002',
        'http://localhost:3003',
        'http://localhost:3004',
        'http://localhost:3005',
        'http://localhost:5173',
        'http://localhost:5174',
        process.env.AP_ALLOW_WEB_APP_ORIGIN,
        process.env.AP_ALLOW_ADMIN_PORTAL_ORIGIN,
      ],
      allowMethods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      allowHeaders: [
        'Accept',
        'Accept-Language',
        'Content-Language',
        'Content-Type',
        'Origin',
        'Authorization',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Methods',
        'Access-Control-Allow-Credentials',
        'Access-Control-Expose-Headers',
        'Access-Control-Max-Age',
        'Referer',
        'Host',
        'Set-Cookie',
        'X-Requested-With',
        'X-Requested-Id',
        'X-Response-Time',
        'refreshToken',
        'user-agent',
        'cache-control',
        'expires',
        'pragma',
      ],
    },
    rateLimit: {
      timeToLive: parseInt(process.env.AP_THROTTLE_TTL) || 60,
      limit: parseInt(process.env.AP_THROTTLE_LIMIT) || 10,
    },
  };
});
