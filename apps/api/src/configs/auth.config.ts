import { registerAs } from '@nestjs/config';

import { IConfigs } from '@/common/interfaces/configs.interface';

export default registerAs('auth', (): IConfigs['auth'] => {
  return {
    jwtSecretKey: process.env.JWT_SECRET_KEY,
    jwtExpiresIn: process.env.JWT_EXPIRES_IN,
    jwtRefreshSecretKey: process.env.JWT_REFRESH_SECRET_KEY,
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN,
    facebookClientId: process.env.OAUTH_FACEBOOK_CLIENT_ID,
    facebookClientSecret: process.env.OAUTH_FACEBOOK_CLIENT_SECRET,
    googleClientId: process.env.OAUTH_GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET,
  };
});
