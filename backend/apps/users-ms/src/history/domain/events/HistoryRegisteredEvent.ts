import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';
import { ActivityType } from '../ActivityType';

export class HistoryRegisteredEvent extends DomainEvent {
  constructor(
    public readonly historyEntryId: string,
    public readonly userId: string,
    public readonly activityType: ActivityType,
    public readonly entityId: string,
    public readonly date: Date,
  ) {
    super(HistoryRegisteredEvent.name, date);
  }
}
