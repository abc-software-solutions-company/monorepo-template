import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { USER_PREFERENCE_COLOR_SCHEME, USER_PREFERENCE_LANGUAGE } from '../constants/user-preference.constant';

export class UpdateUserPreferenceSuccessDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Update user preference successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: {
      statusCode: 200,
      message: 'Update user preference successfully',
      data: {
        language: USER_PREFERENCE_LANGUAGE.UNITED_STATES,
        theme: USER_PREFERENCE_COLOR_SCHEME.DARK,
        id: 'b68992bc-cc29-4137-9894-1a2fe4855ca2',
      },
    },
  })
  data: unknown;
}

export class UpdateUserPreferenceBadRequestDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.BAD_REQUEST })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Data should not be empty' })
  message: string;

  @ApiProperty({ type: String, example: 'Bad Request' })
  error: string;
}

export class UserPreferenceNotFoundDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.NOT_FOUND })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'User not found' })
  message: string;

  @ApiProperty({ type: String, example: 'Not Found' })
  error: string;
}
