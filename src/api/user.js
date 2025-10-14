import request from "./request";

// 获取所有用户信息
export function getUserInfo() {
  return request({
    url: "/user/list",
    method: "get",
  });
}
