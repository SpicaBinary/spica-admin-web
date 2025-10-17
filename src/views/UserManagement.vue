<template>
  <div class="user-management">
    <el-card>
      <div slot="header">
        <span>用户管理</span>
        <el-button
          v-permission="'user:create'"
          type="primary"
          size="small"
          @click="showCreateDialog"
          style="float: right"
        >
          新增用户
        </el-button>
      </div>

      <!-- 用户搜索 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input
            v-model="searchForm.username"
            placeholder="请输入用户名"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchUsers">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 用户列表 -->
      <el-table :data="userList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="username" label="用户名"></el-table-column>
        <el-table-column prop="nickname" label="昵称"></el-table-column>
        <el-table-column prop="email" label="邮箱"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
        ></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              v-permission="'user:update'"
              size="mini"
              @click="editUser(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-permission="'user:delete'"
              size="mini"
              type="danger"
              @click="deleteUser(scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 50]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        style="margin-top: 20px; text-align: right"
      >
      </el-pagination>
    </el-card>

    <!-- 新增/编辑用户对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="userForm" :rules="userRules" ref="userForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="userForm.nickname"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="userForm.phone"></el-input>
        </el-form-item>
        <el-form-item v-if="!isEdit" label="密码" prop="password">
          <el-input v-model="userForm.password" type="password"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUser">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getUserList } from "@/api/user";

export default {
  name: "UserManagement",
  data() {
    return {
      loading: false,
      userList: [],
      searchForm: {
        username: "",
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      dialogVisible: false,
      dialogTitle: "",
      isEdit: false,
      userForm: {
        id: null,
        username: "",
        nickname: "",
        email: "",
        phone: "",
        password: "",
      },
      userRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        email: [
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  created() {
    this.fetchUserList();
  },
  methods: {
    // 获取用户列表
    async fetchUserList() {
      this.loading = true;
      try {
        // 传递分页参数给后端
        const params = {
          current: this.pagination.currentPage,
          size: this.pagination.pageSize,
          username: this.searchForm.username,
        };

        const response = await getUserList(params);
        this.userList = response.data.records || [];
        this.pagination.total = response.data.total || 0;
        this.pagination.pageSize = response.data.size || 10;
        this.pagination.currentPage = response.data.current || 1;
      } catch (error) {
        this.$message.error("获取用户列表失败: " + (error.message || ""));
      } finally {
        this.loading = false;
      }
    },

    // 搜索用户
    searchUsers() {
      this.pagination.currentPage = 1;
      this.fetchUserList();
    },

    // 重置搜索
    resetSearch() {
      this.searchForm.username = "";
      this.searchUsers();
    },

    // 分页相关
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1; // 页码大小改变时回到第一页
      this.fetchUserList();
    },

    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.fetchUserList();
    },

    // 显示创建对话框
    showCreateDialog() {
      this.dialogTitle = "新增用户";
      this.isEdit = false;
      this.userForm = {
        id: null,
        username: "",
        nickname: "",
        email: "",
        phone: "",
        password: "",
      };
      this.dialogVisible = true;
    },

    // 编辑用户
    editUser(user) {
      this.dialogTitle = "编辑用户";
      this.isEdit = true;
      this.userForm = { ...user };
      this.dialogVisible = true;
    },

    // 保存用户
    saveUser() {
      this.$refs.userForm.validate((valid) => {
        if (valid) {
          // 这里应该调用API保存用户
          this.$message.success(this.isEdit ? "用户更新成功" : "用户创建成功");
          this.dialogVisible = false;
          this.fetchUserList();
        }
      });
    },

    // 删除用户
    deleteUser(user) {
      this.$confirm(`确定要删除用户 ${user.username} 吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          // 这里应该调用API删除用户
          this.$message.success("删除成功");
          this.fetchUserList();
        })
        .catch(() => {
          // 取消删除
        });
    },
  },
};
</script>

<style scoped>
.user-management {
  padding: 20px;
}

.search-form {
  margin-bottom: 20px;
}
</style>
