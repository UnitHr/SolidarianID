import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CauseModule } from '@communities-ms/causes/cause.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CommunityController } from './application/community.controller';
import {
  CreateCommunityRequest,
  CreateCommunityRequestSchema,
} from './infra/persistence/CreateCommunityRequest';
import { Community, CommunitySchema } from './infra/persistence/Community';
import { CreateCommunityRequestRepository } from './repo/create-community.repository';
import { CreateCommunityRequestRepositoryMongoDb } from './infra/create-community.repository.mongodb';
import { CommunityServiceImpl } from './application/community.service.impl';
import { CommunityRepository } from './repo/community.repository';
import { CommunityRepositoryMongoDb } from './infra/community.repository.mongodb';
import {
  JoinCommunityRequest,
  JoinCommunityRequestSchema,
} from './infra/persistence/JoinCommunityRequest';
import { JoinCommunityRequestRepository } from './repo/join-community.repository';
import { JoinCommunityRequestRepositoryMongoDb } from './infra/join-community.repository.mongodb';
import { JoinCommunityServiceImpl } from './application/join-community.service.impl';
import { CreateCommunityServiceImpl } from './application/create-community.service.impl';
import { CommunityService } from './application/community.service';
import { JoinCommunityService } from './application/join-community.service';
import { CreateCommunityService } from './application/create-community.service';

@Module({
  imports: [
    CauseModule,
    MongooseModule.forFeature([
      {
        name: CreateCommunityRequest.name,
        schema: CreateCommunityRequestSchema,
      },
      {
        name: Community.name,
        schema: CommunitySchema,
      },
      {
        name: JoinCommunityRequest.name,
        schema: JoinCommunityRequestSchema,
      },
    ]),
    CqrsModule,
  ],
  controllers: [CommunityController],
  providers: [
    {
      provide: CreateCommunityRequestRepository,
      useClass: CreateCommunityRequestRepositoryMongoDb,
    },
    {
      provide: CommunityRepository,
      useClass: CommunityRepositoryMongoDb,
    },
    {
      provide: JoinCommunityRequestRepository,
      useClass: JoinCommunityRequestRepositoryMongoDb,
    },
    {
      provide: CommunityService,
      useClass: CommunityServiceImpl,
    },
    {
      provide: JoinCommunityService,
      useClass: JoinCommunityServiceImpl,
    },
    {
      provide: CreateCommunityService,
      useClass: CreateCommunityServiceImpl,
    },
  ],
})
export class CommunityModule {}
