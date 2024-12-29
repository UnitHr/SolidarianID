import { Injectable } from '@nestjs/common';
import { ProxyMiddleware } from './base-proxy.middleware';

@Injectable()
export class CommunitiesProxyMiddleware extends ProxyMiddleware {
  protected getOptions() {
    return {
      target: 'http://localhost:3002/communities',
      pathRewrite: { '^/api/v1/communities': '/' },
      changeOrigin: true,
    };
  }
}
