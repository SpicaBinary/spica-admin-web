import { loginApi, logoutApi } from "@/api/auth";
import { getCurrentUserMenus, getUserInfo } from "@/api/user";
import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

// 页面刷新时从 localStorage 里恢复用户状态
const savedToken = localStorage.getItem("token");
const savedUserInfo = localStorage.getItem("userInfo");
const savedUserMenus = localStorage.getItem("userMenus");
const savedUserPermissions = localStorage.getItem("userPermissions");

export default new Vuex.Store({
  state: {
    // 全局状态：存储用户 token
    token: savedToken || null,
    // 用户信息
    userInfo: savedUserInfo ? JSON.parse(savedUserInfo) : null,
    // 全局loading信息，用于调用接口时显示 loading
    loading: false,
    // 当前用户的权限码
    userPermissions: savedUserPermissions
      ? JSON.parse(savedUserPermissions)
      : [],
    // 当前用户的菜单树
    userMenus: savedUserMenus ? JSON.parse(savedUserMenus) : [],
  },
  // mutations：修改state的唯一入口
  mutations: {
    // 设置 token（登录时调用）
    setToken(state, token) {
      state.token = token;
      localStorage.setItem("token", token);
    },
    // 清除 token（退出时调用）
    clearToken(state) {
      state.token = null;
      localStorage.removeItem("token");
    },
    // 设置用户信息
    setUserInfo(state, userInfo) {
      state.userInfo = userInfo;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    },
    // 清除用户信息
    clearUserInfo(state) {
      state.userInfo = null;
      localStorage.removeItem("userInfo");
    },
    setUserPermissions(state, userPermissions) {
      state.userPermissions = userPermissions;
      localStorage.setItem("userPermissions", JSON.stringify(userPermissions));
    },
    clearUserPermissions(state) {
      state.userPermissions = [];
      localStorage.removeItem("userPermissions");
    },
    setUserMenus(state, userMenus) {
      state.userMenus = userMenus;
      localStorage.setItem("userMenus", JSON.stringify(userMenus));
    },
    clearUserMenus(state) {
      state.userMenus = [];
      localStorage.removeItem("userMenus");
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
        // 登录失败，抛错
        if (res.code !== "200") {
          throw new Error(res.message || "登录失败");
        }
        commit("setToken", res.data);
        // 登录成功后获取用户信息
        const userInfo = await getUserInfo();
        commit("setUserInfo", userInfo.data);
        // 登录成功后获取用户权限
        // TODO可以拆一个权限接口
        commit("setUserPermissions", userInfo.data.permissions || []);
        // 登录成功后获取用户的菜单信息
        const userMenus = await getCurrentUserMenus();
        commit("setUserMenus", userMenus.data || []);
      } catch (err) {
        throw err;
      }
    },
    // 退出登录
    async logout({ commit }, skipApiCall = false) {
      try {
        commit("setLoading", true);
        // 只有在主动触发 logout 时才调用 API
        if (!skipApiCall) {
          await logoutApi();
        }
      } catch (error) {
        console.error("Logout API error:", error);
      } finally {
        commit("clearToken");
        commit("clearUserInfo");
        commit("clearUserMenus");
        commit("clearUserPermissions");
        commit("setLoading", false);
      }
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
    permissions: (state) => state.userPermissions || [],
    // 检查是否有某个权限
    hasPermission: (state) => (permission) => {
      return state.userPermissions?.includes(permission) || false;
    },
    // 检查是否有某个角色
    hasRole: (state) => (role) => {
      return state.userInfo?.roles?.includes(role) || false;
    },
    // 获取用户菜单
    userMenus: (state) => state.userMenus || [],
    // 页面loading状态
    isLoading: (state) => state.loading,
  },
});
