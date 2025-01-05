import { Module } from '@nestjs/common';
import { PlatformStatisticsController } from './platform-statistics.controller';
import { OdsStatisticsModule } from './ods-statistics/ods-statistics.module';

@Module({
  imports: [
    // Import modules
    OdsStatisticsModule,
  ],
  controllers: [PlatformStatisticsController],
})
export class PlatformStatisticsModule {}
