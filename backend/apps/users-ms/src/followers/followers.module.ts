import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { UserModule } from '@users-ms/users/user.module';
import { Follower } from './infra/persistence/Follower';
import { FollowerRepository } from './follower.repository';
import { FollowerRepositoryTypeOrm } from './infra/follower.repository.typeorm';
import { FollowerService } from './application/follower.service';
import { FollowerServiceImpl } from './application/follower.service.impl';
import { FollowersController } from './application/follower.controller';
import { FollowerDomainExceptionFilter } from './infra/filters/follower-domain-exception.filter';
import { UserFollowedHandler } from './domain/events/user-followed.handler';

@Module({
  imports: [TypeOrmModule.forFeature([Follower]), CqrsModule, UserModule],
  controllers: [FollowersController],
  providers: [
    {
      provide: FollowerRepository,
      useClass: FollowerRepositoryTypeOrm,
    },
    {
      provide: FollowerService,
      useClass: FollowerServiceImpl,
    },
    {
      provide: APP_FILTER,
      useClass: FollowerDomainExceptionFilter,
    },
    UserFollowedHandler,
  ],
  exports: [FollowerService],
})
export class FollowersModule {}
