import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';
import { ActionType } from '@communities-ms/actions/domain/ActionType';

export class ActionCreatedEvent extends DomainEvent {
  public static readonly EVENT_TYPE = 'action-created';

  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly causeId: string,
    public readonly communityId: string,
    public readonly target: number,
    public readonly actionType: ActionType,
    public readonly title: string,
  ) {
    super(ActionCreatedEvent.name);
  }
}
