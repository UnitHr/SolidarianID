import { Injectable } from '@nestjs/common';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { envs } from '@api-gateway/config';
import { ProxyMiddleware } from './base-proxy.middleware';

@Injectable()
export class UsersProxyMiddleware extends ProxyMiddleware {
  protected getOptions(): Options {
    return {
      target: envs.usersMsUrl,
      pathRewrite: { '^/api/v1/users': '/' },
      changeOrigin: true,
    };
  }
}
