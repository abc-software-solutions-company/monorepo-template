import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from '@/common/dtos/pagination.dto';

import { CONTACT_STATUS } from '../constants/contacts.constant';

export class CreateContactSuccessDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.CREATED })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Create contact successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: {
      id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      name: 'This is title',
      slug: 'this-is-title',
      description: 'Short content here',
      body: 'Full content here',
      status: CONTACT_STATUS.PUBLISHED,
      createdAt: '2023-11-28T03:03:39.054Z',
      updatedAt: '2023-11-28T03:03:39.054Z',
    },
  })
  data: unknown;
}

export class GetContactsSuccessDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Get contacts successfully' })
  message: string;

  @ApiProperty({
    type: 'array',
    example: [
      {
        id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        name: 'This is title',
        slug: 'this-is-title',
        description: 'Short content here',
        body: 'Full content here',
        status: CONTACT_STATUS.PUBLISHED,
        creator: {
          id: '29332240-8d2d-45ad-8bbe-8cfe5906b30a',
          name: 'My Name',
        },
        createdAt: '2023-11-28T03:03:39.054Z',
        updatedAt: '2023-11-28T03:03:39.054Z',
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

export class GetContactSuccessDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Get contact successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: {
      id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      name: 'This is title',
      slug: 'this-is-title',
      description: 'Short content here',
      body: 'Full content here',
      status: CONTACT_STATUS.PUBLISHED,
      createdAt: '2023-11-28T03:03:39.054Z',
      updatedAt: '2023-11-28T03:03:39.054Z',
    },
  })
  data: unknown;
}

export class GetContactFailureDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.NOT_FOUND })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Contact not found' })
  message: string;

  @ApiProperty({ type: String, example: 'Not Found' })
  error: string;
}

export class UpdateContactSuccessDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Update contact successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: {
      id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      name: 'This is title',
      slug: 'this-is-title',
      description: 'Short content here',
      body: 'Full content here',
      status: CONTACT_STATUS.PUBLISHED,
      createdAt: '2023-11-28T03:03:39.054Z',
      updatedAt: '2023-11-28T03:03:39.054Z',
    },
  })
  data: unknown;
}

export class DeleteContactSuccessDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Delete contact successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: {
      id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      name: 'This is title',
      slug: 'this-is-title',
      description: 'Short content here',
      body: 'Full content here',
      status: CONTACT_STATUS.DELETED,
      cover: 'house-21715252750924.jpeg',
      createdAt: '2023-11-28T03:03:39.054Z',
      updatedAt: '2023-11-28T03:03:39.054Z',
    },
  })
  data: unknown;
}

export class BulkDeleteContactsSuccessDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Delete contacts successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: [
      { id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', status: 'deleted' },
      { id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', status: 'deleted' },
    ],
  })
  data: unknown;
}
