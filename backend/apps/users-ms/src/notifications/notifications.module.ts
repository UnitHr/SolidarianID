import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from '@common-lib/common-lib/events/events.module';
import { FollowersModule } from '@users-ms/followers/followers.module';
import { UserModule } from '@users-ms/users/user.module';
import { Notification } from './infra/persistence/Notification';
import { NotificationRepositoryTypeorm } from './infra/notification.repository.typeorm';
import { NotificationService } from './application/notification.service';
import { NotificationServiceImpl } from './application/notification.service.impl';
import { HistoryRegisteredHandler } from './domain/events/history-registered.handler';
import { NotificationController } from './application/notification.controller';
import { NotificationRepository } from './notification.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    FollowersModule,
    EventsModule,
    UserModule,
  ],
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
