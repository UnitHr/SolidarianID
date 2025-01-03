import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HandlebarsHelpersService } from './helper.service';
import { AppService } from './app.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, HandlebarsHelpersService],
})
export class AppModule {}
