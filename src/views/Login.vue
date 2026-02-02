<template>
  <div class="login-wrapper">
    <div class="login">
      <h2 class="title">系统登录</h2>

      <el-form @submit.native.prevent="handleLogin" class="login-form">
        <el-form-item>
          <el-input
            v-model="username"
            placeholder="请输入用户名"
            prefix-icon="el-icon-user"
            clearable
          />
        </el-form-item>

        <el-form-item>
          <el-input
            type="password"
            v-model="password"
            placeholder="请输入密码"
            prefix-icon="el-icon-lock"
            show-password
            @keyup.enter.native="handleLogin"
          />
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            class="login-btn"
            :loading="loading"
            @click="handleLogin"
          >
            登录
          </el-button>
        </el-form-item>
      </el-form>

      <el-alert
        v-if="errorMsg"
        :title="errorMsg"
        type="error"
        show-icon
        :closable="false"
        class="error-alert"
      />
    </div>
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
      loading: false,
    };
  },
  methods: {
    async handleLogin() {
      if (this.loading) return;

      this.loading = true;
      this.errorMsg = "";
      try {
        // 调用 Vuex 的 login action
        await this.$store.dispatch("user/login", {
          username: this.username,
          password: this.password,
        });
        // 登录成功后跳转到首页
        this.$router.push("/");
      } catch (err) {
        this.errorMsg = err.message || "登录失败";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
/* 整体背景 */
.login-wrapper {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #f0f2f5, #e6ebf5);
}

/* 登录卡片 */
.login {
  width: 380px;
  padding: 32px 28px 24px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

/* 标题 */
.title {
  text-align: center;
  font-size: 22px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 30px;
}

/* 表单 */
.login-form {
  margin-bottom: 10px;
}

/* 登录按钮 */
.login-btn {
  width: 100%;
  height: 40px;
  font-size: 16px;
}

/* 错误提示 */
.error-alert {
  margin-top: 16px;
}
</style>
