import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';

export class UserJoinedCommunity extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly communityId: string,
  ) {
    super(UserJoinedCommunity.name);
  }
}
