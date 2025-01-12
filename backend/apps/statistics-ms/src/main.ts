import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { StatisticsMsModule } from './statistics-ms.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Statistics-MS_Bootstrap');

  // Create the HTTP application
  const app = await NestFactory.create(StatisticsMsModule);

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

  // Enable ValidationPipe for all routes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Convert data to the expected types in the DTOs
      whitelist: true, // Ignore properties that are not in the DTO
      forbidNonWhitelisted: true, // Reject unknown properties in requests
      disableErrorMessages: false, // Include detailed error messages
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  // Start the application
  await app.listen(envs.statisticsMsPort, envs.statisticsMsHost);
  logger.log(`statistics-ms is running on: ${await app.getUrl()}`);
}
bootstrap();
