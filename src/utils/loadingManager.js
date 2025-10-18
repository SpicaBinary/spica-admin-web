import { Loading } from "element-ui";
import store from "@/store";

// 私有变量（模块内维护）
// Element UI 的 Loading 实例
let loadingInstance = null;
// 当前正在进行的请求数量计数器
let requestCount = 0;
// 延迟显示 loading 的定时器
let timer = null;
// 延迟显示时间（毫秒），防止接口太快时 loading 闪烁
const DELAY = 200;

// 开启全局 loading
function startLoading() {
  // 只有在没有正在进行的请求时才创建新的 loading 实例
  if (requestCount === 0 && !loadingInstance) {
    // 延迟 200ms 显示 loading，避免接口太快时出现闪烁
    timer = setTimeout(() => {
      // 创建 Element UI 的全屏 Loading 遮罩
      loadingInstance = Loading.service({
        // 锁定滚动条
        lock: true,
        // 显示文本
        text: "加载中...",
        // 遮罩背景色
        background: "rgba(0, 0, 0, 0.3)",
      });
      // 更新 Vuex 中的 loading 状态
      store.commit("setLoading", true);
    }, DELAY);
  }
  // 增加请求数量计数
  requestCount++;
}

// 关闭全局 loading
function stopLoading() {
  // 减少请求数量计数
  requestCount--;
  // 确保计数不会小于 0
  requestCount = Math.max(requestCount, 0);
  // 当所有请求都完成时关闭 loading
  if (requestCount === 0) {
    // 清除延迟显示的定时器
    clearTimeout(timer);
    timer = null;
    // 如果存在 loading 实例则关闭它
    if (loadingInstance) {    
      loadingInstance.close();
      loadingInstance = null;
    }
    // 更新 Vuex 中的 loading 状态
    store.commit("setLoading", false);
  }
}

// 对外暴露的接口
export default {
  // 显示 loading 的方法
  show: startLoading,
  // 隐藏 loading 的方法
  hide: stopLoading,
};
