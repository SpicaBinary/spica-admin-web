import Vue from "vue";
import Router from "vue-router";
// 引入 Vuex
import store from "@/store";
// 引入布局组件
import Layout from "@/components/Layout.vue";
import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue";
import UserManagement from "@/views/UserManagement.vue";
import OrderManagement from "@/views/OrderManagement.vue";

// 告诉 Vue 使用 vue-router
Vue.use(Router);

// 路由表：定义页面路径与对应组件
const routes = [
  // 登录页 - 独立页面
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  // 主布局 - 包含公共布局的页面组
  {
    path: "/", // 根路径
    component: Layout, // 布局组件（包含顶边栏和侧边栏）
    meta: { requiresAuth: true }, // 需要登录才能访问
    children: [
      // 嵌套路由 - 这些页面都会在 Layout 中显示
      {
        path: "", // 默认子路由，访问 / 时显示
        name: "Dashboard",
        component: Dashboard, // 这个组件会在 Layout 的 <router-view> 中显示
      },
      {
        path: "user", // 访问 /user 时显示
        name: "UserManagement",
        component: UserManagement,
        meta: { requiresAuth: true },
      },
      {
        path: "order", // 访问 /order 时显示
        name: "OrderManagement",
        component: OrderManagement,
        meta: { requiresAuth: true },
      },
    ],
  },
];

// 创建 Router 实例
const router = new Router({
  mode: "history", // 使用 history 模式，URL 没有 #，更好看
  routes,
});

// 全局路由守卫：每次路由跳转都会执行
// to：跳转的目标信息
// from：跳转前的信息
// next：放行
router.beforeEach((to, from, next) => {
  // 判断目标路由是否需要登录
  const requiresAuth = to.matched.some((record) => record.meta.requiresAuth);

  // 登录状态：从Vuex 获取是否有token来判断
  const isLoggedIn = store.getters.isLoggedIn;

  if (requiresAuth && !isLoggedIn) {
    // 没登录想访问受保护页面，跳转到 /login
    console.log("目标页面" + to.fullPath + "需要登录");
    next({ path: "/login", query: { redirect: to.fullPath } });
  } else {
    // 其他情况直接放行
    next();
  }
});

export default router;
