import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';

export class CauseSupportedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly causeId: string,
    public readonly communityId: string,
  ) {
    super(CauseSupportedEvent.name);
  }
}
