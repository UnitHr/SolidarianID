import { BaseDomainError } from '@common-lib/common-lib/core/exceptions/base-domain.error';
import { ActionType } from '../domain/ActionType';

export class InvalidActionTypeError extends BaseDomainError {
  constructor(type: string) {
    const validTypes = Object.values(ActionType).join(', ');
    super(
      `The type "${type}" is not valid. Valid action types are: ${validTypes}.`,
    );
  }
}
