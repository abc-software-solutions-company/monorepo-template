import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';

import { IConfigs } from '@/common/interfaces/configs.interface';

type JwtRefreshDecodedPayload = {
  id: string;
  email: string;
  iat: number;
  exp: number;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(configService: ConfigService<IConfigs>) {
    const { jwtRefreshSecretKey } = configService.get<IConfigs['auth']>('auth');

    super({
      ignoreExpiration: false,
      passReqToCallback: true,
      secretOrKey: jwtRefreshSecretKey,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const refreshToken = request?.cookies?.refreshToken;

          if (!refreshToken) {
            return null;
          }

          return refreshToken;
        },
      ]),
    });
  }

  async validate(payload: JwtRefreshDecodedPayload) {
    const isTokenExpired = payload.exp < Date.now() / 1000;

    if (isTokenExpired) throw new BadRequestException('Token expired');

    return payload;
  }
}
