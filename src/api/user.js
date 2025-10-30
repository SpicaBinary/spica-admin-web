import request from "./request";

// 当前用户信息
export function getUserInfo() {
  return request({
    url: "/user/getUserInfo",
    method: "get",
    showLoading: false,
  });
}

// 当前用户菜单信息
export function getCurrentUserMenus() {
  return request({
    url: "/user/menus",
    method: "get",
    showLoading: false,
  });
}

// 获取所有用户信息
export function getUserList(params) {
  return request({
    url: "/user/list",
    method: "get",
    params,
    showLoading: false,
  });
}

// 修改用户信息
export function updateCurrentUser(data) {
  return request({
    url: "/user/current",
    method: "put",
    data,
  });
}

// 修改密码
export function updatePassword(data) {
  return request({
    url: "/user/password",
    method: "put",
    data,
  });
}

// 获取单个用户信息（用于编辑）
export function getUserById(id) {
  return request({
    url: `/user/${id}`,
    method: "get"
  });
}

// 创建用户
export function createUser(data) {
  return request({
    url: "/user/add",
    method: "post",
    data
  });
}

// 更新用户信息
export function updateUser(id, data) {
  return request({
    url: `/user/${id}`,
    method: "put",
    data
  });
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: `/user/${id}`,
    method: "delete"
  });
}
