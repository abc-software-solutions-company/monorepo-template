import { Body, Controller, Delete, Get, HttpStatus, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

import { BulkDeleteDto } from '@/common/dtos/bulk-delete.dto';

import { ApiDocumentResponse } from '@/common/decorators/api-document-response.decorator';
import { PaginatedResponse } from '@/common/decorators/paginated-response.decorator';
import { Response } from '@/common/decorators/response.decorator';

import {
  BulkDeleteContactsSuccessDoc,
  CreateContactSuccessDoc,
  DeleteContactSuccessDoc,
  GetContactFailureDoc,
  UpdateContactSuccessDoc,
} from './docs/contacts.doc';
import { CreateContactDto } from './dto/create-contact.dto';
import { FilterContactDto } from './dto/filter-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { ContactsService } from './contacts.service';

import { AccessTokenGuard } from '../auth/guards/access-token.guard';

@Controller('admin/contacts')
@ApiTags('Admin Contacts')
@UseGuards(AccessTokenGuard)
@ApiBearerAuth('accessToken')
export class AdminContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create contact' })
  @ApiDocumentResponse({ status: HttpStatus.CREATED, message: 'Create contact successfully', model: CreateContactSuccessDoc })
  @Response({ message: 'Create contact successfully' })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get contacts' })
  @ApiDocumentResponse({ message: 'Get contacts successfully', model: CreateContactSuccessDoc })
  @PaginatedResponse({ message: 'Get contacts successfully' })
  find(@Query() filterContactDto: FilterContactDto) {
    return this.contactsService.find(filterContactDto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get contact' })
  @ApiDocumentResponse({ message: 'Get contact successfully', model: CreateContactSuccessDoc })
  @Response({ message: 'Get contact successfully' })
  @ApiParam({ name: 'id', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  findOne(@Param('id') id: string) {
    return this.contactsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update contact' })
  @ApiDocumentResponse({ message: 'Update contact successfully', model: UpdateContactSuccessDoc })
  @Response({ message: 'Update contact successfully' })
  @ApiParam({ name: 'id', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  update(@Param('id') id: string, @Body() updateContactDto: UpdateContactDto) {
    return this.contactsService.update(id, updateContactDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete contact' })
  @ApiDocumentResponse({ message: 'Delete contact successfully', model: DeleteContactSuccessDoc })
  @ApiDocumentResponse({ status: HttpStatus.NOT_FOUND, message: 'Contact not found', model: GetContactFailureDoc })
  @Response({ message: 'Delete contact successfully' })
  @ApiParam({ name: 'id', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' })
  remove(@Param('id') id: string) {
    return this.contactsService.remove(id);
  }

  @Post('bulk-delete')
  @ApiOperation({ summary: 'Delete multiple contacts' })
  @ApiDocumentResponse({ message: 'Delete contacts successfully', model: BulkDeleteContactsSuccessDoc })
  @Response({ message: 'Delete contacts successfully' })
  bulkDelete(@Body() bulkDeleteContactDto: BulkDeleteDto) {
    return this.contactsService.bulkDelete(bulkDeleteContactDto);
  }
}
