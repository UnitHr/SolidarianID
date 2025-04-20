import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';

export class UserJoinedCommunity extends DomainEvent {
  public static readonly EVENT_TYPE = 'user-joined-community';

  constructor(
    public readonly userId: string,
    public readonly communityId: string,
    public readonly communityName: string,
  ) {
    super(UserJoinedCommunity.name);
  }
}
