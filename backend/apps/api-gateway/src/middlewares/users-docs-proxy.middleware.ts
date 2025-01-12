import { Injectable } from '@nestjs/common';
import { envs } from '@api-gateway/config';
import { ProxyMiddleware } from './base-proxy.middleware';

@Injectable()
export class UsersDocsProxyMiddleware extends ProxyMiddleware {
  protected getOptions() {
    return {
      target: envs.usersDocsUrl,
      pathRewrite: {
        '^/api/v1/doc/users': '/',
      },
      changeOrigin: true,
    };
  }
}
