import { BusinessRuleException } from '@common/exceptions/business.exception';

export class ProjectNotFound extends BusinessRuleException {
  constructor(id: string) {
    super('PROJECT_NOT_FOUND', `Project with id "${id}" not found`, { id });
  }
}
