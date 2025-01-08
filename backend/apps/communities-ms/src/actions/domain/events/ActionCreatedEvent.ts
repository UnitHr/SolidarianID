import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';
import { ActionType } from '../ActionType';

export class ActionCreatedEvent extends DomainEvent {
  constructor(
    public readonly id: string,
    public readonly actionType: ActionType,
    public readonly title: string,
  ) {
    super('ActionCreated');
  }
}
