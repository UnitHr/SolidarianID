import { Injectable, Logger } from '@nestjs/common';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { FollowerService } from '@users-ms/followers/application/follower.service';
import { NotificationCreatedEvent } from '@common-lib/common-lib/events/domain/NotificationCreatedEvent';
import { EventsService } from '@common-lib/common-lib/events/events.service';
import { Follower } from '@users-ms/followers/domain';
import { UserService } from '@users-ms/users/application/user.service';
import { Role } from '@common-lib/common-lib/auth/role/role.enum';
import { NotificationService } from './notification.service';
import { Notification } from '../domain/Notification';
import { NotificationRepository } from '../notification.repository';

@Injectable()
export class NotificationServiceImpl implements NotificationService {
  private readonly logger = new Logger(NotificationServiceImpl.name);

  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly followerService: FollowerService,
    private readonly usersService: UserService,
    private readonly eventsService: EventsService,
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

  async createNotificationsForCommunityAdmins(
    historyEntryId: string,
    timestamp?: Date,
  ): Promise<void> {
    const admins = await this.usersService.findUsersByRole(Role.ADMIN);
    const notifications = admins.map((admin) => {
      return Notification.create({
        historyEntryId: new UniqueEntityID(historyEntryId),
        recipientId: admin.id,
        read: false,
        timestamp,
      });
    });

    const createdNotifications =
      await this.notificationRepository.createMany(notifications);

    await Promise.all(
      createdNotifications.map((notification) =>
        this.publishNotificationCreatedEvent(notification),
      ),
    );
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

      const notifications = await this.notificationRepository.createMany(batch);

      // Publish notification created events
      await Promise.all(
        notifications.map((notification) =>
          this.publishNotificationCreatedEvent(notification),
        ),
      );

      // Check push subscription and send push notifications
      await this.sendPushNotificationsToFollowers(followers, userId);

      // Check if we've processed all followers
      if (followers.length < pageSize || page * pageSize >= total) {
        hasMoreFollowers = false;
      } else {
        page += 1;
      }
    }
  }
  /* eslint-enable no-await-in-loop */

  // TODO: consider creating a separate service for event publishing
  private async publishNotificationCreatedEvent(
    notification: Notification,
  ): Promise<void> {
    try {
      const notificationEvent = new NotificationCreatedEvent(
        notification.id.toString(),
        notification.read,
        notification.timestamp,
        notification.recipientId.toString(),
        notification.historyEntry?.type,
        notification.historyEntry?.entityId.toString(),
        notification.historyEntry?.entityName,
      );
      this.logger.debug(
        `Publishing notification event for recipient ${notification.recipientId}`,
      );

      await this.eventsService.publish(
        NotificationCreatedEvent.EVENT_TYPE,
        notificationEvent,
      );

      this.logger.log(
        `Published notification event for recipient ${notification.recipientId}`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to publish notification event: ${error.message}`,
        error.stack,
      );
    }
  }

  private async sendPushNotificationsToFollowers(
    followers: Follower[],
    userId: string,
  ): Promise<void> {
    followers.map(async (follower) => {
      try {
        const subscriptionResponse = await fetch(
          `http://localhost:4000/push/subscription/${follower.followerId}`,
        );

        if (subscriptionResponse.ok) {
          this.logger.log(
            `Comprobando la suscripción del seguidor con ID: ${follower.followerId}.`,
          );
          const { isSubscribed, subscription } =
            await subscriptionResponse.json();

          if (isSubscribed) {
            this.logger.log(
              `El seguidor con ID: ${follower.followerId} está suscrito.`,
            );

            // Send push notification
            try {
              await fetch('http://localhost:4000/push/sendNotification', {
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
              });
            } catch (error) {
              this.logger.error(
                `Error sending push notification to follower with ID: ${follower.followerId}.`,
                error,
              );
            }
          }
        }
      } catch (error) {
        this.logger.error(
          `Error getting the subscription from user: ${follower.followerId}.`,
          error,
        );
      }
    });
  }
}
