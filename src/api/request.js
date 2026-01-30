// axios 封装
import config from "@/config";
import router from "@/router";
import store from "@/store";
import axios from "axios";
// 引入Element UI 库全局消息提示组件-Message
import { Message } from "element-ui";
// loading展示管理
import loadingManager from "@/utils/loadingManager";

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
    // 只有在api配置中明确要求显示loading时才显示（默认显示）
    if (config.showLoading !== false) {
      loadingManager.show();
    }
    // 从Vuex 获取 token
    const token = store.state.user.token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // 请求失败时隐藏 loading
    loadingManager.hide();
    return Promise.reject(error);
  }
);

// 响应拦截器：统一处理错误
service.interceptors.response.use(
  (response) => {
    // 只有在配置中明确要求显示loading时才隐藏
    if (response.config && response.config.showLoading !== false) {
      loadingManager.hide();
    }
    // 读取接口响应结构数据
    const { code, message } = response.data;
    if (code == 200) {
      return response.data;
    } else {
      // 对特定错误码进行个性化处理
      switch (code) {
        case "500":
          Message({
            message: message || "服务器内部错误",
            type: "warning",
            duration: 5000,
            showClose: true,
          });
          break;
        default:
          Message({
            message: message || "请求失败",
            type: "error",
            duration: 3000,
          });
      }
      // 返回一个resolved promise而不是rejected，避免控制台报错
      return Promise.resolve({ code, message, data: response.data.data || [] });
    }
  },
  // HTTP 请求本身失败(非2xx)进入错误处理
  (error) => {
    // 请求失败时隐藏 loading
    loadingManager.hide();
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
          // 调用Vuex的logout action,清除本地存储的token和用户信息
          store.dispatch("user/logout", true);
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
