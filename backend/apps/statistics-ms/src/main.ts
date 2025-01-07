import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { StatisticsMsModule } from './statistics-ms.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Statistics-MS_Bootstrap');

  // Crea la aplicación HTTP
  const app = await NestFactory.create(StatisticsMsModule);

  // Conecta un microservicio con transporte KAFKA
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

  // Iniciamos el microservicio
  await app.startAllMicroservices();

  // (Opcional) Configura un ValidationPipe global para tu API HTTP
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      disableErrorMessages: false,
    }),
  );

  // Inicia la aplicación HTTP
  await app.listen(envs.statisticsMsPort, envs.statisticsMsHost);
  logger.log(`statistics-ms is running on: ${await app.getUrl()}`);
}
bootstrap();
