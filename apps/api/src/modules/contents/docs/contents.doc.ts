import { HttpStatus } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { PaginationDto } from '@/common/dtos/pagination.dto';

import { CONTENT_STATUS, CONTENT_TYPE } from '../constants/contents.constant';

export class CreateContentSuccessDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.CREATED })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Create content successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: {
      id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      name: 'This is title',
      slug: 'this-is-title',
      description: 'Short content here',
      body: 'Full content here',
      type: CONTENT_TYPE.UNCATEGORIZED,
      status: CONTENT_STATUS.DRAFT,
      createdAt: '2023-11-28T03:03:39.054Z',
      updatedAt: '2023-11-28T03:03:39.054Z',
    },
  })
  data: unknown;
}

export class GetContentsSuccessDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Get contents successfully' })
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
        type: CONTENT_TYPE.UNCATEGORIZED,
        status: CONTENT_STATUS.DRAFT,
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

export class GetContentSuccessDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Get content successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: {
      id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      name: 'This is title',
      slug: 'this-is-title',
      description: 'Short content here',
      body: 'Full content here',
      type: CONTENT_TYPE.UNCATEGORIZED,
      status: CONTENT_STATUS.DRAFT,
      createdAt: '2023-11-28T03:03:39.054Z',
      updatedAt: '2023-11-28T03:03:39.054Z',
    },
  })
  data: unknown;
}

export class GetContentFailureDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.NOT_FOUND })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Content not found' })
  message: string;

  @ApiProperty({ type: String, example: 'Not Found' })
  error: string;
}

export class UpdateContentSuccessDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Update content successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: {
      id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      name: 'This is title',
      slug: 'this-is-title',
      description: 'Short content here',
      body: 'Full content here',
      type: CONTENT_TYPE.UNCATEGORIZED,
      status: CONTENT_STATUS.DRAFT,
      createdAt: '2023-11-28T03:03:39.054Z',
      updatedAt: '2023-11-28T03:03:39.054Z',
    },
  })
  data: unknown;
}

export class DeleteContentSuccessDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Delete content successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: {
      id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
      name: 'This is title',
      slug: 'this-is-title',
      description: 'Short content here',
      body: 'Full content here',
      type: CONTENT_TYPE.UNCATEGORIZED,
      status: CONTENT_STATUS.DELETED,
      createdAt: '2023-11-28T03:03:39.054Z',
      updatedAt: '2023-11-28T03:03:39.054Z',
    },
  })
  data: unknown;
}

export class BulkDeleteContentsSuccessDoc {
  @ApiProperty({ enum: HttpStatus, example: HttpStatus.OK })
  statusCode: HttpStatus;

  @ApiProperty({ type: String, example: 'Delete contents successfully' })
  message: string;

  @ApiProperty({
    type: 'object',
    example: [
      {
        id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        name: 'This is title',
        slug: 'this-is-title',
        description: 'Short content here',
        body: 'Full content here',
        type: CONTENT_TYPE.UNCATEGORIZED,
        status: CONTENT_STATUS.DELETED,
        createdAt: '2023-11-28T03:03:39.054Z',
        updatedAt: '2023-11-28T03:03:39.054Z',
      },
      {
        id: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        name: 'This is title',
        slug: 'this-is-title',
        description: 'Short content here',
        body: 'Full content here',
        type: CONTENT_TYPE.UNCATEGORIZED,
        status: CONTENT_STATUS.DELETED,
        createdAt: '2023-11-28T03:03:39.054Z',
        updatedAt: '2023-11-28T03:03:39.054Z',
      },
    ],
  })
  data: unknown;
}
