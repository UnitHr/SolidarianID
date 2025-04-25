import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { FollowerService } from '@users-ms/followers/application/follower.service';
import { NotificationService } from './notification.service';
import { NotificationRepository } from '../domain/notification.repository';
import { Notification } from '../domain/Notification';

@Injectable()
export class NotificationServiceImpl implements NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly followerService: FollowerService,
  ) {}

  async getUserNotifications(
    userId: string,
    page?: number,
    limit?: number,
  ): Promise<{ notifications: Notification[]; total: number }> {
    const [notifications, total] = await Promise.all([
      this.notificationRepository.findByUserId(userId, page, limit),
      this.notificationRepository.countByUserId(userId),
    ]);

    return { notifications, total };
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    await this.notificationRepository.markAsRead(userId, notificationId);
  }

  /* eslint-disable no-await-in-loop */ // TODO: review if this could be improved, batch processing
  async createNotificationsForFollowers(
    historyEntryId: string,
    userId: string,
    timestamp: Date = new Date(),
  ): Promise<void> {
    const pageSize = 100;
    let page = 1;
    let hasMoreFollowers = true;

    while (hasMoreFollowers) {
      // Use pagination to process followers in batches
      const { followers, total } = await this.followerService.getUserFollowers(
        userId,
        page,
        pageSize,
      );

      if (followers.length === 0) {
        return;
      }

      // Create and persist the batch of notifications for these followers
      const batch = followers.map((f) => {
        return Notification.create({
          historyEntryId: new UniqueEntityID(historyEntryId),
          recipientId: f.followerId,
          read: false,
          timestamp,
        });
      });

      await this.notificationRepository.createMany(batch);


      // 3. Check push subscription and send push notifications
      // eslint-disable-next-line no-restricted-syntax
      for (const follower of followers) {
        try {
          const subscriptionResponse = await fetch(
            `http://localhost:4000/push/subscription/${follower.followerId}`,
          );

          if (subscriptionResponse.ok) {
            console.log(
              `Comprobando la suscripción del seguidor con ID: ${follower.followerId}.`,
            );
            const { isSubscribed, subscription } =
              await subscriptionResponse.json();

            if (isSubscribed) {
              console.log('user is subscribed');

              // Send push notification
              try {
                const response = await fetch(
                  'http://localhost:4000/push/sendNotification',
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                      subscription,
                      payload: `New notification from user: ${userId}`,
                      ttl: 86400,
                    }),
                  },
                );
              } catch (error) {
                console.error(
                  `Error sending push notification to follower with ID: ${follower.followerId}.`,
                  error,
                );
              }
            }
          }
        } catch (error) {
          console.error(
            `Error getting the subscription from user: ${follower.followerId}.`,
            error,
          );
        }
      }

      totalNotified += followers.length;
      page += 1;
    } while (totalNotified < totalFollowers);
      // Check if we've processed all followers
      if (followers.length < pageSize || page * pageSize >= total) {
        hasMoreFollowers = false;
      } else {
        page += 1;
      }
    }

  }
  /* eslint-enable no-await-in-loop */
}
