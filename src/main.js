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

// 使用 Element UI
Vue.use(ElementUI);

Vue.config.productionTip = false;

new Vue({
  router,
  store, // 把 store 注入全局
  render: (h) => h(App),
}).$mount("#app");
