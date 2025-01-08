import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';

export class UserFollowedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly followedUserId: string,
  ) {
    super('UserFollowed');
  }
}
