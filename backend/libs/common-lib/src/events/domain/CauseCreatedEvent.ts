import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';

export class CauseCreatedEvent extends DomainEvent {
  public static readonly EVENT_TYPE = 'cause-created';

  constructor(
    public readonly userId: string,
    public readonly communityId: string,
    public readonly causeId: string,
    public readonly causeName: string,
    public readonly ods: ODSEnum[],
  ) {
    super(CauseCreatedEvent.name);
  }
}
