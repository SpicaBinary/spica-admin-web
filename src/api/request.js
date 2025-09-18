// axios 封装
import axios from "axios";
import store from "@/store";
import router from "@/router";

// 创建 axios 实例
const service = axios.create({
  baseURL: "http://localhost:8080/api", // 后端接口的统一前缀
  timeout: 5000, // 请求超时时间
});

// 请求拦截器：每次请求都带上 token
service.interceptors.request.use(
  (config) => {
    const token = store.state.token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器：统一处理错误
service.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 401 未授权，说明 token 过期或无效
      store.dispatch("logout");
      router.push("/login");
    }
    return Promise.reject(error);
  }
);

export default service;
