import { Injectable } from '@nestjs/common';
import { envs } from '@api-gateway/config';
import { ProxyMiddleware } from './base-proxy.middleware';

@Injectable()
export class CommunitiesProxyMiddleware extends ProxyMiddleware {
  protected getOptions() {
    return {
      target: envs.communitiesMsUrl,
      pathRewrite: { '^/api/v1/communities': '/' },
      changeOrigin: true,
    };
  }
}
