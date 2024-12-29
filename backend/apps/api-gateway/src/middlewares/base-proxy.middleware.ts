import { NestMiddleware } from '@nestjs/common';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { Request, Response, NextFunction } from 'express';

function handleProxyRequestBody(proxyReq, req): void {
  if (req.method === 'POST' && req.body) {
    const bodyData = JSON.stringify(req.body);

    proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
    proxyReq.setHeader('Content-Type', 'application/json');
    proxyReq.write(bodyData);
  }
}

export abstract class ProxyMiddleware implements NestMiddleware {
  protected abstract getOptions(): Options;

  private createProxy() {
    const options = this.getOptions();
    return createProxyMiddleware({
      ...options,
      on: {
        proxyReq: (proxyReq, req) => {
          handleProxyRequestBody(proxyReq, req);
        },
      },
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    const proxy = this.createProxy();
    proxy(req, res, next);
  }
}
