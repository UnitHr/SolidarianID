import { ActivityType } from '@users-ms/history/domain';
import { Notification } from '../domain/Notification';

export abstract class NotificationService {
  abstract getUserNotifications(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<{ notifications: Notification[]; total: number }>;

  abstract markAsRead(userId: string, notificationId: string): Promise<void>;

  abstract createNotificationsForFollowers(
    historyEntryId: string,
    userId: string,
    activityType: ActivityType,
    entityId: string,
    timestamp?: Date,
  ): Promise<void>;
}
