<template>
  <div class="menu-management">
    <el-row :gutter="20">
      <!-- 左侧菜单树 -->
      <el-col :span="6">
        <el-card class="menu-tree-card">
          <div slot="header" class="card-header">
            <span>菜单树</span>
            <el-button
              v-permission="'btn:user:system:menu:create'"
              type="primary"
              size="mini"
              @click="showCreateDialog(null)"
              style="float: right"
            >
              新增根菜单
            </el-button>
          </div>

          <el-tree
            :data="menuTree"
            node-key="id"
            :props="{ label: 'menuName', children: 'children' }"
            @node-click="handleNodeClick"
            highlight-current
            :default-expand-all="true"
            class="custom-menu-tree"
          >
            <span slot-scope="{ node, data }" class="custom-tree-node">
              <i :class="resolveIcon(data.icon)" class="menu-icon"></i>
              <span class="menu-label">{{ data.menuName }}</span>
            </span>
          </el-tree>
        </el-card>
      </el-col>

      <!-- 右侧菜单表单 -->
      <el-col :span="18">
        <el-card class="menu-detail-card">
          <div slot="header" class="card-header">
            <span>{{ isEdit ? "编辑菜单" : "创建菜单" }}</span>
          </div>

          <el-form
            v-if="menuForm"
            ref="menuForm"
            :model="menuForm"
            :rules="menuRules"
            label-width="100px"
          >
            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="菜单名称" prop="menuName">
                  <el-input
                    v-model="menuForm.menuName"
                    placeholder="请输入菜单名称"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="权限标识" prop="menuCode">
                  <el-input
                    v-model="menuForm.menuCode"
                    placeholder="如：menu:create"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="菜单类型" prop="menuType">
                  <el-radio-group v-model="menuForm.menuType">
                    <el-radio :label="1">目录</el-radio>
                    <el-radio :label="2">菜单</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="上级菜单" prop="parentId">
                  <el-select
                    v-model="menuForm.parentId"
                    placeholder="请选择上级菜单"
                    clearable
                  >
                    <el-option
                      v-for="menu in parentMenuOptions"
                      :key="menu.id"
                      :label="menu.menuName"
                      :value="menu.id"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="路由地址" prop="path">
                  <el-input
                    v-model="menuForm.path"
                    placeholder="如：/system/user"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="组件路径" prop="component">
                  <el-input
                    v-model="menuForm.component"
                    placeholder="如：views/system/user/index"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="12">
                <el-form-item label="图标" prop="icon">
                  <el-input
                    v-model="menuForm.icon"
                    placeholder="el-icon-menu"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="排序" prop="sortOrder">
                  <el-input-number
                    v-model="menuForm.sortOrder"
                    :min="0"
                    controls-position="right"
                  />
                </el-form-item>
              </el-col>
            </el-row>

            <el-form-item label="状态" prop="status">
              <el-switch
                v-model="menuForm.status"
                :active-value="1"
                :inactive-value="0"
                active-text="启用"
                inactive-text="禁用"
              />
            </el-form-item>

            <div style="margin-top: 20px; text-align: right">
              <el-button @click="resetForm">重 置</el-button>
              <el-button
                v-permission="'btn:user:system:menu:delete'"
                type="danger"
                @click="deleteMenu(menuForm)"
                v-if="menuForm.id"
              >
                删 除
              </el-button>
              <el-button
                v-permission="'btn:user:system:menu:create'"
                type="primary"
                @click="saveMenu"
              >
                保 存
              </el-button>
            </div>
          </el-form>

          <div v-else class="empty-hint">
            <el-empty description="请选择菜单节点或新建菜单"></el-empty>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import {
  createMenu,
  deleteMenu,
  updateMenu,
  getMenuById,
  getAllMenus,
} from "@/api/user";

export default {
  name: "MenuManagement",
  data() {
    return {
      loading: false,
      menuTree: [],
      menuForm: null,
      isEdit: false,
      menuRules: {
        menuName: [
          { required: true, message: "请输入菜单名称", trigger: "blur" },
        ],
        menuCode: [
          { required: true, message: "请输入权限标识", trigger: "blur" },
        ],
        path: [{ required: true, message: "请输入路由地址", trigger: "blur" }],
      },
    };
  },
  computed: {
    parentMenuOptions() {
      const options = [];
      const traverse = (menus) => {
        menus.forEach((menu) => {
          if (menu.menuType === 1) {
            options.push({ id: menu.id, menuName: menu.menuName });
            if (menu.children && menu.children.length > 0)
              traverse(menu.children);
          }
        });
      };
      traverse(this.menuTree);
      return options;
    },
  },
  created() {
    this.fetchMenuTree();
  },
  methods: {
    async fetchMenuTree() {
      this.loading = true;
      try {
        const res = await getAllMenus();
        this.menuTree = res.data || [];
      } finally {
        this.loading = false;
      }
    },
    async handleNodeClick(node) {
      try {
        const res = await getMenuById(node.id);
        this.menuForm = { ...res.data };
        this.isEdit = true;
      } catch (err) {
        this.$message.error("加载菜单详情失败");
      }
    },
    showCreateDialog(parent) {
      this.menuForm = {
        id: null,
        menuName: "",
        menuCode: "",
        menuType: 1,
        parentId: parent ? parent.id : null,
        path: "",
        component: "",
        icon: "",
        sortOrder: 0,
        status: 1,
      };
      this.isEdit = false;
    },
    saveMenu() {
      this.$refs.menuForm.validate(async (valid) => {
        if (!valid) return;
        const formData = { ...this.menuForm };
        try {
          if (this.isEdit) {
            await updateMenu(formData.id, formData);
            this.$message.success("更新成功");
          } else {
            await createMenu(formData);
            this.$message.success("创建成功");
          }
          this.fetchMenuTree();
        } catch (err) {
          this.$message.error("保存失败");
        }
      });
    },
    async deleteMenu(menu) {
      if (!menu.id) return;
      try {
        await this.$confirm(`确定要删除菜单「${menu.menuName}」吗？`, "提示", {
          type: "warning",
        });
        await deleteMenu(menu.id);
        this.$message.success("删除成功");
        this.menuForm = null;
        this.fetchMenuTree();
      } catch (err) {
        // 用户取消或失败
      }
    },
    resetForm() {
      if (this.menuForm?.id) this.handleNodeClick(this.menuForm);
      else this.showCreateDialog(null);
    },
    resolveIcon(icon) {
      return icon
        ? icon.startsWith("el-icon-")
          ? icon
          : `el-icon-${icon}`
        : "el-icon-menu";
    },
  },
};
</script>

<style scoped>
.menu-management {
  padding: 20px;
}
.menu-tree-card,
.menu-detail-card {
  height: calc(100vh - 160px);
  overflow: auto;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.custom-tree-node {
  display: flex;
  align-items: center;
}
.empty-hint {
  padding: 60px 0;
}

.custom-menu-tree {
  --indent-size: 14px;
  font-size: 14px;
}

.custom-menu-tree ::v-deep(.el-tree-node__content) {
  height: 34px;
  border-radius: 4px;
  transition: background 0.2s;
}

.custom-menu-tree ::v-deep(.el-tree-node__content:hover) {
  background-color: #f5f7fa;
}

.custom-tree-node {
  display: flex;
  align-items: center;
}

.menu-icon {
  color: #909399;
  margin-right: 8px;
  font-size: 14px;
}

.menu-label {
  font-weight: 500;
}

.custom-menu-tree ::v-deep(.el-tree-node__children) {
  margin-left: 12px;
  border-left: 1px dashed #ebeef5;
  padding-left: 8px;
}
</style>
