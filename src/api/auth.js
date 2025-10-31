import request from "./request";

// 登录接口
export function loginApi(data) {
  return request({
    url: "/auth/login",
    method: "post",
    data,
    showLoading: false, // 明确指定不显示全局loading
  });
}
// 退出接口
export function logoutApi() {
  return request({
    url: "/auth/logout",
    method: "post",
    showLoading: false,
  });
}
