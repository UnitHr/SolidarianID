import { Module } from '@nestjs/common';
import { CassandraModule } from 'cassandra-for-nest';

// Persistence entities
import {
  OdsCommunity,
  OdsStatistics,
} from './ods-statistics/infra/persistence';
import { CommunityStatistics } from './community-statistics/infra/persistence';

// Repositories
import OdsStatisticsRepository from './ods-statistics/infra/ods-statistics.repository.cassandra';
import OdsCommunityRepository from './ods-statistics/infra/ods-community.repository.cassandra';
import CommunityStatisticsRepository from './community-statistics/infra/community-statistics.repository.cassandra';

// Services and implementations
import { OdsStatisticsService } from './ods-statistics/application/ods-statistics.service';
import { OdsStatisticsServiceImpl } from './ods-statistics/application/ods-statistics.service.impl';
import { CommunityStatisticsService } from './community-statistics/application/community-statistics.service';
import { CommunityStatisticsServiceImpl } from './community-statistics/application/community-statistics.service.impl';

// Controllers
import { PlatformStatisticsController } from './platform-statistics.controller';

@Module({
  imports: [
    // Cassandra entities for ODS and Community Statistics
    CassandraModule.forFeature([OdsStatistics]),
    CassandraModule.forFeature([OdsCommunity]),
    CassandraModule.forFeature([CommunityStatistics]),
  ],
  providers: [
    // ODS Statistics Repositories
    OdsStatisticsRepository,
    OdsCommunityRepository,
    {
      provide: OdsStatisticsService,
      useClass: OdsStatisticsServiceImpl,
    },

    // Community Statistics Repositories
    CommunityStatisticsRepository,
    {
      provide: CommunityStatisticsService,
      useClass: CommunityStatisticsServiceImpl,
    },
  ],
  controllers: [PlatformStatisticsController],
  exports: [OdsStatisticsService, CommunityStatisticsService],
})
export class PlatformStatisticsModule {}
