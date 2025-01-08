import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { envs } from '@users-ms/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './application/auth.controller';
import { AuthService } from './application/auth.service';
import { AuthGuard } from '../../../../libs/common-lib/src/auth/auth.guard';
import { AuthServiceImpl } from './application/auth.service.impl';
import { UserModule } from '../users/user.module';
import { GithubStrategy } from './infra/github.strategy';

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '1h' },
    }),
    PassportModule.register({ defaultStrategy: 'github' }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: AuthService,
      useClass: AuthServiceImpl,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    GithubStrategy,
  ],
})
export class AuthModule {}
