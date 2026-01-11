// src/config/index.js
export default {
  // process.env 是 Node.js 提供的全局对象，用于访问系统环境变量
  baseURL:
    // 开发环境使用代理，生产环境使用完整地址
    process.env.NODE_ENV === "development"
      ? "/api" // 本地开发走代理
      : process.env.VUE_APP_API_BASE_URL, // 生产环境用完整后端地址
  // 自定义debug标识
  debug: process.env.VUE_APP_DEBUG === "true",
  // 过期时间
  timeout: process.env.VUE_APP_TIMEOUT
    ? parseInt(process.env.VUE_APP_TIMEOUT)
    : 5000,
};
