import { Injectable } from '@nestjs/common';
import { envs } from '@api-gateway/config';
import { ProxyMiddleware } from './base-proxy.middleware';

@Injectable()
export class DocsProxyMiddleware extends ProxyMiddleware {
  protected getOptions() {
    return {
      target: envs.communitiesDocsUrl,
      pathRewrite: {
        '^/api/v1/doc/communities': '/',
      },
      changeOrigin: true,
    };
  }
}
