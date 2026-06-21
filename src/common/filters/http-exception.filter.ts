import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  ValidationError,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorResponse {
  code?: string;
  message?: string | string[] | ValidationError[];
  error?: string;
  details?: any;
  statusCode?: number;
}

//TODO: update this filter

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const originalResponse =
      exception instanceof HttpException ? exception.getResponse() : null;

    let errorBody: Record<string, any>;
    // 1. Custom exceptions (BusinessRuleException, etc.)
    if (
      originalResponse &&
      typeof originalResponse === 'object' &&
      'code' in originalResponse
    ) {
      errorBody = {
        ...(originalResponse as Record<string, any>),
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }
    // 2. Validation / Pipe errors
    else if (
      originalResponse &&
      typeof originalResponse === 'object' &&
      Array.isArray((originalResponse as ErrorResponse).message)
    ) {
      const rawMessage = (originalResponse as ErrorResponse).message!;
      errorBody = {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details:
          typeof rawMessage === 'string'
            ? rawMessage
            : this.formatValidationErrors(rawMessage),
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }
    // 3. Fallback
    else {
      errorBody = {
        code: this.getErrorCode(originalResponse),
        message: this.extractMessage(originalResponse),
        details: this.extractDetails(originalResponse),
        timestamp: new Date().toISOString(),
        path: request.url,
      };
    }

    response.status(status).json(errorBody);
  }

  private getErrorCode(response: string | object | null): string {
    if (typeof response === 'string') return 'BAD_REQUEST';
    if (!response) return 'UNKNOWN_ERROR';

    const resp = response as ErrorResponse;
    return (
      resp.code ||
      (resp.error === 'Bad Request' ? 'VALIDATION_ERROR' : 'UNKNOWN_ERROR')
    );
  }

  private extractMessage(response: string | object | null): string {
    if (typeof response === 'string') return response;
    if (!response) return 'Bad Request';

    const resp = response as ErrorResponse;
    if (Array.isArray(resp.message)) return 'Validation failed';
    return (resp.message as string) || 'Bad Request';
  }

  private extractDetails(response: string | object | null): any {
    if (typeof response === 'string' || !response) return undefined;

    const resp = response as ErrorResponse;
    if (Array.isArray(resp.message)) {
      return this.formatValidationErrors(resp.message);
    }
    return resp.details || resp;
  }

  /** Handles both string[] (ParseUUIDPipe) and ValidationError[] */
  private formatValidationErrors(rawErrors: string[] | ValidationError[]): {
    fields: Record<string, string[]>;
    count: number;
  } {
    const formatted: Record<string, string[]> = {};

    if (typeof rawErrors[0] === 'string') {
      // Simple errors from ParseUUIDPipe, etc.
      formatted[''] = rawErrors as string[];
    } else {
      // Full ValidationError objects from class-validator
      (rawErrors as ValidationError[]).forEach((error) => {
        if (error.constraints) {
          formatted[error.property] = Object.values(error.constraints);
        } else if (error.children?.length) {
          const childResult = this.formatValidationErrors(error.children);
          formatted[error.property] = childResult.fields as any; // simplified
        }
      });
    }

    return {
      fields: formatted,
      count: Object.keys(formatted).length,
    };
  }
}
