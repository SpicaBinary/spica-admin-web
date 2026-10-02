import Vue from "vue";
import Vuex from "vuex";

// 标签页管理模块
import tabs from "./modules/tabs";
// 用户信息管理模块
import user from "./modules/user";

Vue.use(Vuex);

// 创建并导出 Vuex store 实例
export default new Vuex.Store({
  // 模块化配置 - 将 store 分割成不同的模块
  modules: {
    // 所有user的commit/dispatch都要加命名空间，如： this.$store.dispatch("user/logout");
    user,
    tabs,
  },
});
