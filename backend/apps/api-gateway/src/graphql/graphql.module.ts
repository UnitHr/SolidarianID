import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import { join } from 'path';
import { APP_FILTER } from '@nestjs/core';
import { UserResolver } from './resolvers/user.resolver';
import { CommunityResolver } from './resolvers/community.resolver';
import { NotificationResolver } from './resolvers/notification.resolver';
import { UserService } from './services/user.service';
import { CommunityService } from './services/community.service';
import { NotificationService } from './services/notification.service';
import { PubSubService } from './services/pubsub.service';
import { DateScalar } from './models/scalars/date.scalar';
import { GraphQLGeneralExceptionFilter } from './errors/general-exception.filter';
import { NotificationEventListenerController } from './models/events/notification-event-listener.controller';

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
    UserService,
    CommunityService,
    NotificationService,
    PubSubService,
    DateScalar,
    { provide: APP_FILTER, useClass: GraphQLGeneralExceptionFilter },
  ],
  controllers: [NotificationEventListenerController],
})
export class GraphQLAppModule {}
