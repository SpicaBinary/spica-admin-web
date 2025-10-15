import request from "./request";

// 当前用户信息
export function getUserInfo() {
  return request({
    url: "/user/getUserInfo",
    method: "get",
  });
}

// 获取所有用户信息
export function getUserList() {
  return request({
    url: "/user/list",
    method: "get",
  });
}
