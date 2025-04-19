import { Injectable } from '@nestjs/common';
import { UniqueEntityID } from '@common-lib/common-lib/core/domain/UniqueEntityID';
import { ActivityType } from '@users-ms/history/domain';
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
    activityType: ActivityType,
    entityId: string,
    timestamp: Date,
  ): Promise<void> {
    const pageSize = 100;
    let page = 1;
    let totalNotified = 0;
    let totalFollowers: number;

    do {
      // 1. Fetch the current page
      const { followers, total } = await this.followerService.getUserFollowers(
        userId,
        page,
        pageSize,
      );

      // On the first iteration, store the total to know when to stop
      if (page === 1) {
        totalFollowers = total;
        if (followers.length === 0) {
          return;
        }
      }

      // 2. Create and persist the batch of notifications for these followers
      const batch = followers.map((f) =>
        Notification.create({
          historyEntryId: new UniqueEntityID(historyEntryId),
          userId: f.followerId,
          activityType,
          entityId: new UniqueEntityID(entityId),
          read: false,
          timestamp,
        }),
      );
      await this.notificationRepository.createMany(batch);

      totalNotified += followers.length;
      page += 1;
    } while (totalNotified < totalFollowers);
  }
  /* eslint-enable no-await-in-loop */
}
