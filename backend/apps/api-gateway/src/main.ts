import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('API-Gateway_Bootstrap');

  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'], // Enable all log levels
  });

  // Connect a microservice with KAFKA transport
  app.connectMicroservice({
    transport: Transport.KAFKA,
    options: {
      client: {
        clientId: envs.kafkaClientId,
        brokers: envs.kafkaBrokers,
      },
      consumer: {
        groupId: envs.kafkaGroupId,
      },
    },
  });

  // Start the microservice
  await app.startAllMicroservices();

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
