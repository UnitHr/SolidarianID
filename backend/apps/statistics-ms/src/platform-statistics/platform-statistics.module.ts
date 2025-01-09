import { Module } from '@nestjs/common';
import { PlatformStatisticsController } from './platform-statistics.controller';
import { OdsStatisticsModule } from './ods-statistics/ods-statistics.module';
import { CommunityStatisticsModule } from './community-statistics/community-statistics.module';
import { PlatformStatisticsEventListenerController } from './platform-statistics.event-listener.controller';

@Module({
  imports: [
    // Import modules
    OdsStatisticsModule,
    CommunityStatisticsModule,
  ],
  controllers: [
    // Import controllers
    PlatformStatisticsController,
    PlatformStatisticsEventListenerController,
  ],
})
export class PlatformStatisticsModule {}
