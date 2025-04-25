import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { HttpModule } from '@nestjs/axios';
import { join } from 'path';
import { UserResolver } from './resolvers/user.resolver';
import { CommunityResolver } from './resolvers/community.resolver';
import { UserService } from './services/user.service';
import { CommunityService } from './services/community.service';
import { DateScalar } from './scalars/date.scalar';

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
    }),
    HttpModule,
  ],
  providers: [
    UserResolver,
    CommunityResolver,
    UserService,
    CommunityService,
    DateScalar,
  ],
})
export class GraphQLAppModule {}
