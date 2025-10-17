<template>
  <div class="app-wrapper">
    <!-- 侧边栏 -->
    <el-aside width="200px" class="sidebar-container">
      <div class="logo-container">
        <h2 class="logo-title">后台管理系统</h2>
      </div>
      <el-menu
        :default-active="activeMenu"
        class="el-menu-vertical"
        @select="handleMenuSelect"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
        router
      >
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>
          <span slot="title">首页</span>
        </el-menu-item>

        <!-- 用户管理菜单项 -->
        <el-menu-item index="/user" v-permission="'user:menu'">
          <i class="el-icon-user"></i>
          <span slot="title">用户管理</span>
        </el-menu-item>

        <!-- 可以继续添加其他菜单项 -->
        <el-menu-item index="/order" v-permission="'order:menu'">
          <i class="el-icon-s-order"></i>
          <span slot="title">订单管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

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

      <!-- 内容区域 -->
      <el-main class="app-main">
        <router-view />
      </el-main>
    </div>
  </div>
</template>

<script>
export default {
  name: "Layout",
  computed: {
    activeMenu() {
      return this.$route.path;
    },
    userInfo() {
      return this.$store.getters.userInfo;
    },
  },
  methods: {
    handleMenuSelect(index) {
      // 菜单选择处理
      console.log("选中菜单:", index);
    },
    logout() {
      this.$store.dispatch("logout");
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

.sidebar-container {
  background-color: #304156;
  transition: width 0.28s;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  position: relative;
  z-index: 1001;
  overflow: hidden;
}

.logo-container {
  height: 60px;
  line-height: 60px;
  background-color: #253341;
  text-align: center;
  overflow: hidden;
}

.logo-title {
  color: #fff;
  font-size: 16px;
  margin: 0;
  font-weight: 600;
}

.el-menu-vertical {
  height: calc(100% - 60px);
  border: none;
  width: 100% !important;
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

.breadcrumb {
  flex: 1;
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

/* 滚动条样式优化 */
.app-main::-webkit-scrollbar {
  width: 6px;
}

.app-main::-webkit-scrollbar-thumb {
  background-color: #909399;
  border-radius: 4px;
}
</style>
