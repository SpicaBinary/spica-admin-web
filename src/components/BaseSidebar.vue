<template>
  <div
    class="sidebar-wrapper"
    :class="{ collapsed: isCollapse }"
  >
    <!-- LOGO 区域 -->
    <div class="logo-container">
      <div class="logo-icon">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="24" height="24" rx="6" fill="#409eff"/>
          <path d="M7 8h10M7 12h10M7 16h7" stroke="#fff" stroke-width="2" stroke-linecap="round"/>
        </svg>
      </div>
      <transition name="logo-fade">
        <span v-show="!isCollapse" class="logo-title">后台管理系统</span>
      </transition>
    </div>

    <!-- 菜单区域 -->
    <div class="menu-scroll">
      <el-menu
        :default-active="activeMenu"
        :default-openeds="autoOpeneds"
        :collapse="isCollapse"
        :collapse-transition="false"
        class="sidebar-menu"
        @select="handleMenuSelect"
        background-color="transparent"
        text-color="#a4a8bb"
        active-text-color="#ffffff"
        router
      >
        <template v-for="item in menus">
          <!-- 叶子节点 -->
          <el-menu-item
            v-if="!item.children || item.children.length === 0"
            :key="`menu-item-${itemKey(item)}`"
            :index="item.path"
          >
            <i :class="resolveIcon(item.icon)"></i>
            <span slot="title">{{ item.menuName }}</span>
          </el-menu-item>

          <!-- 父级节点（有子级） -->
          <el-submenu
            v-else
            :key="`submenu-${itemKey(item)}`"
            :index="item.path"
            :class="{ 'active-parent': isParentActive(item) }"
            popper-class="sidebar-popper"
          >
            <template slot="title">
              <i :class="resolveIcon(item.icon)"></i>
              <span>{{ item.menuName }}</span>
            </template>
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
    </div>

    <!-- 底部折叠按钮 -->
    <div class="collapse-trigger" @click="toggleCollapse">
      <i :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'"></i>
    </div>
  </div>
</template>

<script>
export default {
  name: "BaseSidebar",
  props: {
    isCollapse: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    menus() {
      return this.$store.getters["user/userMenus"] || [];
    },
    activeMenu() {
      return this.$route.path;
    },
    // 自动展开包含当前激活路由的所有父级菜单
    autoOpeneds() {
      const opened = [];
      const walk = (items) => {
        if (!items) return;
        for (const item of items) {
          if (item.children && item.children.length) {
            // 检查子级是否包含当前激活路由
            if (this.hasActiveDescendant(item)) {
              opened.push(item.path);
            }
            walk(item.children);
          }
        }
      };
      walk(this.menus);
      return opened;
    },
  },
  methods: {
    handleMenuSelect(index) {
      console.log("选中菜单：", index);
    },
    resolveIcon(icon) {
      if (!icon) return "el-icon-menu";
      return icon.startsWith("el-icon-") ? icon : `el-icon-${icon}`;
    },
    itemKey(item) {
      return item.id != null ? `menu-${item.id}` : `menu-${item.path}`;
    },
    subKey(sub) {
      return sub.id != null ? `submenu-${sub.id}` : `submenu-${sub.path}`;
    },
    toggleCollapse() {
      this.$emit("update:isCollapse", !this.isCollapse);
    },
    // 判断该菜单项的子孙中是否包含当前激活路由
    hasActiveDescendant(item) {
      if (!item.children || !item.children.length) return false;
      return item.children.some(
        (child) =>
          child.path === this.activeMenu ||
          this.hasActiveDescendant(child)
      );
    },
    // 判断该一级菜单是否是当前激活路由的"父级"（用于折叠态高亮）
    isParentActive(item) {
      return (
        item.children &&
        item.children.length &&
        item.children.some(
          (child) =>
            child.path === this.activeMenu ||
            this.hasActiveDescendant(child)
        )
      );
    },
  },
};
</script>

<style scoped>
/* ==================== CSS 变量 ==================== */
.sidebar-wrapper {
  --sidebar-bg: #1d1e2c;
  --sidebar-logo-bg: #161724;
  --sidebar-hover-bg: rgba(255, 255, 255, 0.05);
  --sidebar-active-bg: rgba(64, 158, 255, 0.14);
  --sidebar-active-border: #409eff;
  --sidebar-text: #a4a8bb;
  --sidebar-text-active: #ffffff;
  --sidebar-collapse-trigger: rgba(255, 255, 255, 0.04);
  --sidebar-divider: rgba(255, 255, 255, 0.06);

  position: relative;
  height: 100vh;
  background-color: var(--sidebar-bg);
  display: flex;
  flex-direction: column;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;
  flex-shrink: 0;
}

/* ==================== 展开 / 折叠宽度 ==================== */
.sidebar-wrapper {
  width: 220px;
}
.sidebar-wrapper.collapsed {
  width: 64px;
}

/* ==================== LOGO 区域 ==================== */
.logo-container {
  height: 60px;
  background-color: var(--sidebar-logo-bg);
  display: flex;
  align-items: center;
  padding: 0 16px;
  gap: 12px;
  flex-shrink: 0;
  border-bottom: 1px solid var(--sidebar-divider);
}

.sidebar-wrapper.collapsed .logo-container {
  justify-content: center;
  padding: 0;
}

.logo-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-icon svg {
  width: 32px;
  height: 32px;
}

.logo-title {
  color: #ffffff;
  font-size: 17px;
  font-weight: 600;
  white-space: nowrap;
  letter-spacing: 0.5px;
}

/* logo 文字淡入淡出 */
.logo-fade-enter-active,
.logo-fade-leave-active {
  transition: opacity 0.2s ease;
}
.logo-fade-enter,
.logo-fade-leave-to {
  opacity: 0;
}

/* ==================== 菜单滚动区 ==================== */
.menu-scroll {
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.menu-scroll::-webkit-scrollbar {
  width: 4px;
}
.menu-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
}
.menu-scroll::-webkit-scrollbar-track {
  background: transparent;
}

/* ==================== el-menu 重置 ==================== */
.sidebar-menu {
  border-right: none !important;
}

/* ==================== 菜单项通用 ==================== */
.sidebar-menu :deep(.el-menu-item),
.sidebar-menu :deep(.el-submenu__title) {
  height: 48px;
  line-height: 48px;
  margin: 2px 8px;
  border-radius: 6px;
  padding-left: 20px !important;
  font-size: 14px;
  transition: all 0.2s ease;
  position: relative;
  color: var(--sidebar-text);
}

/* 折叠态菜单项居中 */
.sidebar-wrapper.collapsed .sidebar-menu :deep(.el-menu-item),
.sidebar-wrapper.collapsed .sidebar-menu :deep(.el-submenu__title) {
  padding-left: 0 !important;
  text-align: center;
}

/* ==================== Hover 效果 ==================== */
.sidebar-menu :deep(.el-menu-item:hover),
.sidebar-menu :deep(.el-submenu__title:hover) {
  background-color: var(--sidebar-hover-bg) !important;
  color: var(--sidebar-text-active) !important;
}

/* ==================== 激活态（叶子节点） ==================== */
.sidebar-menu :deep(.el-menu-item.is-active) {
  background: var(--sidebar-active-bg) !important;
  color: var(--sidebar-text-active) !important;
  font-weight: 500;
}

/* 激活态左侧指示条 */
.sidebar-menu :deep(.el-menu-item.is-active)::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: var(--sidebar-active-border);
  border-radius: 0 2px 2px 0;
}

/* ==================== SubMenu 展开态 ==================== */
.sidebar-menu :deep(.el-submenu.is-opened > .el-submenu__title) {
  color: var(--sidebar-text-active) !important;
}

/* Submenu 箭头颜色 */
.sidebar-menu :deep(.el-submenu__icon-arrow) {
  color: var(--sidebar-text);
  transition: color 0.2s;
}

.sidebar-menu :deep(.el-submenu__title:hover .el-submenu__icon-arrow) {
  color: var(--sidebar-text-active);
}

/* ==================== 父级菜单在折叠态下含激活子级时高亮 ==================== */
/*
  主流做法：折叠态下看不到二级菜单，
  但如果当前路由是某一级菜单的子级，该一级菜单图标应显示为激活态，
  告诉用户“你在这个分类下”。
*/
.sidebar-wrapper.collapsed .sidebar-menu :deep(.el-submenu.active-parent > .el-submenu__title) {
  color: var(--sidebar-text-active) !important;
  background: var(--sidebar-active-bg) !important;
}

/* 折叠态下 active-parent 的左侧指示条 */
.sidebar-wrapper.collapsed .sidebar-menu :deep(.el-submenu.active-parent > .el-submenu__title)::before {
  content: "";
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 3px;
  height: 20px;
  background: var(--sidebar-active-border);
  border-radius: 0 2px 2px 0;
}

/* ==================== 图标样式 ==================== */
.sidebar-menu :deep(.el-menu-item i),
.sidebar-menu :deep(.el-submenu__title i) {
  color: inherit;
  font-size: 16px;
  margin-right: 10px;
  transition: margin 0.3s;
}

.sidebar-wrapper.collapsed .sidebar-menu :deep(.el-menu-item i),
.sidebar-wrapper.collapsed .sidebar-menu :deep(.el-submenu__title i) {
  margin-right: 0;
}

/* ==================== 底部折叠触发器 ==================== */
.collapse-trigger {
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  cursor: pointer;
  color: var(--sidebar-text);
  background: var(--sidebar-collapse-trigger);
  border-top: 1px solid var(--sidebar-divider);
  transition: all 0.2s ease;
  font-size: 18px;
  user-select: none;
}

.collapse-trigger:hover {
  color: var(--sidebar-text-active);
  background: rgba(255, 255, 255, 0.06);
}

.collapse-trigger i {
  transition: transform 0.3s ease;
}
</style>

<!-- 全局样式（不带 scoped，用于 popper 弹出菜单 + 二级子菜单） -->
<style>
/* ==================== 折叠态弹出菜单样式 ==================== */
.sidebar-popper {
  background: #1e1f30 !important;
  border: 1px solid rgba(255, 255, 255, 0.08) !important;
  border-radius: 8px !important;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4) !important;
  padding: 4px 0 !important;
}

.sidebar-popper .el-menu-item {
  height: 40px;
  line-height: 40px;
  padding: 0 20px;
  color: #a4a8bb !important;
  background: transparent !important;
  transition: all 0.15s ease;
  font-size: 13px;
}

.sidebar-popper .el-menu-item:hover {
  background: rgba(255, 255, 255, 0.05) !important;
  color: #ffffff !important;
}

.sidebar-popper .el-menu-item.is-active {
  background: rgba(64, 158, 255, 0.14) !important;
  color: #ffffff !important;
}

/* ==================== 二级菜单（展开态）样式覆盖 ==================== */
.sidebar-menu .el-menu--inline {
  background: rgba(0, 0, 0, 0.15) !important;
}

.sidebar-menu .el-menu--inline .el-menu-item {
  padding-left: 56px !important;
  height: 42px;
  line-height: 42px;
  font-size: 13px;
}

.sidebar-menu .el-menu--inline .el-menu-item:hover {
  background: rgba(255, 255, 255, 0.04) !important;
}

.sidebar-menu .el-menu--inline .el-menu-item.is-active::before {
  left: 8px;
}
</style>
