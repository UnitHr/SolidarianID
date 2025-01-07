import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { UsersMsModule } from './users-ms.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Users-MS_Bootstrap');

  const app = await NestFactory.create(UsersMsModule);

  // Enable ValidationPipe for all routes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Convert data to the expected types in the DTOs
      whitelist: true, // Ignore properties that are not in the DTO
      forbidNonWhitelisted: true, // Reject unknown properties in requests
      disableErrorMessages: false, // Include detailed error messages
    }),
  );

  app.enableCors({
    origin: '*', // Aquí defines el frontend (puerto 3000 en este caso)
    methods: 'GET,POST,PUT,DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type, Authorization', // Encabezados permitidos
    credentials: true, // Permite el uso de cookies y credenciales
  });

  // Start the application
  await app.listen(envs.usersMsPort, envs.usersMsHost);
  logger.log(`users-ms is running on: ${await app.getUrl()}`);
}
bootstrap();
