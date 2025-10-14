import request from "./request";

// 登录接口
export function loginApi(data) {
  return request({
    url: "/auth/login",
    method: "post",
    data,
  });
}
