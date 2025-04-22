import { Entity } from '@common-lib/common-lib/core/domain/Entity';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { MissingPropertiesError } from '@common-lib/common-lib/core/exceptions';
import { HistoryEntry } from '@users-ms/history/domain';

interface NotificationProps {
  recipientId: UniqueEntityID;
  historyEntryId: UniqueEntityID;
  historyEntry?: HistoryEntry;
  read: boolean;
  timestamp?: Date;
}

export class Notification extends Entity<NotificationProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get recipientId(): UniqueEntityID {
    return this.props.recipientId;
  }

  get historyEntryId(): UniqueEntityID {
    return this.props.historyEntryId;
  }

  get historyEntry(): HistoryEntry | undefined {
    return this.props.historyEntry;
  }

  get read(): boolean {
    return this.props.read;
  }

  get timestamp(): Date {
    return this.props.timestamp;
  }

  markAsRead(): void {
    if (!this.props.read) {
      this.props.read = true;
    }
  }

  public static create(
    props: NotificationProps,
    id?: UniqueEntityID,
  ): Notification {
    this.validateProps(props);

    const notification = new Notification(
      {
        ...props,
        read: props.read ?? false,
        timestamp: props.timestamp ?? new Date(),
      },
      id,
    );

    return notification;
  }

  private static validateProps(props: NotificationProps): void {
    if (!props.recipientId || !props.historyEntryId) {
      throw new MissingPropertiesError(
        'Missing required properties for Notification',
      );
    }
  }
}
