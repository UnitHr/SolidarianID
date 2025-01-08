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
        brokers: (envs.kafkaBrokers || 'localhost:9092').split(','),
      },
      consumer: {
        groupId: envs.kafkaGroupId,
      },
    },
  });

  // Start the microservice
  await app.startAllMicroservices();

  // (Optional) Configure a global ValidationPipe for your HTTP API
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
    }),
  );

  // Start application
  await app.listen(envs.statisticsMsPort, envs.statisticsMsHost);
  logger.log(`statistics-ms is running on: ${await app.getUrl()}`);
}
bootstrap();
