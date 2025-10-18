// axios 封装
import axios from "axios";
import store from "@/store";
import router from "@/router";
import config from "@/config";
// 引入Element UI 库全局消息提示组件-Message
import { Message } from "element-ui";

// 创建 axios 实例
const service = axios.create({
  // 使用环境变量配置
  baseURL: config.baseURL,
  // 请求超时时间
  timeout: config.timeout || 5000,
});

// 请求拦截器：每次请求都带上 token
service.interceptors.request.use(
  (config) => {
    // 从Vuex 获取 token
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
    // 读取接口响应结构数据
    const { code, message } = response.data;
    if (code == 200) {
      return response.data;
    } else {
      Message({
        message: message || "请求失败",
        type: "error",
        duration: 3000,
      });
      return Promise.reject(new Error(message || "请求失败"));
    }
  },
  // HTTP 请求本身失败(非2xx)进入错误处理
  (error) => {
    let message = error.message;

    if (error.response) {
      // 根据 HTTP 状态码处理
      switch (error.response.status) {
        case 401:
          Message({
            message: "登录已过期，请重新登录",
            type: "error",
            duration: 3000,
          });
          // 调用Vuex的logout action
          store.dispatch("logout");
          // 跳转到登录页面
          router.push("/login");
          break;
        case 403:
          message = "权限不足";
          break;
        case 404:
          message = "请求资源不存在";
          break;
        case 500:
          message = "服务器内部错误";
          break;
        default:
          message = `请求失败: ${error.response.status}`;
      }
    } else if (error.request) {
      message = "网络连接异常";
    }

    Message({
      message: message,
      type: "error",
      duration: 3000,
    });

    return Promise.reject(error);
  }
);

export default service;
