import { Entity } from '@common-lib/common-lib/core/domain/Entity';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { MissingPropertiesError } from '@common-lib/common-lib/core/exceptions';
import { ActivityType } from '@users-ms/history/domain';

interface NotificationProps {
  userId: UniqueEntityID;
  primaryEntityId: UniqueEntityID;
  activityType: ActivityType;
  secondaryEntityId?: UniqueEntityID;
  read: boolean;
  historyEntryId: UniqueEntityID;
  timestamp?: Date;
}

export class Notification extends Entity<NotificationProps> {
  get id(): UniqueEntityID {
    return this._id;
  }

  get userId(): UniqueEntityID {
    return this.props.userId;
  }

  get historyEntryId(): UniqueEntityID {
    return this.props.historyEntryId;
  }

  get primaryEntityId(): UniqueEntityID {
    return this.props.primaryEntityId;
  }

  get activityType(): ActivityType {
    return this.props.activityType;
  }

  get secondaryEntityId(): UniqueEntityID | undefined {
    return this.props.secondaryEntityId;
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
    if (!props.userId || !props.historyEntryId || !props.primaryEntityId) {
      throw new MissingPropertiesError(
        'Missing required properties for Notification',
      );
    }
  }
}
