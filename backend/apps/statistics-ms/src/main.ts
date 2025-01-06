import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { StatisticsMsModule } from './statistics-ms.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Statistics-MS_Bootstrap');

  const app = await NestFactory.create(StatisticsMsModule);
  app.enableCors({
    origin: '*', // Aquí defines el frontend (puerto 3000 en este caso)
    methods: 'GET,POST,PUT,DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type, Authorization', // Encabezados permitidos
    credentials: true, // Permite el uso de cookies y credenciales
  });
  // Start the application
  await app.listen(envs.statisticsMsPort, envs.statisticsMsHost);
  logger.log(`statistics-ms is running on: ${await app.getUrl()}`);
}
bootstrap();
