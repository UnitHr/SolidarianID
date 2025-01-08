import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';

export class ActionContributedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly actionId: string,
    public readonly amount: number,
    public readonly unit: string,
  ) {
    super('ActionContributed');
  }
}
