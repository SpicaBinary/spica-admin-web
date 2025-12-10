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
    url: "/user",
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
// 获取所有Role角色
export function getAllRoles() {
  return request({
    url: `/user/role`,
    method: "get",
  });
}
// 获取所有的Menu-Permission树形结构
export function getAllMenuPermissionTree() {
  return request({
    url: `/user/permissions/getAllMenuPermissionTree`,
    method: "get",
  });
}
// 获取指定用户的PermissionKey
export function getRolePermissionKeys(roleId) {
  return request({
    url: `/user/permissions/current/ids`,
    method: "get",
    params: { roleId },
  });
}
// 分配权限
export function assignRolePermissions(data) {
  return request({
    url: `/user/permissions/assignRolePermissions`,
    method: "post",
    data,
  });
}
// 获取对应菜单权限信息
export function getPermissionsByMenuId(menuId) {
  return request({
    url: `/user/permissions/${menuId}`,
    method: "get",
  });
}
// 创建Permission
export function createPermission(data) {
  return request({
    url: `/user/permissions`,
    method: "post",
    data,
  });
}
// 更新Permission
export function updatePermission(id, data) {
  return request({
    url: `/user/permissions/${id}`,
    method: "put",
    data,
  });
}
// 删除Permission
export function deletePermission(id) {
  return request({
    url: `/user/permissions/${id}`,
    method: "delete",
  });
}
