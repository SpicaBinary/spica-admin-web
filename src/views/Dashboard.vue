<template>
  <div class="dashboard">
    <h2>欢迎来到首页</h2>
    <p>这是登录后才能访问的页面</p>
    <button @click="logout">退出登录</button>
  </div>
</template>

<script>
export default {
  name: "Dashboard",
  methods: {
    logout() {
      this.$store.dispatch('logout')
      this.$router.push('/login')
    }
  }
}
</script>
