import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { UserResolver } from './resolvers/user.resolver';
import { FollowerResolver } from './resolvers/follower.resolver';
import { UserService } from './services/user.service';
import { DateScalar } from './scalars/date.scalar';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'schema.gql'),
      sortSchema: true,
      playground: true,
      introspection: true,
    }),
  ],
  providers: [UserResolver, FollowerResolver, UserService, DateScalar],
})
export class GraphQLAppModule {}
