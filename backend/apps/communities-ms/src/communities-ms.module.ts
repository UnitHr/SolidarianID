import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from '@common-lib/common-lib/auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';
import { CommunityModule } from './communities/community.module';
import { CauseModule } from './causes/cause.module';
import { ActionModule } from './actions/action.module';
import { envs } from './config';
import { CommunitiesEventsModule } from './events/communities-events.module';

@Module({
  imports: [
    // Mongoose configuration
    MongooseModule.forRootAsync({
      useFactory: () => ({
        // Configuation from .env file
        uri: envs.mongoUri,
      }),
    }),

    // JWT configuration
    JwtModule.register({
      global: true,
      secret: envs.jwtSecret,
      signOptions: { expiresIn: '1h' },
    }),

    // Import modules
    CommunityModule,
    CauseModule,
    ActionModule,
    CommunitiesEventsModule,
  ],

  providers: [
    // AuthGuard provider
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class CommunitiesMsModule {}
