/* eslint-disable max-classes-per-file */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ApolloError } from 'apollo-server-express';

export class MicroserviceError extends ApolloError {
  constructor(
    message: string,
    code: string,
    extensions: Record<string, any> = {},
  ) {
    super(message, code, extensions);
  }
}

export class ResourceNotFoundError extends MicroserviceError {
  constructor(message: string, extensions: Record<string, any> = {}) {
    super(message, 'RESOURCE_NOT_FOUND', extensions);
  }
}

export class BadRequestError extends MicroserviceError {
  constructor(message: string, extensions: Record<string, any> = {}) {
    super(message, 'BAD_REQUEST', extensions);
  }
}

export class UnauthorizedError extends MicroserviceError {
  constructor(message: string, extensions: Record<string, any> = {}) {
    super(message, 'UNAUTHORIZED', extensions);
  }
}

export class ForbiddenError extends MicroserviceError {
  constructor(message: string, extensions: Record<string, any> = {}) {
    super(message, 'FORBIDDEN', extensions);
  }
}

export class ConflictError extends MicroserviceError {
  constructor(message: string, extensions: Record<string, any> = {}) {
    super(message, 'CONFLICT', extensions);
  }
}

export class InternalServerError extends MicroserviceError {
  constructor(
    message: string = 'Internal server error',
    extensions: Record<string, any> = {},
  ) {
    super(message, 'INTERNAL_SERVER_ERROR', extensions);
  }
}
