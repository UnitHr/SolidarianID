import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';

export class UserJoinedCommunity extends DomainEvent {
  public static readonly TOPIC = 'user-joined-community';

  constructor(
    public readonly userId: string,
    public readonly communityId: string,
  ) {
    super(UserJoinedCommunity.name);
  }
}
