import Vue from "vue";
import App from "./App.vue";
// 路由组件
import router from "./router";
// Vuex
import store from "./store";
// 引入 Element UI
import ElementUI from "element-ui";
// 引入 Element UI 的样式
import "element-ui/lib/theme-chalk/index.css";
// 引入自定义权限指令
import setupPermissionDirective from "@/directives/permission";

// 使用 Element UI
Vue.use(ElementUI);

// 将指令注册到 Vue 实例上
setupPermissionDirective(Vue);

Vue.config.productionTip = false;

new Vue({
  router,
  store, // 把 store 注入全局
  render: (h) => h(App),
}).$mount("#app");
