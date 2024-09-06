import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { Request, Response as ExpressResponse } from 'express';

import { ApiDocumentResponse } from '@/common/decorators/api-document-response.decorator';
import { Response } from '@/common/decorators/response.decorator';

import { LoginWithCredentialsDoc, SignOutDoc } from './docs/auth.doc';
import { SignInDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

@Controller('admin/auth')
@ApiTags('Admin Auth')
export class AdminAuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 10000 } })
  @ApiOperation({ summary: 'Login with credentials' })
  @ApiDocumentResponse({ message: 'Login successfully', model: LoginWithCredentialsDoc })
  @Response({ message: 'Login successfully' })
  async login(@Req() req: Request, @Res({ passthrough: true }) response: ExpressResponse, @Body() signInDto: SignInDto) {
    const ip = req.ip as string;
    const ua = req.headers['user-agent'] || '';

    const resp = await this.authService.signInAdmin(signInDto, ip, ua);

    response.cookie('refreshToken', resp.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    });

    delete resp.refreshToken;

    return resp;
  }

  @Post('logout')
  @ApiOperation({ summary: 'Log out' })
  @ApiDocumentResponse({ message: 'Logout successfully', model: SignOutDoc })
  @Response({ message: 'Logout successfully' })
  async signOut(@Req() req: Request) {
    const ip = req.ip as string;
    const ua = req.headers['user-agent'] || '';
    const refreshToken = req.cookies['refreshToken'];

    return this.authService.signOut(refreshToken, ip, ua);
  }
}
