import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER } from '@nestjs/core';
import { CqrsModule } from '@nestjs/cqrs';
import { User } from './infra/persistence/User';
import { UserRepository } from './user.repository';
import { UsersController } from './application/user.controller';
import { UserService } from './application/user.service';
import { UserServiceImpl } from './application/user.service.impl';
import { UserRepositoryTypeOrm } from './infra/user.repository.typeorm';
import { UserDomainExceptionFilter } from './infra/filters/user-domain-exception.filter';

@Module({
  imports: [TypeOrmModule.forFeature([User]), CqrsModule],
  controllers: [UsersController],
  providers: [
    {
      provide: UserService,
      useClass: UserServiceImpl,
    },
    {
      provide: UserRepository,
      useClass: UserRepositoryTypeOrm,
    },
    {
      provide: APP_FILTER,
      useClass: UserDomainExceptionFilter,
    },
  ],
  exports: [UserService],
})
export class UserModule {}
