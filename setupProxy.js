const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    createProxyMiddleware("/crawl", {
      target: "http://localhost:8080/crawl",
      changeOrigin: true,
    })
  );
};
