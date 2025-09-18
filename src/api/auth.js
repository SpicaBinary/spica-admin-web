import request from "./request";

// 登录接口
export function loginApi(data) {
  return request({
    url: "/login",
    method: "post",
    data,
  });
}

// 获取当前用户信息
export function getUserInfo() {
  return request({
    url: "/user/info",
    method: "get",
  });
}
