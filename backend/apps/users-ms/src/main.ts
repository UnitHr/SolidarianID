import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices'; // Añadir esta importación
import { UsersMsModule } from './users-ms.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Users-MS_Bootstrap');

  // Create the HTTP application
  const app = await NestFactory.create(UsersMsModule);

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
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
    }),
  );

  // Enable CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  // Start the application
  await app.listen(envs.usersMsPort, envs.usersMsHost);
  logger.log(`users-ms is running on: ${await app.getUrl()}`);
}

bootstrap();
