import { Entity } from '@common-lib/common-lib/core/domain/Entity';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { MissingPropertiesError } from '@common-lib/common-lib/core/exceptions';
import { HistoryEntryType } from './HistoryEntryType';
import { HistoryEntryStatus } from './HistoryEntryStatus';

interface HistoryEntryProps {
  type: HistoryEntryType;
  entityId: UniqueEntityID;
  timestamp?: Date;
  status?: HistoryEntryStatus;
}

export class HistoryEntry extends Entity<HistoryEntryProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get type(): HistoryEntryType {
    return this.props.type;
  }

  get entityId(): UniqueEntityID {
    return this.props.entityId;
  }

  get timestamp(): Date {
    return this.props.timestamp;
  }

  get status(): HistoryEntryStatus {
    return this.props.status;
  }

  public static create(
    props: HistoryEntryProps,
    id?: UniqueEntityID,
  ): HistoryEntry {
    this.validateProps(props);
    return new HistoryEntry(
      { ...props, timestamp: props.timestamp ?? new Date() },
      id,
    );
  }

  private static validateProps(props: HistoryEntryProps): void {
    if (!props.type || !props.entityId) {
      throw new MissingPropertiesError(
        'Missing required properties for HistoryEntry',
      );
    }
  }
}
