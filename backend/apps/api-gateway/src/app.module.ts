import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { UsersProxyMiddleware } from './middlewares/users-proxy.middleware';
import { CommunitiesProxyMiddleware } from './middlewares/communities-proxy.middleware';

@Module({
  imports: [],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(UsersProxyMiddleware).forRoutes('/api/v1/users');
    consumer.apply(CommunitiesProxyMiddleware).forRoutes('/api/v1/communities');
  }
}
