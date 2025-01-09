import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';

export class JoinCommunityRequestCreatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly communityId: string,
    public readonly status: string,
  ) {
    super(JoinCommunityRequestCreatedEvent.name);
  }
}
