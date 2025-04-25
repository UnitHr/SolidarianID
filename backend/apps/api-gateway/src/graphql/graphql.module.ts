import { Module, Provider } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import { join } from 'path';
import { APP_FILTER } from '@nestjs/core';
import { UserResolver } from './resolvers/user.resolver';
import { CommunityResolver } from './resolvers/community.resolver';
import { UserService } from './services/user.service';
import { CommunityService } from './services/community.service';
import { DateScalar } from './scalars/date.scalar';
import { GraphQLGeneralExceptionFilter } from './filters/general-exception.filter';

// Exception filters providers
const exceptionFilters: Provider[] = [
  {
    provide: APP_FILTER,
    useClass: GraphQLGeneralExceptionFilter,
  },
];

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
      formatError: (error) => {
        // Keep only necessary error information
        const formattedError = {
          message: error.message,
          path: error.path,
          extensions: {
            code: error.extensions?.code,
            // Include selected additional data
            ...(error.extensions?.errorDetails && {
              errorDetails: error.extensions.errorDetails,
            }),
            ...(error.extensions?.originalStatus && {
              originalStatus: error.extensions.originalStatus,
            }),
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
    UserService,
    CommunityService,
    DateScalar,
    ...exceptionFilters,
  ],
})
export class GraphQLAppModule {}
