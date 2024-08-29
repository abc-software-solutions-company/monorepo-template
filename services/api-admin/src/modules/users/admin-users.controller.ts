import { Body, Controller, Delete, Get, HttpStatus, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { BulkDeleteDto } from '@/common/dtos/bulk-delete.dto';

import { ApiDocumentResponse } from '@/common/decorators/api-document-response.decorator';
import { PaginatedResponse } from '@/common/decorators/paginated-response.decorator';
import { UUIDParam } from '@/common/decorators/param.decorator';
import { Response } from '@/common/decorators/response.decorator';

import {
  BulkDeleteUsersSuccessDoc,
  CreateUserSuccessDoc,
  DeleteUserSuccessDoc,
  GetUserFailureDoc,
  GetUsersSuccessDoc,
  GetUserSuccessDoc,
  UpdateUserSuccessDoc,
} from './docs/users.doc';
import { CreateUserDto } from './dto/create-user.dto';
import { FilterUserDto } from './dto/filter-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Controller({ path: 'admin/users' })
@UseGuards(AccessTokenGuard)
@ApiTags('Admin Users')
@ApiBearerAuth('accessToken')
export class AdminUsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create user' })
  @ApiDocumentResponse({ message: 'Create user successfully', model: CreateUserSuccessDoc })
  @Response({ message: 'Create user successfully' })
  create(@Req() req: Request, @Body() createDto: CreateUserDto) {
    const user = req.user as User;

    return this.usersService.create(user, createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get users' })
  @ApiDocumentResponse({ message: 'Get users successfully', model: GetUsersSuccessDoc })
  @PaginatedResponse({ message: 'Get users successfully' })
  find(@Query() filterDto: FilterUserDto) {
    return this.usersService.find(filterDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user' })
  @ApiDocumentResponse({ message: 'Get user successfully', model: GetUserSuccessDoc })
  @Response({ message: 'Get user successfully' })
  @ApiParam({ name: 'id', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  findOne(@UUIDParam('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update user' })
  @ApiDocumentResponse({ message: 'Update user successfully', model: UpdateUserSuccessDoc })
  @Response({ message: 'Update user successfully' })
  @ApiParam({ name: 'id', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  update(@Req() req: Request, @UUIDParam('id') id: string, @Body() updateDto: UpdateUserDto) {
    const user = req.user as User;

    return this.usersService.update(id, user, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete user' })
  @ApiDocumentResponse({ message: 'Delete user successfully', model: DeleteUserSuccessDoc })
  @ApiDocumentResponse({ status: HttpStatus.NOT_FOUND, message: 'User not found', model: GetUserFailureDoc })
  @Response({ message: 'Delete user successfully' })
  @ApiParam({ name: 'id', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  remove(@Req() req: Request, @UUIDParam('id') id: string) {
    const user = req.user as User;

    return this.usersService.remove(id, user);
  }

  @Post('bulk-delete')
  @ApiOperation({ summary: 'Delete multiple users' })
  @Response({ message: 'Delete users successfully' })
  @ApiDocumentResponse({ message: 'Delete user successfully', model: BulkDeleteUsersSuccessDoc })
  bulkDelete(@Req() req: Request, @Body() bulkDeleteDto: BulkDeleteDto) {
    const user = req.user as User;

    return this.usersService.bulkDelete(user, bulkDeleteDto);
  }
}
