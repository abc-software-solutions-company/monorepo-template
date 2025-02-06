import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { type Response } from 'express';
import { STATUS_CODES } from 'http';
import { QueryFailedError } from 'typeorm/error/QueryFailedError';

type PostgresError = {
  code: string;
  detail?: string;
  table?: string;
  constraint?: string;
};

@Catch(QueryFailedError)
export class QueryFailedErrorFilter implements ExceptionFilter {
  catch(exception: QueryFailedError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const driverError = exception.driverError as unknown as PostgresError;

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = exception.message;

    switch (driverError?.code) {
      // unique_violation
      case '23505':
        status = HttpStatus.CONFLICT;
        message = 'Duplicate entry: This record already exists';
        break;
    }

    response.status(status).json({
      statusCode: status,
      error: STATUS_CODES[status],
      message,
    });
  }
}
