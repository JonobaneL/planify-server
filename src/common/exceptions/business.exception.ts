import { BadRequestException } from '@nestjs/common';

export class BusinessRuleException extends BadRequestException {
  constructor(
    public readonly code: string,
    message?: string,
    description?: string | object,
  ) {
    super({
      code,
      message: message || 'Business rule violation',
      ...(description && { details: description }),
    });
  }
}
