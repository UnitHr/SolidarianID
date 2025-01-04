import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { KafkaModule } from '@common-lib/common-lib/kafka/kafka.module';
import { ActionService } from './application/action.service';
import { ActionController } from './application/action.controller';
import { Action } from './infra/persistence';
import { ActionRepository } from './action.repository';
import { ActionServiceImpl } from './application/action.service.impl';
import { ActionRepositoryMongoDB } from './infra/action.repository.mongodb';
import { ActionSchema } from './infra/persistence/Action';
import { ActionDomainExceptionFilter } from './infra/filters/action-domain-exception.filter';
import { ActionEventPublisher } from './action.event-publisher';
import { ActionEventPublisherKafka } from './infra/action.event-publisher.kafka';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Action.name,
        schema: ActionSchema,
      },
    ]),
    CqrsModule,
    KafkaModule,
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
    {
      provide: ActionEventPublisher,
      useClass: ActionEventPublisherKafka,
    },
    {
      provide: APP_FILTER,
      useClass: ActionDomainExceptionFilter,
    },
  ],
  exports: [ActionService],
})
export class ActionModule {}
