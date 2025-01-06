import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { StatisticsMsModule } from './statistics-ms.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Statistics-MS_Bootstrap');

  const app = await NestFactory.create(StatisticsMsModule);

  // Start the application
  await app.listen(envs.statisticsMsPort, envs.statisticsMsHost);
  logger.log(`statistics-ms is running on: ${await app.getUrl()}`);
}
bootstrap();
