import { createProxyMiddleware } from "http-proxy-middleware";

const rewriteTarget = process.env.API_ENDPOINT_URL

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
}

export default createProxyMiddleware({
  target: rewriteTarget,
  changeOrigin: true,
})