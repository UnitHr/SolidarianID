/**
 * @file This module exports the CommunityReportsExceptionFilter class.
 * @module apps/statistics-ms/src/community-reports/infra/filters/community-reports-domain-exception.filter
 *
 * @description This class is an exception filter for handling domain-specific errors related to community reports operations.
 * It catches various community-related exceptions and maps them to appropriate HTTP status codes and messages.
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { CommunityNotFoundError } from '../../exceptions';

type ExceptionConstructor = new (...args: unknown[]) => Error;

@Catch(CommunityNotFoundError)
export class CommunityReportsExceptionFilter implements ExceptionFilter {
  private readonly exceptionStatusMap = new Map<
    ExceptionConstructor,
    HttpStatus
  >([[CommunityNotFoundError, HttpStatus.NOT_FOUND]]);

  catch(exception: Error, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    const status =
      this.exceptionStatusMap.get(
        exception.constructor as ExceptionConstructor,
      ) || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception.message || 'Internal server error';

    response.status(status).json({
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
