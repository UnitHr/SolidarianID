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

  async createNotificationsForFollowers(
    historyEntryId: string,
    userId: string,
    activityType: ActivityType,
    entityId: string,
    timestamp: Date,
  ): Promise<void> {
    const followers = await this.followerService.getUserFollowers(userId);

    const notifications = followers.map((follower) =>
      Notification.create({
        historyEntryId: new UniqueEntityID(historyEntryId),
        userId: follower.followerId,
        activityType,
        entityId: new UniqueEntityID(entityId),
        read: false,
        timestamp,
      }),
    );

    if (notifications.length > 0) {
      await this.notificationRepository.createMany(notifications);
    }
  }
}
