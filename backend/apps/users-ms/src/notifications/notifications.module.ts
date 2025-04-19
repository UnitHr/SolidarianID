import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FollowersModule } from '@users-ms/followers/followers.module';
import { Notification } from './infra/persistence/Notification';
import { NotificationRepository } from './domain/notification.repository';
import { NotificationRepositoryTypeorm } from './infra/notification.repository.typeorm';
import { NotificationService } from './application/notification.service';
import { NotificationServiceImpl } from './application/notification.service.impl';
import { HistoryRegisteredHandler } from './domain/events/history-registered.handler';
import { NotificationController } from './application/notification.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Notification]), FollowersModule],
  providers: [
    {
      provide: NotificationRepository,
      useClass: NotificationRepositoryTypeorm,
    },
    {
      provide: NotificationService,
      useClass: NotificationServiceImpl,
    },
    HistoryRegisteredHandler,
  ],
  exports: [NotificationService],
  controllers: [NotificationController],
})
export class NotificationsModule {}
