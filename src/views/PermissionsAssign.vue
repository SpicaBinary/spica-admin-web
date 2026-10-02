<template>
  <div class="role-permission-container">
    <div class="role-grid">
      <!-- 左侧角色列表 -->
      <div class="left-panel panel-wrapper">
        <el-input
          v-model="roleKeyword"
          placeholder="搜索角色"
          clearable
          @input="filterRoles"
          style="margin-bottom: 10px"
        />
        <el-scrollbar style="height: calc(100% - 50px)">
          <el-menu
            class="role-menu"
            :default-active="String(activeRoleId)"
            @select="handleRoleSelect"
          >
            <el-menu-item
              v-for="role in filteredRoles"
              :key="role.id"
              :index="String(role.id)"
            >
              {{ role.roleName }}
            </el-menu-item>
          </el-menu>
        </el-scrollbar>
      </div>

      <!-- 右侧权限树 -->
      <div class="right-panel panel-wrapper">
        <div class="panel-title">权限分配</div>

        <el-tree
          ref="permissionTree"
          :data="permissionTree"
          :props="defaultProps"
          show-checkbox
          node-key="key"
          :check-strictly="true"
          :default-expanded-keys="expandedKeys"
          @check-change="handleCheckChange"
          class="permission-tree"
        />

        <div style="margin-top: 10px; text-align: right; padding-bottom: 5px">
          <el-button
            type="primary"
            @click="saveRolePermissions"
            v-permission="'btn:permission:assign'"
            >保存</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getAllMenuPermissionTree,
  getAllRoles,
  getRolePermissionKeys,
  assignRolePermissions,
} from "@/api/user";
export default {
  name: "PermissionsAssign",
  data() {
    return {
      roles: [], // 所有角色
      filteredRoles: [], // 搜索过滤后的角色
      roleKeyword: "",
      activeRoleId: null,
      permissionTree: [], // 菜单 + 按钮权限树
      expandedKeys: [],
      checkedKeys: [],
      loadingPermissions: false, // 添加加载状态
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  created() {
    this.loadRoles();
    this.loadPermissionTree();
  },
  methods: {
    // ============ 加载角色列表 =============
    async loadRoles() {
      const res = await getAllRoles();
      this.roles = res.data;
      this.filteredRoles = res.data;
    },

    // ============ 搜索角色 =============
    filterRoles() {
      const key = this.roleKeyword.toLowerCase();
      this.filteredRoles = this.roles.filter((r) =>
        r.roleName.toLowerCase().includes(key),
      );
    },

    // ============ 选择角色 =============
    async handleRoleSelect(roleId) {
      this.activeRoleId = parseInt(roleId);
      // 先清空之前的选择，完整清空树
      if (this.$refs.permissionTree) {
        const tree = this.$refs.permissionTree;
        tree.setCheckedKeys([]);
        tree.setCheckedNodes([]);
        tree.setCurrentKey(null);
      }
      await this.loadRolePermissions();
    },

    // ============ 加载权限树（菜单 + 按钮） =============
    async loadPermissionTree() {
      // 后台返回树结构
      const res = await getAllMenuPermissionTree();
      // 构建权限树唯一的id
      this.permissionTree = this.transformTree(res.data);
      // 展开节点：递归收集所有非叶子节点的 key
      this.expandedKeys = this.collectExpandedKeys(this.permissionTree);
    },
    //递归收集需要展开的 key
    collectExpandedKeys(tree) {
      let keys = [];
      tree.forEach((node) => {
        // 仅收集菜单或目录的 key，而不是按钮的 key
        if (node.children && node.children.length > 0) {
          keys.push(node.key);
          keys = keys.concat(this.collectExpandedKeys(node.children));
        }
      });
      return keys;
    },
    // ============ 加载角色现有权限（回显） =============
    async loadRolePermissions() {
      if (this.loadingPermissions) {
        return;
      }

      this.loadingPermissions = true;
      try {
        const res = await getRolePermissionKeys(this.activeRoleId);

        // 确保仍然是当前选中的角色
        if (this.activeRoleId) {
          this.checkedKeys = res.data;

          this.$nextTick(() => {
            this.$refs.permissionTree?.setCheckedKeys(this.checkedKeys);
          });
        }
      } finally {
        this.loadingPermissions = false;
      }
    },

    // ============ 保存权限分配 =============
    async saveRolePermissions() {
      const checked = this.$refs.permissionTree.getCheckedKeys();
      const halfChecked = this.$refs.permissionTree.getHalfCheckedKeys();

      const finalKeys = [...checked, ...halfChecked];

      // 修改为发送 permissionKeys 而不是 permissionIds
      await assignRolePermissions({
        roleId: this.activeRoleId,
        permissionKeys: finalKeys,
      });

      this.$message.success("权限保存成功");
    },
    // 拼接权限id，使用type-id的形式保证唯一性
    transformTree(tree) {
      return tree.map((node) => {
        // 展示名字
        node.label = `[${node.type}]-${node.label || node.name || ""}`;
        // 生成唯一 key
        node.key = `${node.type}-${node.id}`;
        // console.log(node.key);
        if (node.children && node.children.length > 0) {
          node.children = this.transformTree(node.children);
          // console.log(node.children);
        }
        return node;
      });
    },
    handleCheckChange(data, checked, indeterminate) {
      // data: 被点击的节点数据
      // checked: 节点是否被选中
      // indeterminate: 节点是否处于半选状态

      const tree = this.$refs.permissionTree;

      if (!tree || !checked) return; // 只处理选中情况

      // 获取当前节点
      const node = tree.getNode(data);

      // 向上递归选中所有父节点
      this.checkParentNodes(node, tree);
    },
    checkParentNodes(node, tree) {
      if (node.parent) {
        // 使用 setChecked 方法选中父节点，不触发事件循环
        tree.setChecked(node.parent, true, false);
        // 递归处理祖父节点
        this.checkParentNodes(node.parent, tree);
      }
    },
  },
};
</script>

<style scoped>
/* 容器高度保持 */
.role-permission-container {
  padding: 12px;
  height: calc(100vh - 100px);
  box-sizing: border-box;
}

.role-menu {
  border-right: 0px;
}

/* Grid 布局：左 25% 右 自适应，间隙 20px */
.role-grid {
  display: grid;
  grid-template-columns: 25% 1fr; /* 或者固定宽度： 280px 1fr */
  gap: 20px; /* 这就是两栏之间的间隔，不会影响内部布局 */
  height: 100%;
}

/* 统一的面板外壳，避免每列直接使用 el-col 导致的 padding 覆盖问题 */
.panel-wrapper {
  background: #ffffff;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
}

/* 保证左侧滚动区域占满高度 */
.left-panel .el-scrollbar {
  flex: 1;
}

/* 右侧树占满剩余高度 */
.permission-tree {
  border: 1px solid #ebeef5;
  padding: 10px;
  border-radius: 6px;
  flex: 1;
  overflow-y: auto;
  box-sizing: border-box;
}

.left-panel .el-menu-item {
  border-bottom: 1px solid #ebeef5;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #333;
  letter-spacing: 0.5px;
}
</style>
