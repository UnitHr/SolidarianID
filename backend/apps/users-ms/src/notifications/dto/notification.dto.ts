import { ActivityType } from '@users-ms/history/domain';

export class NotificationDto {
  id: string;

  read: boolean;

  timestamp: Date;

  // HistoryEntry related data
  userId?: string;

  type?: ActivityType;

  entityId?: string;

  entityName?: string;
}
