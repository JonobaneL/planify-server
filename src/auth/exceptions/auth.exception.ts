import { BusinessRuleException } from '@common/exceptions/business.exception';

export class UserNotFound extends BusinessRuleException {
  constructor(email: string) {
    super('USER_NOT_FOUND', `User with email "${email}" does not exist`, {
      email,
    });
  }
}
export class InvalidPassword extends BusinessRuleException {
  constructor() {
    super('INVALID_PASSWORD', 'Invalid password', {});
  }
}
