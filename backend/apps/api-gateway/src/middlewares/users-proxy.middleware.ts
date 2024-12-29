import { Injectable } from '@nestjs/common';
import { Options } from 'http-proxy-middleware';
import { ProxyMiddleware } from './base-proxy.middleware';

@Injectable()
export class UsersProxyMiddleware extends ProxyMiddleware {
  protected getOptions(): Options {
    return {
      target: 'http://localhost:3001/users',
      pathRewrite: { '^/api/v1/users': '/' },
      changeOrigin: true,
    };
  }
}
