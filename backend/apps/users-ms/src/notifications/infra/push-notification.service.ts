import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PushNotificationService {
  private readonly logger = new Logger(PushNotificationService.name);

  async sendPushNotification(userId: string): Promise<void> {
    try {
      await fetch(`${process.env.PUSH_SERVER_URL}/sendNotification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          userId,
          payload: JSON.stringify({
            title: 'New Notification',
            body: 'You have a new notification.',
          }),
          ttl: 86400,
          delay: 0,
        }),
      });
    } catch (error) {
      this.logger.error(`Error sending push notification.`, error.message);
    }
  }
}
