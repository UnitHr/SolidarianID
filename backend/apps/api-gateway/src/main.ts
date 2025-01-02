import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import { envs } from './config';

async function bootstrap() {
  const logger = new Logger('API-Gateway_Bootstrap');

  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*', // Aquí defines el frontend (puerto 3000 en este caso)
    methods: 'GET,POST,PUT,DELETE', // Métodos permitidos
    allowedHeaders: 'Content-Type, Authorization', // Encabezados permitidos
    credentials: true, // Permite el uso de cookies y credenciales
  });
  // Start the application
  await app.listen(envs.apiGatewayPort, envs.apiGatewayHost);
  logger.log(`Gateway is running on: ${await app.getUrl()}`);
}
bootstrap();
