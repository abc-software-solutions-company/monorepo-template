import { Body, Controller, Get, HttpStatus, ParseFilePipeBuilder, Patch, Post, Req, UploadedFile, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { ApiDocumentResponse } from '@/common/decorators/api-document-response.decorator';
import { ApiFile } from '@/common/decorators/api-file.decorator';
import { Response } from '@/common/decorators/response.decorator';

import { UpdateUserPreferenceBadRequestDoc, UpdateUserPreferenceSuccessDoc, UserPreferenceNotFoundDoc } from './docs/user-preference.doc';
import { GetUserProfileSuccessDoc, UpdateUserDeviceTokenSuccessDoc, UpdateUserProfileSuccessDoc } from './docs/users.doc';
import { UpdateUserProfileDto } from './dto/update-profile.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateUserDeviceTokenDto } from './dto/update-user-device-token.dto';
import { UpdateUserPreferenceDto } from './dto/update-user-preference.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { UsersPreferencesService } from './users-preferences.service';

import { UploadFileTypeValidator } from '../../common/validators/upload-file-type.validator';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { MAX_AVATAR_FILE_SIZE_IN_BYTES, VALID_IMAGE_MIME_TYPES } from '../files/constants/files.constant';

@Controller({ path: 'users' })
@ApiTags('Users')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth('accessToken')
export class UsersController {
  constructor(
    private readonly usersPreferencesService: UsersPreferencesService,
    private readonly usersService: UsersService
  ) {}

  @Patch('preferences')
  @ApiOperation({ summary: 'Update user preferences' })
  @ApiDocumentResponse({ status: HttpStatus.OK, message: 'Update user preference successfully', model: UpdateUserPreferenceSuccessDoc })
  @ApiDocumentResponse({ status: HttpStatus.NOT_FOUND, message: 'User not found', model: UserPreferenceNotFoundDoc })
  @ApiDocumentResponse({ status: HttpStatus.BAD_REQUEST, message: 'Data should not be empty', model: UpdateUserPreferenceBadRequestDoc })
  @Response({ message: 'Update user preference successfully' })
  updatePreference(@Req() req: Request, @Body() updateUserPreferenceDto: UpdateUserPreferenceDto) {
    const user = req.user as User;

    return this.usersPreferencesService.updateReference(user.id, updateUserPreferenceDto);
  }

  @Patch('profile')
  @ApiOperation({ summary: 'Update user profile' })
  @ApiDocumentResponse({ message: 'Update user successfully', model: UpdateUserProfileSuccessDoc })
  @Response({ message: 'Update user profile successfully' })
  updateProfile(@Req() req: Request, @Body() updateUserProfileDto: UpdateUserProfileDto) {
    const user = req.user as User;

    return this.usersService.update(user.id, user, updateUserProfileDto);
  }

  @Get('me')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiDocumentResponse({ message: 'Get user profile successfully', model: GetUserProfileSuccessDoc })
  @Response({ message: 'Get user profile successfully' })
  me(@Req() req: Request) {
    const user = req.user as User;

    return this.usersService.findOne(user.id);
  }

  @Patch('device-token')
  @ApiOperation({ summary: 'Update user device token (Mobile Only)', description: 'Update Device Token from Mobile App for Push Notification' })
  @ApiDocumentResponse({ message: 'Update user device token successfully', model: UpdateUserDeviceTokenSuccessDoc })
  @Response({ message: 'Update user device token successfully' })
  updateDeviceToken(@Req() req: Request, @Body() updateUserProfileDto: UpdateUserDeviceTokenDto) {
    const user = req.user as User;

    return this.usersService.update(user.id, user, updateUserProfileDto as UpdateUserDto);
  }

  @Post('change-avatar')
  @ApiOperation({ summary: 'Change user avatar' })
  @ApiDocumentResponse({ message: 'Change avatar successfully', model: UpdateUserProfileSuccessDoc })
  @Response({ message: 'Change avatar successfully' })
  @ApiFile('avatar', true)
  uploadAvatar(
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addValidator(new UploadFileTypeValidator({ fileType: VALID_IMAGE_MIME_TYPES }))
        .addMaxSizeValidator({ maxSize: MAX_AVATAR_FILE_SIZE_IN_BYTES })
        .build({ errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY })
    )
    file: Express.Multer.File
  ) {
    const user = req.user as User;

    return this.usersService.updateAvatar(user.id, file);
  }
}
