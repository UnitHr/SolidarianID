import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';

export class CreateCommunityRequestEvent extends DomainEvent {
  public static readonly EVENT_TYPE = 'create-community-request-sent';

  constructor(
    public readonly userId: string,
    public readonly requestId: string,
    public readonly communityName: string,
    public readonly date: Date = new Date(),
  ) {
    super(CreateCommunityRequestEvent.name, date);
  }
}
