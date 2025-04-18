import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { EntityNotFoundError } from '@common-lib/common-lib/core/exceptions';
import { Response } from 'express';
import { UserCannotFollowSelfError } from '../../exceptions/user-cannot-follow-self.error';
import { UserAlreadyFollowedError } from '../../exceptions/user-already-followed.error';

type ExceptionConstructor = new (...args: unknown[]) => Error;

@Catch(EntityNotFoundError, UserCannotFollowSelfError, UserAlreadyFollowedError)
export class FollowerDomainExceptionFilter implements ExceptionFilter {
  private readonly exceptionStatusMap = new Map<
    ExceptionConstructor,
    HttpStatus
  >([
    [EntityNotFoundError, HttpStatus.NOT_FOUND],
    [UserCannotFollowSelfError, HttpStatus.CONFLICT],
    [UserAlreadyFollowedError, HttpStatus.CONFLICT],
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
