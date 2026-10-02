<template>
  <div class="app-wrapper">
    <!-- 侧边栏 -->
    <BaseSidebar :isCollapse.sync="isCollapse" />

    <!-- 主体区域 -->
    <div class="main-container">
      <!-- 顶栏 -->
      <el-header class="header-container">
        <div class="navbar">
          <div class="left-area">
            <!-- 折叠/展开按钮 -->
            <span class="hamburger" @click="isCollapse = !isCollapse">
              <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
            </span>
            <!-- 面包屑 -->
            <el-breadcrumb
              v-if="breadcrumbs.length"
              separator="/"
              class="breadcrumb"
            >
              <el-breadcrumb-item
                v-for="(crumb, idx) in breadcrumbs"
                :key="idx"
                :to="idx < breadcrumbs.length - 1 ? crumb.path : undefined"
              >
                {{ crumb.title }}
              </el-breadcrumb-item>
            </el-breadcrumb>
          </div>
          <div class="right-menu">
            <span class="welcome-text" v-if="userInfo">
              欢迎，<strong>{{ userInfo.username }}</strong>
            </span>
            <el-button
              type="danger"
              size="small"
              plain
              @click="logout"
              class="logout-btn"
            >
              退出登录
            </el-button>
          </div>
        </div>
      </el-header>

      <!-- 标签页 -->
      <TabsView />

      <!-- 内容区 -->
      <el-main class="app-main">
        <keep-alive :include="cachedViews">
          <router-view />
        </keep-alive>
      </el-main>
    </div>
  </div>
</template>

<script>
import BaseSidebar from "./BaseSidebar.vue";
import TabsView from "./TabsView.vue";

export default {
  name: "BaseLayout",
  components: { BaseSidebar, TabsView },
  data() {
    return {
      isCollapse: false,
    };
  },
  computed: {
    userInfo() {
      return this.$store.getters["user/userInfo"];
    },
    cachedViews() {
      return this.$store.getters["tabs/cachedViews"];
    },
    // 自动生成面包屑
    breadcrumbs() {
      const matched = this.$route.matched.filter(
        (r) => r.meta && r.meta.title
      );
      return matched.map((r) => ({
        title: r.meta.title,
        path: r.path,
      }));
    },
  },
  methods: {
    logout() {
      this.$store.dispatch("user/logout");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.app-wrapper {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}

/* ==================== 顶栏 ==================== */
.header-container {
  background-color: #ffffff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0;
  height: 60px;
  line-height: 60px;
  position: relative;
  z-index: 10;
  flex-shrink: 0;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.left-area {
  display: flex;
  align-items: center;
  gap: 16px;
}

/* ==================== 汉堡按钮 ==================== */
.hamburger {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  font-size: 20px;
  color: #595959;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.hamburger:hover {
  color: #409eff;
  background-color: rgba(64, 158, 255, 0.08);
}

.hamburger i {
  transition: transform 0.3s ease;
}

/* ==================== 面包屑 ==================== */
.breadcrumb {
  line-height: 1;
}

/* ==================== 右侧菜单 ==================== */
.right-menu {
  display: flex;
  align-items: center;
  gap: 12px;
}

.welcome-text {
  color: #595959;
  font-size: 14px;
}

.welcome-text strong {
  color: #303133;
}

.logout-btn {
  margin-left: 0 !important;
}

/* ==================== 内容区 ==================== */
.app-main {
  flex: 1;
  padding: 20px;
  overflow: auto;
  background-color: #f0f2f5;
}
</style>
