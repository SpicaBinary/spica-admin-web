// src/config/index.js
export default {
  // process.env 是 Node.js 提供的全局对象，用于访问系统环境变量
  baseURL: process.env.VUE_APP_API_BASE_URL || "http://localhost:8080/api",
  // 自定义debug标识
  debug: process.env.VUE_APP_DEBUG === "true",
  // 过期时间
  timeout: process.env.VUE_APP_TIMEOUT
    ? parseInt(process.env.VUE_APP_TIMEOUT)
    : 5000,
};
