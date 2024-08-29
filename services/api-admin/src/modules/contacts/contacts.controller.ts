import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiDocumentResponse } from '@/common/decorators/api-document-response.decorator';
import { Response } from '@/common/decorators/response.decorator';

import { CreateContactSuccessDoc } from './docs/contacts.doc';
import { CreateContactDto } from './dto/create-contact.dto';
import { ContactsService } from './contacts.service';

@Controller('contacts')
@ApiTags('Contacts')
export class ContactsController {
  constructor(private readonly contactsService: ContactsService) {}

  @Post()
  @ApiOperation({ summary: 'Create contact' })
  @ApiDocumentResponse({ status: HttpStatus.CREATED, message: 'Create post successfully', model: CreateContactSuccessDoc })
  @Response({ message: 'Create contact successfully' })
  create(@Body() createContactDto: CreateContactDto) {
    return this.contactsService.create(createContactDto);
  }
}
