import { Injectable } from '@nestjs/common';
import { Options } from 'http-proxy-middleware';
import { envs } from '@api-gateway/config';
import { ProxyMiddleware } from './base-proxy.middleware';

@Injectable()
export class CausesProxyMiddleware extends ProxyMiddleware {
  protected getOptions(): Options {
    return {
      target: envs.causesUrl,
      pathRewrite: { '^/api/v1/causes': '/' },
      changeOrigin: true,
    };
  }
}
