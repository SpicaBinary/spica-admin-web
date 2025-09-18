import Vue from "vue";
import App from "./App.vue";
// 路由组件
import router from "./router";
// Vuex
import store from "./store";

Vue.config.productionTip = false;

new Vue({
  router,
  store, // 把 store 注入全局
  render: (h) => h(App),
}).$mount("#app");
