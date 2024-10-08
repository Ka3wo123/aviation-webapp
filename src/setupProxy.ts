import { createProxyMiddleware } from 'http-proxy-middleware';

export default function (app: any) {
  app.use(
    '/user-service',
    createProxyMiddleware({
      target: 'http://localhost:8082',
      changeOrigin: true,
      pathRewrite: { '^/user-service': '' }, 
    })
  );
  
  app.use(
    '/auth-service',
    createProxyMiddleware({
      target: 'http://localhost:8083',
      changeOrigin: true,
      pathRewrite: { '^/auth-service': '' },
    })
  );

  app.use(
    '/flight-service',
    createProxyMiddleware({
      target: 'http://localhost:8084',
      changeOrigin: true,
      pathRewrite: { '^/flight-service': '' },
    })
  );
};
