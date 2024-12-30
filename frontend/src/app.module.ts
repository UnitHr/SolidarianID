import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { HandlebarsHelpersService } from './helper.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [HandlebarsHelpersService],
})
export class AppModule {}
