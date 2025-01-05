import { Module } from '@nestjs/common';
import { PlatformStatisticsController } from './platform-statistics.controller';
import { CommunitiesCausesByOdsModule } from './communities-causes-by-ods/communities-causes-by-ods.module';

@Module({
  imports: [
    // Import modules
    CommunitiesCausesByOdsModule,
  ],
  controllers: [PlatformStatisticsController],
})
export class PlatformStatisticsModule {}
