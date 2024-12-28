/**
 * @file This module exports the UserDomainExceptionFilter class.
 * @module modules/users/infra/filters/user-domain-exception-filter
 *
 * @description This class is an exception filter for handling domain-specific errors related to user operations.
 * It catches various user-related exceptions and maps them to appropriate HTTP status codes and messages.
 */

import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import {
  EmailAlreadyInUseError,
  EmailUpdateConflictError,
  InvalidDateProvidedError,
  MissingUserPropertiesError,
  UnderageUserError,
  UserNotFoundError,
} from '../../exceptions';

type ExceptionConstructor = new (...args: unknown[]) => Error;

@Catch(
  UserNotFoundError,
  EmailAlreadyInUseError,
  EmailUpdateConflictError,
  MissingUserPropertiesError,
  InvalidDateProvidedError,
  UnderageUserError,
)
export class UserDomainExceptionFilter implements ExceptionFilter {
  private readonly exceptionStatusMap = new Map<
    ExceptionConstructor,
    HttpStatus
  >([
    [UserNotFoundError, HttpStatus.NOT_FOUND],
    [EmailAlreadyInUseError, HttpStatus.CONFLICT],
    [EmailUpdateConflictError, HttpStatus.CONFLICT],
    [MissingUserPropertiesError, HttpStatus.BAD_REQUEST],
    [InvalidDateProvidedError, HttpStatus.BAD_REQUEST],
    [UnderageUserError, HttpStatus.BAD_REQUEST],
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
