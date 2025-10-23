import request from "./request";

// 获取订单列表（分页）
export function getOrderPage(params) {
  return request({
    url: "/order/page",
    method: "get",
    params,
    showLoading: false,
  });
}

// 创建订单
export function createOrder(data) {
  return request({
    url: "/order/create",
    method: "post",
    data,
  });
}

// 更新订单
export function updateOrder(data) {
  return request({
    url: "/order/update",
    method: "put",
    data,
  });
}

// 删除订单
export function deleteOrder(id) {
  return request({
    url: `/order/${id}`,
    method: "delete",
  });
}

// 获取订单详情
export function getOrderDetail(id) {
  return request({
    url: `/order/${id}`,
    method: "get",
  });
}
