import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError } from '@common-lib/common-lib/core/exceptions/entity-not-found.error';
import { Response } from 'express';
import {
  ActionTitleConflictError,
  InvalidActionTypeError,
  CompletedActionError,
  InvalidContributionUnitError,
} from '../../exceptions';

type ExceptionConstructor = new (...args: unknown[]) => Error;

@Catch(
  EntityNotFoundError,
  ActionTitleConflictError,
  CompletedActionError,
  InvalidContributionUnitError,
  InvalidActionTypeError,
)
export class ActionDomainExceptionFilter implements ExceptionFilter {
  private readonly exceptionStatusMap = new Map<
    ExceptionConstructor,
    HttpStatus
  >([
    [EntityNotFoundError, HttpStatus.NOT_FOUND],
    [ActionTitleConflictError, HttpStatus.CONFLICT],
    [InvalidActionTypeError, HttpStatus.BAD_REQUEST],
    [CompletedActionError, HttpStatus.CONFLICT],
    [InvalidContributionUnitError, HttpStatus.BAD_REQUEST],
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
