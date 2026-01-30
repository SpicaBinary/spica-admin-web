<template>
  <el-aside width="200px" class="sidebar-container">
    <!-- LOGO -->
    <div class="logo-container">
      <h2 class="logo-title">后台管理系统</h2>
    </div>

    <!-- 动态菜单（router 模式） -->
    <el-menu
      :default-active="activeMenu"
      class="el-menu-vertical"
      @select="handleMenuSelect"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409eff"
      router
    >
      <!-- 具体菜单项 -->
      <template v-for="item in menus">
        <!-- 如果没有 children（叶子节点），渲染为 el-menu-item -->
        <el-menu-item
          v-if="!item.children || item.children.length === 0"
          :key="`menu-item-${itemKey(item)}`"
          :index="item.path"
        >
          <i :class="resolveIcon(item.icon)"></i>
          <span slot="title">{{ item.menuName }}</span>
        </el-menu-item>

        <!-- 有子菜单则渲染为 el-submenu（包含 children） -->
        <el-submenu v-else :key="`submenu-${itemKey(item)}`" :index="item.path">
          <!-- 子菜单标题 -->
          <template slot="title">
            <i :class="resolveIcon(item.icon)"></i>
            <span>{{ item.menuName }}</span>
          </template>

          <!-- 渲染二级（或多级）子项 -->
          <el-menu-item
            v-for="sub in item.children"
            :key="subKey(sub)"
            :index="sub.path"
          >
            {{ sub.menuName }}
          </el-menu-item>
        </el-submenu>
      </template>
    </el-menu>
  </el-aside>
</template>

<script>
export default {
  name: "Sidebar",
  computed: {
    // 从 Vuex 读取菜单数据
    menus() {
      // 用户当前的菜单
      const list = this.$store.getters['user/userMenus'] || [];
      return list;
    },

    // 用当前路由路径作为 active
    activeMenu() {
      return this.$route.path;
    },
  },
  methods: {
    handleMenuSelect(index) {
      // 当 el-menu 的某项被选中时触发（router 模式会自动导航）
      console.log("选中菜单：", index);
    },

    // 解析后端返回的 icon 字段，支持 'user' 或 'el-icon-user' 两种
    resolveIcon(icon) {
      if (!icon) return "el-icon-menu"; // 默认图标
      return icon.startsWith("el-icon-") ? icon : `el-icon-${icon}`;
    },

    // 避免 key 为空/重复，统一处理 item key（优先 id，再用 path）
    itemKey(item) {
      // 如果 id 存在且是数字或字符串就用 id，否则 fallback to path
      return item.id != null ? `menu-${item.id}` : `menu-${item.path}`;
    },

    subKey(sub) {
      return sub.id != null ? `submenu-${sub.id}` : `submenu-${sub.path}`;
    },
  },
};
</script>

<style scoped>
.sidebar-container {
  background-color: #304156;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  position: relative;
}

.logo-container {
  height: 60px;
  background-color: #253341;
  text-align: center;
  line-height: 60px;
}

.logo-title {
  color: #fff;
  font-size: 16px;
  font-weight: bold;
  margin: 0;
}

/* 保证菜单高度撑满并移除默认边框 */
.el-menu-vertical {
  height: calc(100% - 60px);
  border: none;
  width: 100% !important;
}
</style>
