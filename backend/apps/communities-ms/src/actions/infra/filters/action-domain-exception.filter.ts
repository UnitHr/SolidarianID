import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError } from '@common-lib/common-lib/core/exceptions/entity-not-found.error';
import { Response } from 'express';
import {
  ActionTitleConflictException,
  CompletedActionException,
  InvalidCauseIdException,
  InvalidContributionUnitException,
} from '../../exceptions';

type ExceptionConstructor = new (...args: unknown[]) => Error;

@Catch(
  EntityNotFoundError,
  ActionTitleConflictException,
  CompletedActionException,
  InvalidCauseIdException,
  InvalidContributionUnitException,
)
export class ActionDomainExceptionFilter implements ExceptionFilter {
  private readonly exceptionStatusMap = new Map<
    ExceptionConstructor,
    HttpStatus
  >([
    [EntityNotFoundError, HttpStatus.NOT_FOUND],
    [ActionTitleConflictException, HttpStatus.CONFLICT],
    [CompletedActionException, HttpStatus.CONFLICT],
    [InvalidCauseIdException, HttpStatus.BAD_REQUEST],
    [InvalidContributionUnitException, HttpStatus.BAD_REQUEST],
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
