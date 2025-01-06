import { Module } from '@nestjs/common';
import { CassandraModule } from 'cassandra-for-nest';
import { CommunityStatisticsServiceImpl } from './application/community-statistics.service.impl';
import { CommunityStatisticsService } from './application/community-statistics.service';
import CommunityStatisticsRepository from './infra/community-statistics.repository.cassandra';
import * as Persistence from './infra/persistence';

@Module({
  imports: [
    // Load entity for Cassandra
    CassandraModule.forFeature([Persistence.CommunityStatistics]),
  ],
  providers: [
    // Provide repository for Cassandra
    CommunityStatisticsRepository,
    // Provide service
    {
      provide: CommunityStatisticsService,
      useClass: CommunityStatisticsServiceImpl,
    },
  ],
  exports: [CommunityStatisticsService],
})
export class CommunityStatisticsModule {}
