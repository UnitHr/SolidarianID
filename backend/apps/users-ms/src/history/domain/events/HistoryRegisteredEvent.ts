import { DomainEvent } from '@common-lib/common-lib/core/domain/DomainEvent';

export class HistoryRegisteredEvent extends DomainEvent {
  constructor(
    public readonly historyEntryId: string,
    public readonly userId: string,
    public readonly date: Date,
  ) {
    super(HistoryRegisteredEvent.name, date);
  }
}
