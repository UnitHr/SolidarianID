/**
 * @file This module exports the CauseDomainExceptionFilter class.
 * @module modules/causes/infra/filters/cause-domain-exception-filter
 *
 * @description This class is an exception filter for handling domain-specific errors related to cause operations.
 * It catches various cause-related exceptions and maps them to appropriate HTTP status codes and messages.
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import {
  EntityNotFoundError,
  InvalidDateProvidedError,
} from '@common-lib/common-lib/core/exceptions';
import { Response } from 'express';
import {
  ActionAlreadyExistsError,
  SupporterAlreadyExistsError,
} from '@communities-ms/causes/exceptions';

type ExceptionConstructor = new (...args: unknown[]) => Error;

@Catch(
  EntityNotFoundError,
  InvalidDateProvidedError,
  ActionAlreadyExistsError,
  SupporterAlreadyExistsError,
)
export class CauseDomainExceptionFilter implements ExceptionFilter {
  private readonly exceptionStatusMap = new Map<
    ExceptionConstructor,
    HttpStatus
  >([
    [EntityNotFoundError, HttpStatus.NOT_FOUND],
    [InvalidDateProvidedError, HttpStatus.BAD_REQUEST],
    [ActionAlreadyExistsError, HttpStatus.CONFLICT],
    [SupporterAlreadyExistsError, HttpStatus.CONFLICT],
  ]);

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
