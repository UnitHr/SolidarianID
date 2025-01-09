import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CauseModule } from '@communities-ms/causes/cause.module';
import { CqrsModule } from '@nestjs/cqrs';
import { CommunitiesEventsModule } from '@communities-ms/events/communities-events.module';
import { CommunityController } from './application/community.controller';
import {
  CreateCommunityRequest,
  CreateCommunityRequestSchema,
} from './infra/persistence/CreateCommunityRequest';
import { Community, CommunitySchema } from './infra/persistence/Community';
import { CreateCommunityRequestRepository } from './repo/create-community.repository';
import { CreateCommunityRequestRepositoryMongoDb } from './infra/create-community.repository.mongodb';
import { CommunityService } from './application/community.service';
import { CommunityRepository } from './repo/community.repository';
import { CommunityRepositoryMongoDb } from './infra/community.repository.mongodb';
import {
  JoinCommunityRequest,
  JoinCommunityRequestSchema,
} from './infra/persistence/JoinCommunityRequest';
import { JoinCommunityRequestRepository } from './repo/join-community.repository';
import { JoinCommunityRequestRepositoryMongoDb } from './infra/join-community.repository.mongodb';
import { JoinCommunityService } from './application/join-community.service';
import { CreateCommunityService } from './application/create-community.service';
import { CommunityCreatedHandler } from './domain/events/community-created.handler';
import { JoinCommunityRequestCreatedHandler } from './domain/events/join-community-reques-created.handler';
import { UserJoinedCommunityHandler } from './domain/events/user-joined-community.handler';
import { JoinCommunityRequestRejectedHandler } from './domain/events/join-community-request-rejected.handler';

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
    CommunitiesEventsModule,
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
    // TODO: Create interface for Services
    CommunityService,
    JoinCommunityService,
    CreateCommunityService,
    CommunityCreatedHandler,
    JoinCommunityRequestCreatedHandler,
    UserJoinedCommunityHandler,
    JoinCommunityRequestRejectedHandler,
  ],
})
export class CommunityModule {}
