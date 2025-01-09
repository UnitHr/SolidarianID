import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { CassandraModule } from 'cassandra-for-nest';
import { CommunityReportsController } from './application/community-reports.controller';
import { CommunityReportsService } from './application/community-reports.service';
import { CommunityReportsServiceImpl } from './application/community-reports.service.impl';
import CommunityByCommunityIdRepository from './infra/community-by-community-id.repository.cassandra';
import CauseByCommunityIdRepository from './infra/cause-by-community-id.repository.cassandra';
import ActionByCauseIdRepository from './infra/action-by-cause-id.repository.cassandra';
import { CommunityReportsExceptionFilter } from './infra/filters/community-reports-domain-exception.filter';
import * as Persistence from './infra/persistence';

@Module({
  imports: [
    // Load entity for Cassandra
    CassandraModule.forFeature([
      Persistence.CommunityByCommunityId,
      Persistence.CauseByCommunityId,
      Persistence.ActionByCauseId,
    ]),
  ],
  providers: [
    // Provide repositories for Cassandra
    CommunityByCommunityIdRepository,
    CauseByCommunityIdRepository,
    ActionByCauseIdRepository,

    // Provide service
    {
      provide: CommunityReportsService,
      useClass: CommunityReportsServiceImpl,
    },

    // Provide exception filter
    {
      provide: APP_FILTER,
      useClass: CommunityReportsExceptionFilter,
    },
  ],
  controllers: [CommunityReportsController],
})
export class CommunityReportsModule {}
