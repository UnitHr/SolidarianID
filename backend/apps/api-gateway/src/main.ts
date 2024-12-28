import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('API-Gateway_Bootstrap');

  const app = await NestFactory.create(AppModule);

  // Start the application
  await app.listen(envs.apiGatewayPort);
  logger.log(`Backend is running on: ${await app.getUrl()}`);
}
bootstrap();
