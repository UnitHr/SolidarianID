import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';

export class CommunityCreatedEvent extends DomainEvent {
  public static readonly EVENT_TYPE = 'community-created';

  constructor(
    public readonly adminId: string,
    public readonly communityId: string,
    public readonly communityName: string,
    public readonly name: string,
    public readonly description: string,
  ) {
    super(CommunityCreatedEvent.name);
  }
}
