<template>
  <div class="app-wrapper">
    <!-- 引入独立的菜单组件 -->
    <Sidebar />

    <!-- 主体区域 -->
    <div class="main-container">
      <!-- 头部 -->
      <el-header class="header-container">
        <div class="navbar">
          <div class="breadcrumb"></div>
          <div class="right-menu">
            <span v-if="userInfo">欢迎，{{ userInfo.username }}</span>
            <el-button
              type="danger"
              size="small"
              @click="logout"
              style="margin-left: 20px"
            >
              退出登录
            </el-button>
          </div>
        </div>
      </el-header>

      <!-- 标签页视图区域 -->
      <TabsView />

      <!-- 内容区域 -->
      <el-main class="app-main">
        <router-view />
      </el-main>
    </div>
  </div>
</template>

<script>
import Sidebar from "./Sidebar.vue";
// 引入 TabsView 组件
import TabsView from "./TabsView.vue";

export default {
  name: "Layout",
  components: { Sidebar, TabsView },
  computed: {
    userInfo() {
      return this.$store.getters["user/userInfo"];
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
}

.header-container {
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  padding: 0;
  height: 60px;
  line-height: 60px;
  position: relative;
}

.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
  padding: 0 20px;
}

.right-menu {
  display: flex;
  align-items: center;
}

.app-main {
  flex: 1;
  padding: 20px;
  overflow: auto;
  background-color: #f0f2f5;
}
</style>
