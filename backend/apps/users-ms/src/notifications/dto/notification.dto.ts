import { ActivityType } from '@users-ms/history/domain';

export class NotificationDto {
  id: string;

  userId: string;

  activityType: ActivityType;

  entityId: string;

  read: boolean;

  historyEntryId: string;

  timestamp: Date;
}
