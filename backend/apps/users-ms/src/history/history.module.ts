import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { History, HistoryEntry } from './infra/persistence';
import { HistoryRepositoryTypeOrm } from './infra/history.repository.typeorm';
import { HistoryRepository } from './history.repository';
import { HistoryService } from './application/history.service';
import { HistoryServiceImpl } from './application/history.service.impl';
import { UserCreatedHandler } from './domain/events/user-created.handler';
import { UserFollowedHandler } from './domain/events/user-followed.handler';
import { HistoryController } from './application/history.controller';

@Module({
  imports: [TypeOrmModule.forFeature([History, HistoryEntry])],
  controllers: [HistoryController],
  providers: [
    { provide: HistoryRepository, useClass: HistoryRepositoryTypeOrm },
    { provide: HistoryService, useClass: HistoryServiceImpl },
    UserCreatedHandler,
    UserFollowedHandler,
  ],
  exports: [HistoryService],
})
export class HistoryModule {}
