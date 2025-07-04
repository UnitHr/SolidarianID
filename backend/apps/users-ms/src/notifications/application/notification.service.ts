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
    timestamp?: Date,
  ): Promise<void>;

  abstract createNotificationForRelatedEntity(
    historyEntryId: string,
    relatedEntityId: string,
    timestamp?: Date,
  ): Promise<void>;

  abstract createNotificationsForPlatformAdmins(
    historyEntryId: string,
    timestamp?: Date,
  ): Promise<void>;
}
