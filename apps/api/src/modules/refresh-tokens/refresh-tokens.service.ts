import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityRepository, EntityManager } from '@mikro-orm/postgresql';

import { CreateRefreshTokenDto } from './dto/create-refresh-token.dto';
import { RefreshToken } from './entities/refresh-token.entity';

import { TokenService } from '../shared/token.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class RefreshTokensService {
  constructor(
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepository: EntityRepository<RefreshToken>,
    private readonly userService: UsersService,
    private readonly tokenService: TokenService,
    private readonly em: EntityManager
  ) {}

  create(createDto: CreateRefreshTokenDto) {
    const refreshToken = this.refreshTokenRepository.create(createDto);

    return this.em.persistAndFlush(refreshToken);
  }

  async findByToken(token: string, ipAddress: string, _userAgent: string) {
    const refreshToken = await this.refreshTokenRepository.findOne({ token, createdByIp: ipAddress });

    if (!refreshToken) {
      throw new NotFoundException('Refresh token not found');
    }

    return refreshToken;
  }

  async refresh(userId: string, token: string, ipAddress: string, userAgent: string) {
    if (!token) {
      throw new NotFoundException('Token not found');
    }

    const user = await this.userService.findOne(userId);
    const currentRefreshToken = await this.findByToken(token, ipAddress, userAgent);

    const accessToken = await this.tokenService.createAccessToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        name: user.name,
        avatar: user.avatar,
      },
      accessToken,
      refreshToken: currentRefreshToken.token,
    };
  }

  async revoke(token: string, ipAddress: string, userAgent: string) {
    const refreshToken = await this.findByToken(token, ipAddress, userAgent);

    refreshToken.revokedByIp = ipAddress;
    refreshToken.revokedAt = new Date();
    await this.em.flush();

    return { status: 'success' };
  }
}
