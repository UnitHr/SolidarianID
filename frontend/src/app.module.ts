import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HandlebarsHelpersService } from './helper.service';
import { AppService } from './app.service';
import { StatisticsController } from './modules/statistics/statistic.controller';
import { StatisticsService } from './modules/statistics/statistic.service';
import { ValidationController } from './modules/validations/validation.controller';
import { ValidationService } from './modules/validations/validation.service';
import { ReportService } from './modules/reports/report.service';
import { ReportController } from './modules/reports/report.controller';

@Module({
  imports: [],
  controllers: [
    AppController,
    StatisticsController,
    ValidationController,
    ReportController,
  ],
  providers: [
    AppService,
    HandlebarsHelpersService,
    StatisticsService,
    ValidationService,
    ReportService,
  ],
})
export class AppModule {}
