import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CauseController } from './application/cause.controller';
import { CauseServiceImpl } from './application/cause.service.impl';
import { Cause } from './infra/persistence';
import { CauseRepository } from './cause.repository';
import { CauseService } from './application/cause.service';
import { CauseRepositoryMongoDB } from './infra/cause.repository.mongodb';
import { CauseSchema } from './infra/persistence/Cause';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Cause.name,
        schema: CauseSchema,
      },
    ]),
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
  ],
})
export class CauseModule {}
