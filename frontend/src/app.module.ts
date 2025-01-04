import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HandlebarsHelpersService } from './helper.service';
import { AppService } from './app.service';
import { StatisticsController } from './statistic/statistics.controller';
import { StatisticsService } from './statistic/statistics.service';

@Module({
  imports: [],
  controllers: [AppController, StatisticsController],
  providers: [AppService, HandlebarsHelpersService, StatisticsService],
})
export class AppModule {}
