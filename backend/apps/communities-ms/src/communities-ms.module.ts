import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommunityModule } from './communities/community.module';
import { CauseModule } from './causes/cause.module';
import { ActionModule } from './actions/action.module';
import { envs } from './config';

@Module({
  imports: [
    // Mongoose configuration
    MongooseModule.forRootAsync({
      useFactory: () => ({
        // Configuation from .env file
        uri: [
          'mongodb://',
          envs.mongoHost,
          ':',
          envs.mongoPort,
          '/',
          envs.mongoDb,
        ].join(''),
      }),
    }),
    // Import modules
    CommunityModule,
    CauseModule,
    ActionModule,
  ],
})
export class CommunitiesMsModule {}
