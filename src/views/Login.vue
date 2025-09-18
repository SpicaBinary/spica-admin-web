<template>
  <div class="login">
    <h2>登录页面</h2>
    <form @submit.prevent="handleLogin">
      <div>
        <label>用户名：</label>
        <input v-model="username" />
      </div>
      <div>
        <label>密码：</label>
        <input type="password" v-model="password" />
      </div>
      <button type="submit">登录</button>
    </form>
    <p v-if="errorMsg" style="color: red">{{ errorMsg }}</p>
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
        this.errorMsg = err.message;
      }
    },
  },
};
</script>
