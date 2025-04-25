import { Repository } from '@common-lib/common-lib/core/repository';
import { Notification } from './Notification';

export abstract class NotificationRepository extends Repository<Notification> {
  abstract findByUserId(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<Notification[]>;

  abstract countByUserId(userId: string): Promise<number>;

  abstract markAsRead(userId: string, notificationId: string): Promise<void>;

  abstract createMany(notifications: Notification[]): Promise<Notification[]>;
}
