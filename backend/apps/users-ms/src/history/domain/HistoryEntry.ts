import { EntityRoot } from '@common-lib/common-lib/core/domain/EntityRoot';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { MissingPropertiesError } from '@common-lib/common-lib/core/exceptions';
import { ActivityType } from './ActivityType';
import { EntryStatus } from './HistoryEntryStatus';
import { HistoryRegisteredEvent } from './events/HistoryRegisteredEvent';

interface HistoryEntryProps {
  userId: UniqueEntityID;
  type: ActivityType;
  entityId: UniqueEntityID;
  timestamp?: Date;
  status?: EntryStatus;
  metadata?: {
    adminId?: string;
    entityName?: string;
    description?: string;
    amount?: number;
    volunteerHours?: number;
    location?: string;
    role?: string;
  };
}

export class HistoryEntry extends EntityRoot<HistoryEntryProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get userId(): UniqueEntityID {
    return this.props.userId;
  }

  get type(): ActivityType {
    return this.props.type;
  }

  get entityId(): UniqueEntityID {
    return this.props.entityId;
  }

  get timestamp(): Date {
    return this.props.timestamp;
  }

  get status(): EntryStatus | undefined {
    return this.props.status;
  }

  set status(status: EntryStatus) {
    this.props.status = status;
  }

  get metadata(): HistoryEntryProps['metadata'] {
    return this.props.metadata;
  }

  public static create(
    props: HistoryEntryProps,
    id?: UniqueEntityID,
  ): HistoryEntry {
    this.validateProps(props);
    const historyEntry = new HistoryEntry(
      {
        ...props,
        timestamp: props.timestamp ?? new Date(),
      },
      id,
    );
    historyEntry.apply(
      new HistoryRegisteredEvent(
        historyEntry.id.toString(),
        historyEntry.userId.toString(),
        historyEntry.type,
        historyEntry.entityId.toString(),
      ),
    );
    return historyEntry;
  }

  private static validateProps(props: HistoryEntryProps): void {
    if (!props.type || !props.entityId || !props.userId) {
      throw new MissingPropertiesError(
        'Missing required properties for HistoryEntry',
      );
    }
  }
}
