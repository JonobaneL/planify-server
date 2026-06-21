import { HttpException, HttpStatus } from '@nestjs/common';

export class BusinessRuleException extends HttpException {
  constructor(
    public readonly code: string,
    message?: string,
    description?: string | object,
    status: HttpStatus = HttpStatus.BAD_REQUEST, // default is 400
  ) {
    super(
      {
        code,
        message: message || 'Business rule violation',
        ...(description && { details: description }),
      },
      status,
    );
  }
}
