// 这是一个 Vuex 模块，用于管理页面标签（类似浏览器标签页的功能）

// 页面刷新时从 localStorage 里恢复tab状态
const savedState = JSON.parse(localStorage.getItem("tagsView") || "{}");

// 定义状态（state）- 存储应用的数据
const state = {
  // 用来存储用户访问过的页面信息的数组
  visitedViews: savedState.visitedViews || [],
  // 存储需要缓存的组件名称
  cachedViews: savedState.cachedViews || [],
};

// 定义状态变更的方法（mutations）- 同步修改状态
const mutations = {
  // 添加新的标签页到 visitedViews 数组中
  ADD_VIEW(state, view) {
    console.log("add-state", state);
    console.log("add-添加标签页：", view);
    // 检查是否已经存在相同的路径，如果存在则直接返回，不再添加（避免重复）
    if (state.visitedViews.some((v) => v.path === view.path)) return;

    // 将新的页面信息添加到数组末尾
    state.visitedViews.push({
      path: view.path, // 页面路径（如：/home、/about）
      title: view.meta.title || "未命名", // 页面标题，如果路由配置没有标题则显示"未命名"
      name: view.name, // 页面名称，需要记录组件名称，用于缓存
      affix: view.meta.affix || false,
    });
    // 如果组件需要缓存，添加到 cachedViews
    if (view.meta.cache !== false && view.name) {
      if (!state.cachedViews.includes(view.name)) {
        state.cachedViews.push(view.name);
      }
    }
    // 保存到 localStorage
    localStorage.setItem(
      "tagsView",
      JSON.stringify({
        visitedViews: state.visitedViews,
        cachedViews: state.cachedViews,
      }),
    );
  },

  // 从 visitedViews 数组中移除指定路径的标签页
  REMOVE_VIEW(state, path) {
    console.log("del-state", state);
    console.log("del-path", path);
    // 先找到要删除的view
    const viewToRemove = state.visitedViews.find((v) => v.path === path);
    // 使用 filter 方法过滤掉要删除的路径，返回不匹配的元素组成的新数组
    state.visitedViews = state.visitedViews.filter((v) => {
      // affix 的不允许删
      if (v.affix) return true;
      return v.path !== path;
    });

    // 从 cachedViews 中移除
    if (viewToRemove && viewToRemove.name) {
      const index = state.cachedViews.indexOf(viewToRemove.name);
      if (index > -1) {
        state.cachedViews.splice(index, 1);
      }
    }
    // 保存到 localStorage
    localStorage.setItem(
      "tagsView",
      JSON.stringify({
        visitedViews: state.visitedViews,
        cachedViews: state.cachedViews,
      }),
    );
  },
  // 清除所有标签页
  REMOVE_VIEW_ALL(state) {
    state.visitedViews = [];
    state.cachedViews = [];
    localStorage.removeItem("tagsView");
  },
};

// 定义计算属性（getters）
const getters = {
  // 获取所有访问过的页面列表
  visitedViews: (state) => state.visitedViews,
  cachedViews: (state) => state.cachedViews,
};

// 导出这个 Vuex 模块的配置
export default {
  // 开启命名空间，防止不同模块间的状态冲突
  namespaced: true,
  // 注册状态
  state,
  // 注册状态变更方法
  mutations,
  // 计算属性
  getters,
};
