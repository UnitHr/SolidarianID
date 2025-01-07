import { Module } from '@nestjs/common';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [StatisticsModule],
  controllers: [],
  providers: [],
})
export class StatisticsMsModule {}
