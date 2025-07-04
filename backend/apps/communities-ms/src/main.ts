import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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

  app.enableCors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE,PATCH',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  });

  // Swagger config
  const config = new DocumentBuilder()
    .setTitle('SolidarianID Communities Microservice')
    .setDescription('SolidarianID Communities Microservice')
    .setVersion('1.0')
    .addTag('SolidarianID')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc/communities', app, document);

  // Start the application
  await app.listen(envs.communitiesMsPort, envs.communitiesMsHost);
  logger.log(`communities-ms is running on: ${await app.getUrl()}`);
}
bootstrap();
