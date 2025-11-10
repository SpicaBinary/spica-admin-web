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

            <!-- 权限管理区块 -->
            <el-divider>功能权限管理</el-divider>

            <el-table
              v-if="permissionList.length"
              :data="permissionList"
              style="width: 100%; margin-bottom: 20px"
            >
              <el-table-column
                prop="permissionName"
                label="权限名称"
                width="160"
              />
              <el-table-column prop="permissionCode" label="权限标识" />
              <el-table-column prop="type" label="类型" width="120">
                <template slot-scope="{ row }">
                  <el-tag v-if="row.type === 1">{{ "按钮" }}</el-tag>
                  <el-tag v-if="row.type === 2" type="warning">{{
                    "接口"
                  }}</el-tag>
                </template>
              </el-table-column>
              <el-table-column prop="status" label="状态" width="100">
                <template slot-scope="{ row }">
                  <el-tag :type="row.status === 1 ? 'success' : 'danger'">
                    {{ row.status === 1 ? "启用" : "禁用" }}
                  </el-tag>
                </template>
              </el-table-column>

              <!-- 在权限表格中添加操作列 -->
              <el-table-column label="操作" width="150">
                <template slot-scope="{ row }">
                  <el-button size="mini" @click="editPermission(row)"
                    >编辑</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    @click="deletePermission(row)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>

            <el-empty v-else description="暂无权限项"></el-empty>

            <el-button
              v-if="menuForm?.id"
              size="mini"
              type="primary"
              @click="showPermissionDialog()"
            >
              新增权限
            </el-button>

            <!-- 权限弹窗 -->
            <el-dialog
              :visible.sync="permDialogVisible"
              :title="editingPermission ? '编辑权限' : '新增权限'"
              width="550px"
            >
              <el-form
                ref="permissionForm"
                :model="permissionForm"
                :rules="permissionRules"
                label-width="100px"
              >
                <el-form-item label="权限名称" prop="permissionName">
                  <el-input
                    v-model="permissionForm.permissionName"
                    placeholder="请输入权限名称"
                  />
                </el-form-item>

                <el-form-item label="权限标识" prop="permissionCode">
                  <el-input
                    v-model="permissionForm.permissionCode"
                    placeholder="如：btn:user:add"
                  />
                </el-form-item>

                <el-form-item label="权限类型" prop="type">
                  <el-radio-group v-model="permissionForm.type">
                    <el-radio :label="1">页面按钮</el-radio>
                    <el-radio :label="2">接口权限</el-radio>
                  </el-radio-group>
                </el-form-item>

                <!-- 接口类型时才显示 -->
                <template v-if="permissionForm.type === 2">
                  <el-form-item label="接口URL" prop="url">
                    <el-input
                      v-model="permissionForm.url"
                      placeholder="如：/api/user/list"
                    />
                  </el-form-item>
                  <el-form-item label="请求方法" prop="method">
                    <el-select
                      v-model="permissionForm.method"
                      placeholder="选择HTTP方法"
                    >
                      <el-option label="GET" value="GET" />
                      <el-option label="POST" value="POST" />
                      <el-option label="PUT" value="PUT" />
                      <el-option label="DELETE" value="DELETE" />
                    </el-select>
                  </el-form-item>
                </template>

                <el-form-item label="状态" prop="status">
                  <el-switch
                    v-model="permissionForm.status"
                    :active-value="1"
                    :inactive-value="0"
                    active-text="启用"
                    inactive-text="禁用"
                  />
                </el-form-item>
              </el-form>

              <div slot="footer">
                <el-button @click="permDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="savePermission"
                  >保 存</el-button
                >
              </div>
            </el-dialog>

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
  getPermissionsByMenuId,
  createPermission,
  updatePermission,
  deletePermission,
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
      permissionRules: {
        permissionName: [
          { required: true, message: "请输入权限名称", trigger: "blur" },
        ],
        permissionCode: [
          { required: true, message: "请输入权限标识", trigger: "blur" },
        ],
        type: [
          { required: true, message: "请选择权限类型", trigger: "change" },
        ],
      },
      permissionList: [], // 当前菜单下的权限
      permDialogVisible: false,
      editingPermission: null,
      permissionForm: {
        id: null,
        permissionName: "",
        permissionCode: "",
        type: 1,
        url: "",
        method: "",
        status: 1,
        menuId: null,
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
        // 加载对应菜单的权限列表
        await this.fetchPermissions(node.id);
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
        menuId: null,
      };
      this.isEdit = false;
      this.permissionList = []; // 同时清空权限列表
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
            const response = await createMenu(formData);
            // 创建成功后设置当前菜单ID并清空权限列表
            this.menuForm.id = response.data.id;
            this.permissionList = [];
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
    async fetchPermissions(menuId) {
      const res = await getPermissionsByMenuId(menuId);
      this.permissionList = res.data || [];
    },

    showPermissionDialog() {
      this.editingPermission = null;
      this.permissionForm = {
        id: null,
        permissionName: "",
        permissionCode: "",
        type: 1,
        url: "",
        method: "",
        status: 1,
        menuId: null,
      };
      this.permDialogVisible = true;
    },

    editPermission(row) {
      this.editingPermission = row;
      this.permissionForm = { ...row };
      this.permDialogVisible = true;
    },

    async savePermission() {
      // 使用表单验证
      this.$refs.permissionForm.validate(async (valid) => {
        if (!valid) return;

        const payload = { ...this.permissionForm, menuId: this.menuForm.id };
        try {
          if (this.editingPermission) {
            await updatePermission(payload.id, payload);
            this.$message.success("更新成功");
          } else {
            await createPermission(payload);
            this.$message.success("新增成功");
          }
          this.permDialogVisible = false;
          this.fetchPermissions(this.menuForm.id);
        } catch (err) {
          this.$message.error("保存失败");
        }
      });
    },

    async deletePermission(row) {
      try {
        // 修复确认提示中的字段名错误
        await this.$confirm(
          `确定删除权限「${row.permissionName}」吗？`,
          "提示",
          {
            type: "warning",
          }
        );
        await deletePermission(row.id);
        this.$message.success("删除成功");
        this.fetchPermissions(this.menuForm.id);
      } catch (err) {
        // ignore
      }
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
