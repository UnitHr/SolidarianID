import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';

export class UserCreatedEvent extends DomainEvent {
  constructor(public readonly userId: string) {
    super('UserCreated');
  }
}
