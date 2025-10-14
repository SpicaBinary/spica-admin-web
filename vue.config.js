const { defineConfig } = require("@vue/cli-service");
module.exports = defineConfig({
  transpileDependencies: true,
  // TODO 禁用保存时的 ESLint 检查
  lintOnSave: false,
  // 本地开发服务器配置
  devServer: {
    port: 10086,
    host: "127.0.0.1",
    // 自动打开浏览器
    open: true,
  },
});
