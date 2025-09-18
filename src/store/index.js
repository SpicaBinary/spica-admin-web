import Vue from "vue";
import Vuex from "vuex";
import { loginApi } from "@/api/auth";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 全局状态：存储用户 token
    token: null,
  },
  // mutations：修改state的唯一入口
  mutations: {
    // 设置 token（登录时调用）
    setToken(state, token) {
      state.token = token;
    },
    // 清除 token（退出时调用）
    clearToken(state) {
      state.token = null;
    },
  },
  // actions：处理异步逻辑（像 Java Service 层）
  actions: {
    async login({ commit }, { username, password }) {
      try {
        const res = await loginApi({ username, password });
        commit("setToken", res.token); // 后端返回的 token
      } catch (err) {
        throw err;
      }
    },
    // 退出登录
    logout({ commit }) {
      commit("clearToken");
    },
  },
  // getters：数据的派生计算
  getters: {
    // 获取登录状态：是否有 token
    isLoggedIn: (state) => !!state.token,
  },
});
