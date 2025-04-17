import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';

export class JoinCommunityRequestRejectedEvent extends DomainEvent {
  public static readonly EVENT_TYPE = 'join-community-request-rejected';

  constructor(
    public readonly userId: string,
    public readonly communityId: string,
  ) {
    super(JoinCommunityRequestRejectedEvent.name);
  }
}
