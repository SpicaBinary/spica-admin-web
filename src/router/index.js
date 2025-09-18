import Vue from "vue";
import Router from "vue-router";

// 引入我们要展示的页面组件（先建两个示例页面）
import Login from "@/views/Login.vue";
import Dashboard from "@/views/Dashboard.vue";

// 告诉 Vue 使用 vue-router
Vue.use(Router);

// 路由表：定义页面路径与对应组件
const routes = [
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    name: "Dashboard",
    component: Dashboard,
    meta: { requiresAuth: true }, // meta 信息，用来标记需要登录才能访问
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

  // 这里先写死一个假登录状态，下一步我们再用 Vuex 来判断
  const isLoggedIn = false; // TODO: 下一步会替换成从 Vuex 读取 token

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
