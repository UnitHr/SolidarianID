import { NotificationModel } from '../models/notification.model';

export abstract class NotificationService {
  abstract publishNewNotification(
    notification: NotificationModel,
  ): Promise<void>;
}
