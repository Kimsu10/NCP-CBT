import { createProxyMiddleware } from "http-proxy-middleware";

export default function setupProxy(app) {
  app.use(
    "/",
    createProxyMiddleware({
      target: "http://localhost:8080",
      changeOrigin: true,
    }),
  );
  app.use(
    "/testMatch",
    createProxyMiddleware({
      target: "http://localhost:4000",
      changeOrigin: true,
    }),
  );
}
