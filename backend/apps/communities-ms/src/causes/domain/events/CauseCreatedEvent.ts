import { ODSEnum } from '@common-lib/common-lib/common/ods';
import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';

export class CauseCreatedEvent extends DomainEvent {
  constructor(
    public readonly userId: string,
    public readonly causeId: string,
    public readonly causeName: string,
    public readonly ods: ODSEnum[],
  ) {
    super(CauseCreatedEvent.name);
  }
}
