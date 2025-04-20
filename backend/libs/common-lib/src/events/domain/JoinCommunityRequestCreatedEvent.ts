import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';

export class JoinCommunityRequestCreatedEvent extends DomainEvent {
  public static readonly EVENT_TYPE = 'join-community-request-created';

  constructor(
    public readonly userId: string,
    public readonly communityId: string,
    public readonly communityName: string,
    public readonly adminId: string,
  ) {
    super(JoinCommunityRequestCreatedEvent.name);
  }
}
