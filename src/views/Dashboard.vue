<template>
  <div class="dashboard">
    <!-- 使用 Element UI 的卡片组件 -->
    <el-card class="welcome-card">
      <div slot="header">
        <span>欢迎信息</span>
      </div>
      <h2>欢迎来到首页</h2>
      <p>这是登录后才能访问的页面</p>
      <!-- 使用 Element UI 的按钮组件 -->
      <el-button type="danger" @click="logout">退出登录</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  methods: {
    logout() {
      this.$store.dispatch("logout");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.dashboard {
  padding: 20px;
}

.welcome-card {
  width: 500px;
  margin: 50px auto;
}
</style>
