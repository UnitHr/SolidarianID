import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('API-Gateway_Bootstrap');

  const app = await NestFactory.create(AppModule);

  // Start the application
  await app.listen(envs.apiGatewayPort, envs.apiGatewayHost);
  logger.log(`Gateway is running on: ${await app.getUrl()}`);
}
bootstrap();
