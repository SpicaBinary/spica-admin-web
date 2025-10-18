import Vue from "vue";
import Vuex from "vuex";
import { loginApi } from "@/api/auth";
import { getUserInfo } from "@/api/user";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    // 全局状态：存储用户 token
    token: null,
    // 用户信息
    userInfo: null,
    // 全局loading信息，用于调用接口时显示 loading
    loading: false,
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
    // 设置用户信息
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
    },
    // 清除用户信息
    clearUserInfo(state) {
      state.userInfo = null;
    },
    // 控制 loading 显示开关
    setLoading(state, flag) {
      state.loading = flag;
    },
  },
  // actions：处理异步逻辑（像 Java Service 层）
  actions: {
    async login({ commit }, { username, password }) {
      try {
        // 登录获取token
        const res = await loginApi({ username, password });
        commit("setToken", res.data);
        // 登录成功后获取用户信息
        const userInfo = await getUserInfo();
        commit("setUserInfo", userInfo.data);
      } catch (err) {
        throw err;
      }
    },
    // 退出登录
    logout({ commit }) {
      commit("clearToken");
      commit("clearUserInfo");
    },
  },
  // getters：数据的派生计算
  getters: {
    // 获取登录状态：是否有 token
    isLoggedIn: (state) => !!state.token,
    // 获取用户信息
    userInfo: (state) => state.userInfo,
    // 获取用户角色
    roles: (state) => state.userInfo?.roles || [],
    // 获取用户权限
    permissions: (state) => state.userInfo?.permissions || [],
    // 检查是否有某个权限
    hasPermission: (state) => (permission) => {
      return state.userInfo?.permissions?.includes(permission) || false;
    },
    // 检查是否有某个角色
    hasRole: (state) => (role) => {
      return state.userInfo?.roles?.includes(role) || false;
    },
    // 页面loading状态
    isLoading: (state) => state.loading,
  },
});
