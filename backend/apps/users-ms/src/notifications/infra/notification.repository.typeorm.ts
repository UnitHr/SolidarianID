import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository as TypeOrmRepository } from 'typeorm';
import { EntityNotFoundError } from '@common-lib/common-lib/core/exceptions/entity-not-found.error';
import { PaginationDefaults } from '@common-lib/common-lib/common/enum';
import { Notification as DomainNotification } from '../domain/Notification';
import { NotificationRepository } from '../domain/notification.repository';
import { Notification } from './persistence/Notification';
import { NotificationMapper } from '../notification.mapper';

@Injectable()
export class NotificationRepositoryTypeorm extends NotificationRepository {
  constructor(
    @InjectRepository(Notification)
    private readonly notificationRepository: TypeOrmRepository<Notification>,
  ) {
    super();
  }

  async save(entity: DomainNotification): Promise<DomainNotification> {
    const persistenceEntity = await this.notificationRepository.save(
      NotificationMapper.toPersistence(entity),
    );
    return NotificationMapper.toDomain(persistenceEntity);
  }

  async findById(id: string): Promise<DomainNotification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
      relations: ['historyEntry'],
    });

    if (!notification) {
      throw new EntityNotFoundError(`Notification with id ${id} not found`);
    }
    return NotificationMapper.toDomain(notification);
  }

  async findByUserId(
    userId: string,
    page: number = PaginationDefaults.DEFAULT_PAGE,
    limit: number = PaginationDefaults.DEFAULT_LIMIT,
  ): Promise<DomainNotification[]> {
    const notifications = await this.notificationRepository.find({
      where: { recipientId: userId },
      relations: ['historyEntry'],
      skip: (page - 1) * limit,
      take: limit,
      order: { timestamp: 'DESC' },
    });
    return notifications.map(NotificationMapper.toDomain);
  }

  async countByUserId(userId: string): Promise<number> {
    return this.notificationRepository.count({
      where: { recipientId: userId },
    });
  }

  async markAsRead(userId: string, notificationId: string): Promise<void> {
    const notification = await this.notificationRepository.findOne({
      where: { id: notificationId, recipientId: userId },
    });

    if (!notification) {
      throw new EntityNotFoundError(
        `Notification with id ${notificationId} for user ${userId} not found`,
      );
    }

    notification.read = true;
    await this.notificationRepository.save(notification);
  }

  async createMany(notifications: DomainNotification[]): Promise<void> {
    const persistenceNotifications = notifications.map(
      NotificationMapper.toPersistence,
    );
    await this.notificationRepository.save(persistenceNotifications);
  }
}
