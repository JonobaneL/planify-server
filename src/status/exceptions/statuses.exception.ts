import { BusinessRuleException } from '@common/exceptions/business.exception';
import { HttpStatus } from '@nestjs/common';

export class MaxStatusesReachedException extends BusinessRuleException {
  constructor(max: number, type?: string) {
    super(
      'MAX_STATUSES_REACHED',
      `Cannot create more than ${max} statuses${type ? ` of type "${type}"` : ''}`,
      { maxAllowed: max, type: type },
      HttpStatus.CONFLICT,
    );
  }
}

export class StatusNotFound extends BusinessRuleException {
  constructor(id: string) {
    super(
      'STATUS_NOT_FOUND',
      `Status with id "${id}" not found`,
      { id },
      HttpStatus.NOT_FOUND,
    );
  }
}

export class NoProperty extends BusinessRuleException {
  constructor() {
    super('NO_PROPERTIES_PROVIDED', `No properties provided for update`);
  }
}
