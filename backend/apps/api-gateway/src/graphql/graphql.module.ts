import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import { join } from 'path';
import { APP_FILTER } from '@nestjs/core';
import { UserResolver } from './resolvers/user.resolver';
import { CommunityResolver } from './resolvers/community.resolver';
import { NotificationResolver } from './resolvers/notification.resolver';
import { PubSubServiceImpl } from './infra/pubsub.service.impl';
import { DateScalar } from './models/scalars/date.scalar';
import { GraphQLGeneralExceptionFilter } from './infra/general-exception.filter';
import { NotificationEventsController } from './application/notification-events.controller';
import { UserService } from './application/user.service';
import { CommunityService } from './application/community.service';
import { NotificationService } from './application/notification.service';
import { UserServiceImpl } from './infra/http/user.service.impl';
import { CommunityServiceImpl } from './infra/http/community.service.impl';
import { NotificationServiceImpl } from './infra/http/notification.service.impl';
import { PubSubService } from './application/pubsub.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(
        process.cwd(),
        '/apps/api-gateway/src/graphql/schema.gql',
      ),
      sortSchema: true,
      playground: true,
      introspection: true,
      installSubscriptionHandlers: true,
      formatError: (error) => {
        // Keep only necessary error information
        const formattedError = {
          message: error.message,
          path: error.path,
          extensions: {
            code: error.extensions?.code,
            // Include selected additional data
            errorDetails: error.extensions?.errorDetails,
            originalStatus: error.extensions?.originalStatus,
          },
        };

        return formattedError;
      },
    }),
    HttpModule,
  ],
  providers: [
    UserResolver,
    CommunityResolver,
    NotificationResolver,
    {
      provide: UserService,
      useClass: UserServiceImpl,
    },
    {
      provide: CommunityService,
      useClass: CommunityServiceImpl,
    },
    {
      provide: NotificationService,
      useClass: NotificationServiceImpl,
    },
    {
      provide: PubSubService,
      useClass: PubSubServiceImpl,
    },
    DateScalar,
    { provide: APP_FILTER, useClass: GraphQLGeneralExceptionFilter },
  ],
  controllers: [NotificationEventsController],
})
export class GraphQLAppModule {}
