import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';

export class ActionContributedEvent extends DomainEvent {
  public static readonly TOPIC = 'action-contributed';

  constructor(
    public readonly userId: string,
    public readonly communityId: string,
    public readonly actionId: string,
    public readonly causeId: string,
    public readonly amount: number,
    public readonly unit: string,
  ) {
    super(ActionContributedEvent.name);
  }
}
