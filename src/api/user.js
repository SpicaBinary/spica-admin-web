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
    method: "get",
  });
}

// 创建用户
export function createUser(data) {
  return request({
    url: "/user/add",
    method: "post",
    data,
  });
}

// 更新用户信息
export function updateUser(id, data) {
  return request({
    url: `/user/${id}`,
    method: "put",
    data,
  });
}

// 删除用户
export function deleteUser(id) {
  return request({
    url: `/user/${id}`,
    method: "delete",
  });
}

// 获取所有菜单
export function getAllMenus() {
  return request({
    url: "/user/menus/all",
    method: "get",
  });
}

// 创建菜单
export function createMenu(data) {
  return request({
    url: "/user/menus",
    method: "post",
    data,
  });
}

// 更新菜单
export function updateMenu(id, data) {
  return request({
    url: `/user/menus/${id}`,
    method: "put",
    data,
  });
}

// 删除菜单
export function deleteMenu(id) {
  return request({
    url: `/user/menus/${id}`,
    method: "delete",
  });
}

// 获取单个菜单详情
export function getMenuById(id) {
  return request({
    url: `/user/menus/${id}`,
    method: "get",
  });
}

// 为角色分配菜单（单个）
export function assignMenuToRole(roleId, menuId) {
  return request({
    url: "/user/role-menu",
    method: "post",
    params: {
      roleId,
      menuId,
    },
  });
}

// 为角色批量分配菜单
export function assignMenusToRole(roleId, menuIds) {
  return request({
    url: "/user/role-menu/batch",
    method: "post",
    params: {
      roleId,
    },
    data: menuIds,
  });
}

// 移除角色的菜单（单个）
export function removeMenuFromRole(roleId, menuId) {
  return request({
    url: "/user/role-menu",
    method: "delete",
    params: {
      roleId,
      menuId,
    },
  });
}

// 批量移除角色的菜单
export function removeMenusFromRole(roleId, menuIds) {
  return request({
    url: "/user/role-menu/batch",
    method: "delete",
    params: {
      roleId,
    },
    data: menuIds,
  });
}

// 获取角色已分配的菜单ID列表
export function getRoleMenuIds(roleId) {
  return request({
    url: `/user/role-menu/role/${roleId}`,
    method: "get",
  });
}
