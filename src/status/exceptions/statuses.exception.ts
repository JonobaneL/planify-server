import { BusinessRuleException } from '@common/exceptions/business.exception';

export class MaxStatusesReachedException extends BusinessRuleException {
  constructor(max: number, type?: string) {
    super(
      'MAX_STATUSES_REACHED',
      `Cannot create more than ${max} statuses${type ? ` of type "${type}"` : ''}`,
      { maxAllowed: max, currentType: type },
    );
  }
}

export class StatusNotFound extends BusinessRuleException {
  constructor(id: string) {
    super('STATUS_NOT_FOUND', `Status with id "${id}" not found`, { id });
  }
}
