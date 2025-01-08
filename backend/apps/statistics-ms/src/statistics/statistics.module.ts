import { Module } from '@nestjs/common';
import { StatisticsController } from './application/statistics.controller';

@Module({
  imports: [],
  controllers: [StatisticsController],
  providers: [],
})
export class StatisticsModule {}
