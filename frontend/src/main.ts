import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { envs } from './config';
import { join } from 'path';
import * as cookieParser from 'cookie-parser';
import * as hbs from 'hbs';

async function bootstrap() {
  const logger = new Logger('Frontend_Bootstrap');

  // Create the HTTP application
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Static assets and views configuration
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));

  // Register partials
  hbs.registerPartials(join(__dirname, '..', 'views', 'partials'));

  // Configure the template engine
  app.setViewEngine('hbs');

  // Set default layout
  app.set('view options', { layout: 'layouts/main' });

  // Enable cookie parser
  app.use(cookieParser());

  // Start the application
  await app.listen(envs.frontendPort, '0.0.0.0');
  logger.log(`Frontend is running on: ${await app.getUrl()}`);
}
bootstrap();
