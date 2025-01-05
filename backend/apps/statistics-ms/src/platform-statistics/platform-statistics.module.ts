import { Module } from '@nestjs/common';
import { PlatformStatisticsController } from './platform-statistics.controller';
import { OdsStatisticsModule } from './ods-statistics/ods-statistics.module';
import { CommunityStatisticsModule } from './community-statistics/community-statistics.module';

@Module({
  imports: [
    // Import modules
    OdsStatisticsModule,
    CommunityStatisticsModule,
  ],
  controllers: [PlatformStatisticsController],
})
export class PlatformStatisticsModule {}
