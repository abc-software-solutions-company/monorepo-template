import { NestExpressApplication } from '@nestjs/platform-express';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { hashPassword } from '@/common/utils/password.util';

import { AuditLogsModule } from '@/modules/audit-logs/audit-logs.module';
import { AuditLog } from '@/modules/audit-logs/entities/audit-log.entity';
import { AuthModule } from '@/modules/auth/auth.module';
import { RefreshToken } from '@/modules/refresh-tokens/entities/refresh-token.entity';
import { RefreshTokensModule } from '@/modules/refresh-tokens/refresh-tokens.module';
import { USER_ROLE, USER_STATUS } from '@/modules/users/constants/users.constant';
import { User } from '@/modules/users/entities/user.entity';
import { UserPreference } from '@/modules/users/entities/user-preference.entity';
import { UsersModule } from '@/modules/users/users.module';

import { login, logout } from './utils/auth.util';
import { setupTestingModules } from './utils/setup.util';

describe('AuthController (e2e)', () => {
  let app: NestExpressApplication;
  let userRepository: Repository<User>;
  let userPreferenceRepository: Repository<UserPreference>;
  let auditLogRepository: Repository<AuditLog>;
  let refreshTokenRepository: Repository<RefreshToken>;
  let registerUser: User;
  let inactiveUser: User;
  let blockedUser: User;

  beforeAll(async () => {
    const { app: application, moduleFixture } = await setupTestingModules([AuthModule, UsersModule, RefreshTokensModule, AuditLogsModule]);

    app = application;
    auditLogRepository = moduleFixture.get(getRepositoryToken(AuditLog));
    refreshTokenRepository = moduleFixture.get(getRepositoryToken(RefreshToken));
    userPreferenceRepository = moduleFixture.get(getRepositoryToken(UserPreference));
    userRepository = moduleFixture.get(getRepositoryToken(User));

    await auditLogRepository.delete({});
    await userPreferenceRepository.delete({});
    await refreshTokenRepository.delete({});
    await userRepository.delete({});

    inactiveUser = await userRepository.save({
      email: 'inactive@email.com',
      password: hashPassword(process.env.AP_USER_PASSWORD),
      name: 'Register',
      role: USER_ROLE.USER,
      status: USER_STATUS.INACTIVE,
      preference: new UserPreference(),
    });
    blockedUser = await userRepository.save({
      email: 'blocked@email.com',
      password: hashPassword(process.env.AP_USER_PASSWORD),
      name: 'Blocked',
      role: USER_ROLE.USER,
      status: USER_STATUS.BLOCKED,
      preference: new UserPreference(),
    });
    registerUser = await userRepository.save({
      email: 'register@email.com',
      password: hashPassword(process.env.AP_USER_PASSWORD),
      name: 'Register',
      role: USER_ROLE.USER,
      status: USER_STATUS.ACTIVE,
      preference: new UserPreference(),
    });
  });

  afterAll(async () => {
    await app.close();
  });

  describe('#login', () => {
    it('should throw BadRequestException if email and password are empty', async () => {
      const response = await login(app, { email: '', password: '' });

      expect(response.body).toMatchObject({
        statusCode: 400,
        error: 'Bad Request',
        message: [
          'email should not be empty',
          'email must be an email',
          'password has to be at between 8 and 255 characters',
          'password should contain at least one uppercase letter, one lowercase letter, one number and one special character',
          'password should not be empty',
        ],
      });
    });

    it('should throw BadRequestException if email is empty', async () => {
      const response = await login(app, { email: '', password: 'Dummypassword@123' });

      expect(response.body).toMatchObject({
        statusCode: 400,
        error: 'Bad Request',
        message: ['email should not be empty', 'email must be an email'],
      });
    });

    it('should throw BadRequestException if password is empty', async () => {
      const response = await login(app, { email: 'dummy@email.com', password: '' });

      expect(response.body).toMatchObject({
        statusCode: 400,
        error: 'Bad Request',
        message: [
          'password has to be at between 8 and 255 characters',
          'password should contain at least one uppercase letter, one lowercase letter, one number and one special character',
          'password should not be empty',
        ],
      });
    });

    it('should throw BadRequestException if email is invalid', async () => {
      const response = await login(app, { email: 'dummy', password: 'Dummypassword@123' });

      expect(response.body).toMatchObject({
        statusCode: 400,
        error: 'Bad Request',
        message: ['email must be an email'],
      });
    });

    it('should throw BadRequestException if password is invalid', async () => {
      const response = await login(app, { email: 'dummy@email.com', password: 'dummypassword' });

      expect(response.body).toMatchObject({
        statusCode: 400,
        error: 'Bad Request',
        message: ['password should contain at least one uppercase letter, one lowercase letter, one number and one special character'],
      });
    });

    it('should throw UnauthorizedException if credentials are incorrect', async () => {
      const response = await login(app, { email: 'dummy@email.com', password: 'Dummypassword@123' });

      expect(response.body).toMatchObject({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'User not found',
      });
    });

    it('should throw UnauthorizedException if user is INACTIVE', async () => {
      const response = await login(app, { email: inactiveUser.email, password: process.env.AP_USER_PASSWORD });

      expect(response.body).toMatchObject({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'User is inactive',
      });
    });

    it('should throw UnauthorizedException if user is BLOCKED', async () => {
      const response = await login(app, { email: blockedUser.email, password: process.env.AP_USER_PASSWORD });

      expect(response.body).toMatchObject({
        statusCode: 401,
        error: 'Unauthorized',
        message: 'User is inactive',
      });
    });

    it('returns user if credentials are correct', async () => {
      const response = await login(app, { email: registerUser.email, password: process.env.AP_USER_PASSWORD });

      expect(response.body).toMatchObject({
        statusCode: 200,
        message: 'Login successfully',
      });

      expect(response.body.data).toMatchObject({
        user: {
          email: registerUser.email,
          role: registerUser.role,
          name: registerUser.name,
          preference: registerUser.preference,
          avatar: null,
        },
        accessToken: expect.any(String),
      });
    });
  });

  describe('#logout', () => {
    it('should return 200 - Success if token is correct', async () => {
      await login(app, { email: process.env.AP_USER_EMAIL, password: process.env.AP_USER_PASSWORD });
      const response = await logout(app);

      expect(response.body).toMatchObject({
        statusCode: 200,
        message: 'Logout successfully',
      });
      expect(response.body.data).toMatchObject({
        status: 'success',
      });
    });
  });
});
