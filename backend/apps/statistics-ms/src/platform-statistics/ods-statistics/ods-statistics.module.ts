import { Module } from '@nestjs/common';
import { CassandraModule } from 'cassandra-for-nest';
import { OdsStatisticsService } from './application/ods-statistics.service';
import { OdsStatisticsServiceImpl } from './application/ods-statistics.service.impl';
import OdsStatisticsRepository from './infra/ods-statistics.repository.cassandra';
import * as Persistence from './infra/persistence';

@Module({
  imports: [
    // Load entity for Cassandra
    CassandraModule.forFeature([Persistence.OdsStatistics]),
  ],
  providers: [
    // Provide repository for Cassandra
    OdsStatisticsRepository,
    // Provide service
    {
      provide: OdsStatisticsService,
      useClass: OdsStatisticsServiceImpl,
    },
  ],
  exports: [OdsStatisticsService],
})
export class OdsStatisticsModule {}
