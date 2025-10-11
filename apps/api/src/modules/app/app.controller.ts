import { Controller, Get, HttpStatus } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AppService } from './app.service';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Health check' })
  @ApiResponse({ status: HttpStatus.OK, schema: { example: 'Hello World!' } })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/kafka-health-check')
  @ApiOperation({ summary: 'Health check Kafka' })
  @ApiResponse({ status: HttpStatus.OK, schema: { example: 'Hello World!' } })
  async healthCheckKafka(): Promise<string> {
    return this.appService.healthCheckKafka();
  }


}
