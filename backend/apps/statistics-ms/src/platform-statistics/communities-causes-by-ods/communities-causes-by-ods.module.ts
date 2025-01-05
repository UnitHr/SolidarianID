import { Module } from '@nestjs/common';
import { CassandraModule } from 'cassandra-for-nest';
import { CommunitiesCausesByOds } from './infra/persistence';
import { CommunitiesCausesByOdsService } from './application/communities-causes-by-ods.service';
import { CommunitiesCausesByOdsServiceImpl } from './application/communities-causes-by-ods.service.impl';
import CommunitiesCausesByOdsRepository from './infra/communities-causes-by-ods.repository.cassandra';

@Module({
  imports: [
    // Load entity for Cassandra
    CassandraModule.forFeature([CommunitiesCausesByOds]),
  ],
  providers: [
    // Provide repository for Cassandra
    CommunitiesCausesByOdsRepository,
    // Provide service
    {
      provide: CommunitiesCausesByOdsService,
      useClass: CommunitiesCausesByOdsServiceImpl,
    },
  ],
  exports: [CommunitiesCausesByOdsService],
})
export class CommunitiesCausesByOdsModule {}
