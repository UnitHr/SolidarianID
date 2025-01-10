import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';

export class CauseSupportedEvent extends DomainEvent {
  public static readonly TOPIC = 'cause-supported';

  constructor(
    public readonly userId: string,
    public readonly causeId: string,
    public readonly communityId: string,
    public readonly ods: ODSEnum[],
  ) {
    super(CauseSupportedEvent.name);
  }
}
