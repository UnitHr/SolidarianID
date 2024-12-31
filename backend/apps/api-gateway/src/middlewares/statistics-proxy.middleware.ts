import { Injectable } from '@nestjs/common';
import { envs } from '@api-gateway/config';
import { ProxyMiddleware } from './base-proxy.middleware';

@Injectable()
export class StatisticsProxyMiddleware extends ProxyMiddleware {
  protected getOptions() {
    return {
      target: envs.statisticsMsUrl,
      pathRewrite: { '^/api/v1/statistics': '/' },
      changeOrigin: true,
    };
  }
}
