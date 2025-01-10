import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HistoryEntry } from './infra/persistence/HistoryEntry';
import { HistoryEntryRepository } from './domain/history-entry.repository';
import { HistoryEntryRepositoryTypeorm } from './infra/history-entry.repository.typeorm';
import { HistoryService } from './application/history.service';
import { HistoryServiceImpl } from './application/history.service.impl';
import { UserFollowedHandler } from './domain/events/user-followed.handler';
import { HistoryController } from './application/history.controller';

@Module({
  imports: [TypeOrmModule.forFeature([HistoryEntry])],
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
  controllers: [HistoryController],
  exports: [HistoryService],
})
export class HistoryModule {}
