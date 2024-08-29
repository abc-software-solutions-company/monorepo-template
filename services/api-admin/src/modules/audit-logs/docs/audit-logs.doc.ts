import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from '@/common/dtos/pagination.dto';

export class CreateAuditLogSuccessDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.CREATED })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Create audit log successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: {
      id: 'b54fb257-7260-4a0a-a3c7-d5bd1d9fdfcc',
      recordId: '7e7eac08-cb14-4b29-a142-9c6702ccd1c5',
      tableName: 'posts',
      action: 'update',
      createdAt: '2023-11-28T03:03:39.054Z',
      oldValue: {},
      newValue: {
        id: '7e7eac08-cb14-4b29-a142-9c6702ccd1c5',
        name: 'cribro facere summa corona bellum contigo coniuratio eum vitae in',
        slug: 'cribro-facere-summa-corona-bellum-contigo-coniuratio-eum-vitae-in',
        body: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget risus sollicitudin.</p>',
        cover: '',
        status: 'published',
      },
      user: {
        id: '29332240-8d2d-45ad-8bbe-8cfe5906b30a',
        name: 'Ammodesk',
        email: 'ammodesk@gmail.com',
      },
    },
  })
  data: unknown;
}

export class GetAuditLogsSuccessDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Get audit logs successfully' })
  message: string;

  @ApiProperty({
    type: 'array',
    example: [
      {
        id: 'b54fb257-7260-4a0a-a3c7-d5bd1d9fdfcc',
        tableName: 'posts',
        recordId: '7e7eac08-cb14-4b29-a142-9c6702ccd1c5',
        action: 'delete',
        oldValue: {
          id: '7e7eac08-cb14-4b29-a142-9c6702ccd1c5',
          name: 'cribro facere summa corona bellum contigo coniuratio eum vitae in',
          slug: 'cribro-facere-summa-corona-bellum-contigo-coniuratio-eum-vitae-in',
          body: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit..</p>',
          cover: '',
          status: 'deleted',
        },
        newValue: {
          id: '7e7eac08-cb14-4b29-a142-9c6702ccd1c5',
          name: 'cribro facere summa corona bellum contigo coniuratio eum vitae in',
          slug: 'cribro-facere-summa-corona-bellum-contigo-coniuratio-eum-vitae-in',
          body: '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent eget risus sollicitudin.</p>',
          cover: '',
          status: 'deleted',
        },
        createdAt: '2023-11-28T03:03:39.054Z',
        user: {
          id: '29332240-8d2d-45ad-8bbe-8cfe5906b30a',
          name: 'Ammodesk',
          email: 'ammodesk@gmail.com',
        },
      },
    ],
  })
  data: unknown[];

  @ApiProperty({
    example: {
      paging: {
        currentPage: 1,
        itemsPerPage: 1,
        totalItems: 4,
        totalPages: 4,
      },
    },
  })
  meta: {
    paging: PaginationDto;
  };
}

export class GetAuditLogSuccessDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Get audit log successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: {
      id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
    },
  })
  data: unknown;
}
