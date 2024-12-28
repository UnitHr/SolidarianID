import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
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
import { CreateCommunityController } from './application/create-community.controller';
import { JoinCommunityController } from './application/join-community.controller';

@Module({
  imports: [
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
  ],
  controllers: [
    CommunityController,
    CreateCommunityController,
    JoinCommunityController,
  ],
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
    CommunityService,
    JoinCommunityService,
    CreateCommunityService,
  ],
})
export class CommunityModule {}
