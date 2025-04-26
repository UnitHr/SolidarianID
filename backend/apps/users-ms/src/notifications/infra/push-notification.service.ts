import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PushNotificationService {
  private readonly logger = new Logger(PushNotificationService.name);

  // eslint-disable-next-line consistent-return
  private async getUserSubscription(userId: string) {
    try {
      const subscriptionResponse = await fetch(
        `${process.env.PUSH_SERVER_URL}/subscription/${userId}`,
      );

      if (subscriptionResponse.ok) {
        this.logger.log(`Checking subscription for user ID: ${userId}.`);
        return await subscriptionResponse.json();
      }
    } catch (error) {
      this.logger.error(
        `Error getting subscription for user ID: ${userId}.`,
        error,
      );
      return null;
    }
  }

  async sendPushNotification(userId: string): Promise<void> {
    const subscription = await this.getUserSubscription(userId);

    if (subscription.isSubscribed) {
      try {
        await fetch(`${process.env.PUSH_SERVER_URL}/sendNotification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            subscription: subscription.subscription,
            payload: `New notification`,
            ttl: 86400,
          }),
        });
      } catch (error) {
        this.logger.error(`Error sending push notification.`, error);
      }
    }
  }
}
