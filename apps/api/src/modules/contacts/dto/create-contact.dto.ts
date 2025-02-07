import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateContactDto {
  @ApiProperty({ example: 'Ammodesk' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  name: string;

  @ApiProperty({ example: 'ammodesk@gmail.com' })
  @IsEmail()
  @MaxLength(320)
  email: string;

  @ApiProperty({ example: 'Hello' })
  @IsString()
  @MaxLength(255)
  subject: string;

  @ApiProperty({ example: 'Message' })
  @IsString()
  @MaxLength(5000)
  message: string;
}
