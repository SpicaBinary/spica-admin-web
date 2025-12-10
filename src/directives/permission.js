import store from "@/store";

// 自定义权限指令，定义bind和update生命周期钩子
export const permission = {
  // bind：只调用一次，指令第一次绑定到元素时调用。在这里进行一次权限检查
  // 参数一：el:令所绑定的DOM元素
  // 参数二：binding:指令对象，对象中包含指令的相关信息
  bind(el, binding) {
    checkPermission(el, binding);
  },
  // update：指令所在的模版被重新解析时调用(数据更新)
  update(el, binding) {
    checkPermission(el, binding);
  },
};

// 自定义权限指令，定义bind和update生命周期钩子
export const role = {
  bind(el, binding) {
    checkRole(el, binding);
  },
  update(el, binding) {
    checkRole(el, binding);
  },
};

// 权限检查函数
function checkPermission(el, binding) {
  const { value } = binding;
  console.log("权限检查" + value);
  if (value) {
    const hasPermission = store.getters.hasPermission(value);
    console.log("权限检查结果：" + hasPermission);
    if (!hasPermission) {
      // 使用 display 控制隐藏指令修饰el
      el.style.display = hasPermission ? "" : "none";
      // 从 DOM 中直接移除
      // el.parentNode && el.parentNode.removeChild(el);
    }
  }
}

// 角色检查函数
function checkRole(el, binding) {
  const { value } = binding;

  if (value) {
    const hasRole = store.getters.hasRole(value);
    // el.style.display = hasRole ? "" : "none";
    if (!hasRole) {
      // 使用 display 控制隐藏指令修饰el
      el.style.display = hasPermission ? "" : "none";
      // 从 DOM 中直接移除
      // el.parentNode && el.parentNode.removeChild(el);
    }
  }
}

// 传入vue，然后注册自定义指令（Vue2）
export default function setupPermissionDirective(Vue) {
  // 添加全局指令v-permission：细粒度控制权限,功能级别控制
  Vue.directive("permission", permission);
  // 添加全局指令v-role
  Vue.directive("role", role);
}
