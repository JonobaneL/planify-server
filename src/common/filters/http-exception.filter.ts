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
    else if (this.isValidationError(originalResponse)) {
      errorBody = {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: this.formatValidationDetails(originalResponse),
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

  private isValidationError(resp: any): boolean {
    if (!resp || typeof resp !== 'object') return false;
    return resp.error === 'Bad Request' || Array.isArray(resp.message);
  }

  private formatValidationDetails(response: any) {
    const message = response.message;

    if (!Array.isArray(message)) {
      return { message };
    }

    // Check if it's array of ValidationError objects or flat strings
    if (
      message.length > 0 &&
      typeof message[0] === 'object' &&
      message[0] !== null
    ) {
      return this.formatValidationErrors(message as ValidationError[]);
    } else {
      // Flat string array
      return this.groupFlatValidationMessages(message as string[]);
    }
  }

  // Groups flat string messages by trying to infer field names (heuristic)
  private groupFlatValidationMessages(messages: string[]) {
    const fields: Record<string, string[]> = {};
    const general: string[] = [];

    messages.forEach((msg) => {
      // Try to extract field name from message (e.g. "color should not be empty")
      const match = msg.match(/^(\w+)\s/);
      const field = match ? match[1] : '';

      if (field) {
        if (!fields[field]) fields[field] = [];
        fields[field].push(msg);
      } else {
        general.push(msg);
      }
    });

    if (general.length > 0) {
      fields['general'] = general;
    }

    return {
      fields,
      count: messages.length,
    };
  }

  private formatValidationErrors(errors: ValidationError[]) {
    const fields: Record<string, string[]> = {};

    errors.forEach((error) => {
      if (error.constraints) {
        fields[error.property] = Object.values(error.constraints);
      } else if (error.children?.length) {
        const child = this.formatValidationErrors(error.children);
        fields[error.property] = child.fields as any;
      }
    });

    return {
      fields,
      count: Object.keys(fields).length,
    };
  }

  // Other helpers
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
    return (response as any).details || response;
  }
}
