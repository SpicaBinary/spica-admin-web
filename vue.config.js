const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  // TODO 禁用保存时的 ESLint 检查
  lintOnSave: false,
  // 本地开发服务器配置
  devServer: {
    port: 10086,
    host: "localhost",
    // 自动打开浏览器
    open: true,
    // 添加代理配置解决跨域问题
    proxy: {
      // 当前端请求以 /api 开头的路径时，会触发代理
      "/api": {
        // 将匹配到的请求转发到这个地址（通常是后端服务）
        target: "http://localhost:8080",
        // 修改请求头中的 origin 字段，使后端认为这是同源请求
        changeOrigin: true,
        pathRewrite: {
          // 如果配置为 "^/api": "/backend"，则 /api/auth/login 会变成 /backend/auth/login
          // pathRewrite 规则应用：/api/auth/login → /api/auth/login (路径不变)
          "^/api": "/api",
        },
      },
    },
  },
});
