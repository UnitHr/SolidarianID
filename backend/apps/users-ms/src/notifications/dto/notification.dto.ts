import { ActivityType } from '@users-ms/history/domain';

export class NotificationDto {
  id: string;

  userId: string;

  primaryEntityId: string;

  activityType: ActivityType;

  secondaryEntityId?: string;

  read: boolean;

  historyEntryId: string;

  timestamp: Date;
}
