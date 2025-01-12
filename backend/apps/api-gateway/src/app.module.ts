import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { UsersProxyMiddleware } from './middlewares/users-proxy.middleware';
import { CommunitiesProxyMiddleware } from './middlewares/communities-proxy.middleware';
import { StatisticsProxyMiddleware } from './middlewares/statistics-proxy.middleware';
import { UsersDocsProxyMiddleware } from './middlewares/users-docs-proxy.middleware';
import { CommunitiesDocsProxyMiddleware } from './middlewares/communities-docs-proxy.middleware';

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UsersProxyMiddleware)
      .forRoutes(
        { path: 'api/v1/users', method: RequestMethod.ALL },
        { path: 'api/v1/users/*', method: RequestMethod.ALL },
      );
    consumer
      .apply(CommunitiesProxyMiddleware)
      .forRoutes(
        { path: 'api/v1/communities', method: RequestMethod.ALL },
        { path: 'api/v1/communities/*', method: RequestMethod.ALL },
      );
    consumer
      .apply(StatisticsProxyMiddleware)
      .forRoutes(
        { path: 'api/v1/statistics', method: RequestMethod.ALL },
        { path: 'api/v1/statistics/*', method: RequestMethod.ALL },
      );
    consumer
      .apply(UsersDocsProxyMiddleware)
      .forRoutes(
        { path: 'api/v1/doc/users', method: RequestMethod.ALL },
        { path: 'api/v1/doc/users/*', method: RequestMethod.ALL },
      );
    consumer
      .apply(CommunitiesDocsProxyMiddleware)
      .forRoutes(
        { path: 'api/v1/doc/communities', method: RequestMethod.ALL },
        { path: 'api/v1/doc/communities/*', method: RequestMethod.ALL },
      );
  }
}
