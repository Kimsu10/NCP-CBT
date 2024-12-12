import { createProxyMiddleware } from "http-proxy-middleware";

export default function setupProxy(app) {
  app.use(
    "/",
    createProxyMiddleware({
      target: `${process.env.REACT_APP_BASE_URL}`,
      changeOrigin: true,
    }),
  );
  app.use(
    "/quiz",
    createProxyMiddleware({
      target: `${process.env.REACT_APP_SOCKET_URL}`,
      changeOrigin: true,
    }),
  );
}
