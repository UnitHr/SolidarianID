import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const logger = new Logger('API-Gateway_Bootstrap');

  const app = await NestFactory.create(AppModule);

  const port = 3000;
  logger.log('API-Gateway is running on port:', port);
  await app.listen(port);
}
bootstrap();
