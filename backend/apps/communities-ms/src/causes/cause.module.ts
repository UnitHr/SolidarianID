import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_FILTER } from '@nestjs/core';
import { ActionModule } from '@communities-ms/actions/action.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CauseController } from './application/cause.controller';
import { CauseServiceImpl } from './application/cause.service.impl';
import { Cause } from './infra/persistence';
import { CauseRepository } from './cause.repository';
import { CauseService } from './application/cause.service';
import { CauseRepositoryMongoDB } from './infra/cause.repository.mongodb';
import { CauseSchema } from './infra/persistence/Cause';
import { CauseDomainExceptionFilter } from './infra/filters/cause-domain-exception.filter';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Cause.name,
        schema: CauseSchema,
      },
    ]),
    ActionModule,
    CqrsModule,
  ],
  controllers: [CauseController],
  providers: [
    {
      provide: CauseService,
      useClass: CauseServiceImpl,
    },
    {
      provide: CauseRepository,
      useClass: CauseRepositoryMongoDB,
    },
    {
      provide: APP_FILTER,
      useClass: CauseDomainExceptionFilter,
    },
  ],
  exports: [CauseService],
})
export class CauseModule {}
