import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';

export class UserFollowedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly followedUserId: string,
    public readonly followedUserEmail: string,
    public readonly date: Date,
  ) {
    super(UserFollowedEvent.name, date);
  }
}
