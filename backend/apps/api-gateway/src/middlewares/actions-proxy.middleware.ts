import { Injectable } from '@nestjs/common';
import { Options } from 'http-proxy-middleware';
import { envs } from '@api-gateway/config';
import { ProxyMiddleware } from './base-proxy.middleware';

@Injectable()
export class ActionsProxyMiddleware extends ProxyMiddleware {
  protected getOptions(): Options {
    return {
      target: envs.actionsUrl,
      pathRewrite: { '^/api/v1/actions': '/' },
      changeOrigin: true,
    };
  }
}
