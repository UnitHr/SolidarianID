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
import {
  EntityNotFoundError,
  InvalidDateProvidedError,
} from '@common-lib/common-lib/core/exceptions';
import { Response } from 'express';
import { InvalidEmailError } from '@users-ms/users/exceptions/invalid-email.error';
import {
  MissingPropertiesError,
  EmailAlreadyInUseError,
  EmailUpdateConflictError,
  UnderageUserError,
} from '../../exceptions';

type ExceptionConstructor = new (...args: unknown[]) => Error;

@Catch(
  MissingPropertiesError,
  EntityNotFoundError,
  EmailAlreadyInUseError,
  EmailUpdateConflictError,
  InvalidDateProvidedError,
  UnderageUserError,
  InvalidEmailError,
)
export class UserDomainExceptionFilter implements ExceptionFilter {
  private readonly exceptionStatusMap = new Map<
    ExceptionConstructor,
    HttpStatus
  >([
    [MissingPropertiesError, HttpStatus.BAD_REQUEST],
    [EntityNotFoundError, HttpStatus.NOT_FOUND],
    [EmailAlreadyInUseError, HttpStatus.CONFLICT],
    [EmailUpdateConflictError, HttpStatus.CONFLICT],
    [InvalidDateProvidedError, HttpStatus.BAD_REQUEST],
    [UnderageUserError, HttpStatus.BAD_REQUEST],
    [InvalidEmailError, HttpStatus.BAD_REQUEST],
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
