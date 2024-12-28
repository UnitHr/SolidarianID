import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs';

async function bootstrap() {
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

  await app.listen(3001); // TODO: Load port from .env file
  console.log(`Frontend is running on: ${await app.getUrl()}`);
}
bootstrap();
