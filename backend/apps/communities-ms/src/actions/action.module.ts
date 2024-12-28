import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActionService } from './application/action.service';
import { ActionController } from './application/action.controller';
import { Action } from './infra/persistence';
import { ActionRepository } from './action.repository';
import { ActionServiceImpl } from './application/action.service.impl';
import { ActionRepositoryMongoDB } from './infra/action.repository.mongodb';
import { ActionSchema } from './infra/persistence/Action';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Action.name,
        schema: ActionSchema,
      },
    ]),
  ],
  controllers: [ActionController],
  providers: [
    {
      provide: ActionService,
      useClass: ActionServiceImpl,
    },
    {
      provide: ActionRepository,
      useClass: ActionRepositoryMongoDB,
    },
  ],
})
export class ActionModule {}
