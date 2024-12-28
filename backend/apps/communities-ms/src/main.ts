import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CommunitiesMsModule } from './communities-ms.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('Communities-MS_Bootstrap');

  const app = await NestFactory.create(CommunitiesMsModule);

  // Enable ValidationPipe for all routes
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true, // Convert data to the expected types in the DTOs
      whitelist: true, // Ignore properties that are not in the DTO
      forbidNonWhitelisted: true, // Reject unknown properties in requests
      disableErrorMessages: false, // Include detailed error messages
    }),
  );

  // Start the application
  await app.listen(envs.communitiesMsPort);
  logger.log(`Backend is running on: ${await app.getUrl()}`);
}
bootstrap();
