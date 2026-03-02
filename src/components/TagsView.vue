<template>
  <div class="tabs-view-container">
    <div
      v-for="item in visitedViews"
      :key="item.path"
      class="tab-item"
      :class="{ active: $route.path === item.path }"
      @click="go(item.path)"
    >
      <span class="tab-title">{{ item.title }}</span>
      <span v-if="!item.affix" class="tab-close" @click.stop="close(item.path)">
        ×
      </span>
    </div>
  </div>
</template>
<script>
export default {
  name: "TagsView",
  computed: {
    visitedViews() {
      return this.$store.getters["tags/visitedViews"];
    },
  },
  methods: {
    go(path) {
      // 相同路径则不处理
      if (this.$route.path === path) return;
      this.$router.push(path);
    },
    close(path) {
      const views = this.visitedViews;
      const index = views.findIndex((v) => v.path === path);

      this.$store.commit("tags/REMOVE_VIEW", path);

      if (this.$route.path === path) {
        const next = views[index + 1] || views[index - 1];
        this.$router.push(next ? next.path : "/");
      }
    },
  },
};
</script>
<style scoped>
.tabs-view-container {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #e6e6e6;
  padding: 0 10px;
  height: 35px;
  overflow-x: auto;
}

.tab-item {
  display: flex;
  align-items: center;
  height: 26px;
  padding: 0 10px;
  margin-right: 6px;
  background: #f5f5f5;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  white-space: nowrap;
  user-select: none;
}

.tab-item:hover {
  background: #e6f7ff;
}

.tab-item.active {
  background: #409eff;
  color: #fff;
}

.tab-title {
  margin-right: 6px;
}

.tab-close {
  font-size: 12px;
  opacity: 0.6;
}

.tab-close:hover {
  opacity: 1;
}
</style>
