/* eslint-disable @typescript-eslint/no-explicit-any */
import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { GqlArgumentsHost, GqlExceptionFilter } from '@nestjs/graphql';
import { ApolloError } from 'apollo-server-express';
import axios, { AxiosError } from 'axios';
import {
  BadRequestError,
  ForbiddenError,
  InternalServerError,
  ResourceNotFoundError,
  UnauthorizedError,
  ConflictError,
} from './graphql-errors';

@Catch()
export class GraphQLGeneralExceptionFilter implements GqlExceptionFilter {
  private readonly logger = new Logger(GraphQLGeneralExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost): ApolloError {
    // ApolloError passthrough
    if (exception instanceof ApolloError) {
      return exception;
    }

    // Axios errors (HTTP client)
    if (axios.isAxiosError(exception)) {
      const axiosErr = exception as AxiosError<any>;
      const status =
        axiosErr.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const response = axiosErr.response?.data;

      let message = this.extractMessage(response) || axiosErr.message;
      message = this.sanitizeMessage(message);
      const errorCode = this.extractErrorCode(response) || HttpStatus[status];
      const extensions = {
        originalStatus: status,
        code: errorCode,
        ...(response && typeof response === 'object' ? response : {}),
      };

      this.logger.debug(`Axios ${status} error: ${message}`);

      return this.mapHttpExceptionToGraphQL(status, message, extensions);
    }

    // Fallback for unexpected errors
    const defaultMessage = 'An unexpected error occurred';
    const rawMessage = exception?.message || defaultMessage;
    const message = this.sanitizeMessage(rawMessage);
    const info = GqlArgumentsHost.create(host).getInfo();
    this.logger.error(
      `Unhandled GraphQL ${info.fieldName} error: ${message}`,
      exception.stack,
    );

    return new InternalServerError(message, {
      code: 'INTERNAL_SERVER_ERROR',
      timestamp: new Date().toISOString(),
    });
  }

  private extractMessage(response: any): string | undefined {
    if (!response) {
      return undefined;
    }

    if (typeof response === 'string') {
      return response;
    }

    if (typeof response === 'object' && response.message) {
      return Array.isArray(response.message)
        ? response.message.join(', ')
        : response.message;
    }

    return undefined;
  }

  private sanitizeMessage(message: string): string {
    // Unescape any escaped quotes
    let sanitized = message.replace(/\\"/g, '"');
    sanitized = sanitized.replace(/"([^"]+)"/g, '$1');
    return sanitized;
  }

  private extractErrorCode(response: any): string | undefined {
    if (response && typeof response === 'object' && response.errorCode) {
      return response.errorCode;
    }
    return undefined;
  }

  private mapHttpExceptionToGraphQL(
    status: number,
    message: string,
    extensions: Record<string, any>,
  ): ApolloError {
    switch (status) {
      case HttpStatus.BAD_REQUEST:
        return new BadRequestError(message, extensions);
      case HttpStatus.UNAUTHORIZED:
        return new UnauthorizedError(message, extensions);
      case HttpStatus.FORBIDDEN:
        return new ForbiddenError(message, extensions);
      case HttpStatus.NOT_FOUND:
        return new ResourceNotFoundError(message, extensions);
      case HttpStatus.CONFLICT:
        return new ConflictError(message, extensions);
      default:
        this.logger.warn(`Unmapped HTTP status code: ${status}`, extensions);
        return new InternalServerError(message, extensions);
    }
  }
}
