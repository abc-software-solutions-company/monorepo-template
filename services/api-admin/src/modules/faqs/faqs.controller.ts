import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { ApiDocumentResponse } from '@/common/decorators/api-document-response.decorator';
import { Response } from '@/common/decorators/response.decorator';

import { CreateFaqSuccessDoc } from './docs/faqs.doc';
import { CreateFaqDto } from './dto/create-faq.dto';
import { FaqsService } from './faqs.service';

@Controller('faqs')
@ApiTags('Faqs')
export class FaqsController {
  constructor(private readonly faqsService: FaqsService) {}

  @Post()
  @ApiOperation({ summary: 'Create faq' })
  @ApiDocumentResponse({ status: HttpStatus.CREATED, message: 'Create faq successfully', model: CreateFaqSuccessDoc })
  @Response({ message: 'Create faq successfully' })
  create(@Body() createFaqDto: CreateFaqDto) {
    return this.faqsService.create(createFaqDto);
  }
}
