<template>
  <div class="login">
    <h2>登录页面</h2>
    <!-- 使用 Element UI 的表单组件 -->
    <el-form @submit.native.prevent="handleLogin" class="login-form">
      <el-form-item label="用户名：">
        <!-- 使用 Element UI 的输入框组件 -->
        <el-input v-model="username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码：">
        <!-- 使用 Element UI 的密码输入框组件 -->
        <el-input
          type="password"
          v-model="password"
          placeholder="请输入密码"
          @keyup.enter.native="handleLogin"
        ></el-input>
      </el-form-item>
      <!-- 使用 Element UI 的按钮组件 -->
      <el-form-item>
        <el-button type="primary" @click="handleLogin">登录</el-button>
      </el-form-item>
    </el-form>
    <!-- 使用 Element UI 的消息提示组件 -->
    <el-alert
      v-if="errorMsg"
      :title="errorMsg"
      type="error"
      show-icon
      :closable="false"
    >
    </el-alert>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      username: "",
      password: "",
      errorMsg: "",
    };
  },
  methods: {
    async handleLogin() {
      try {
        // 调用 Vuex 的 login action
        await this.$store.dispatch("login", {
          username: this.username,
          password: this.password,
        });
        // 登录成功后跳转到首页
        this.$router.push("/");
      } catch (err) {
        this.errorMsg = err.message || "登录失败";
      }
    },
  },
};
</script>

<style scoped>
.login {
  width: 400px;
  margin: 100px auto;
  padding: 20px;
  border: 1px solid #eaeaea;
  border-radius: 8px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.login-form {
  margin-top: 30px;
}
</style>
