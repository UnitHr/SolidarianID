import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('API-Gateway_Bootstrap');

  const app = await NestFactory.create(AppModule);

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,PATCH', // Allowed methods
    allowedHeaders: 'Content-Type, Authorization', // Allowed headers
    credentials: true, // Allows the use of cookies and credentials
  });

  // Start the application
  await app.listen(envs.apiGatewayPort, envs.apiGatewayHost);
  logger.log(`Gateway is running on: ${await app.getUrl()}`);
}
bootstrap();
