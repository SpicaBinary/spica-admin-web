<template>
  <div class="dashboard">
    <!-- 使用 Element UI 的卡片组件 -->
    <el-card class="welcome-card">
      <div slot="header">
        <span>欢迎信息</span>
      </div>
      <div v-if="userInfo">
        <h2>欢迎你，{{ userInfo.username }}</h2>
        <p>用户ID: {{ userInfo.id }}</p>
        <p>邮箱: {{ userInfo.email || "未设置" }}</p>
        <p>注册时间: {{ userInfo.createTime || "未知" }}</p>
      </div>
      <p>这是登录后才能访问的页面</p>
      <!-- 权限控制 -->
      <el-button v-permission="'user:create'">创建用户</el-button>
      <!-- 角色控制 -->
      <el-button v-role="'ADMIN'">管理员功能</el-button>
      <!-- 使用 Element UI 的按钮组件 -->
      <el-button type="danger" @click="logout">退出登录</el-button>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  computed: {
    // 从 Vuex 中获取用户信息
    userInfo() {
      return this.$store.getters.userInfo;
    },
  },
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
