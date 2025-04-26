import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { FollowersModule } from '@users-ms/followers/followers.module';
import { HistoryEntry } from './infra/persistence/HistoryEntry';
import { HistoryEntryRepository } from './history-entry.repository';
import { HistoryEntryRepositoryTypeorm } from './infra/history-entry.repository.typeorm';
import { HistoryService } from './application/history.service';
import { HistoryServiceImpl } from './application/history.service.impl';
import { UserFollowedHandler } from './domain/events/user-followed.handler';
import { HistoryEventsController } from './application/history-events.controller';
import { HistoryController } from './application/history.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([HistoryEntry]),
    CqrsModule,
    FollowersModule,
  ],
  providers: [
    {
      provide: HistoryEntryRepository,
      useClass: HistoryEntryRepositoryTypeorm,
    },
    {
      provide: HistoryService,
      useClass: HistoryServiceImpl,
    },
    UserFollowedHandler,
  ],
  controllers: [HistoryEventsController, HistoryController],
  exports: [HistoryService],
})
export class HistoryModule {}
