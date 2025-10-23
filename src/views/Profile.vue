<template>
  <div class="profile">
    <el-card>
      <div slot="header">
        <span>个人中心</span>
      </div>

      <el-form
        :model="profileForm"
        :rules="profileRules"
        ref="profileForm"
        label-width="100px"
      >
        <el-form-item label="用户名">
          <el-input v-model="profileForm.username" disabled></el-input>
        </el-form-item>

        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="profileForm.nickname"></el-input>
        </el-form-item>

        <el-form-item label="邮箱" prop="email">
          <el-input v-model="profileForm.email"></el-input>
        </el-form-item>

        <el-form-item label="手机号" prop="phone">
          <el-input v-model="profileForm.phone"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            @click="updateProfile"
            :loading="loading.profile"
            >保存信息
          </el-button>
        </el-form-item>
      </el-form>

      <el-divider style="width: 100%"></el-divider>

      <h3>修改密码</h3>
      <el-form
        :model="passwordForm"
        :rules="passwordRules"
        ref="passwordForm"
        label-width="100px"
      >
        <el-form-item label="原密码" prop="oldPassword">
          <el-input
            type="password"
            v-model="passwordForm.oldPassword"
          ></el-input>
        </el-form-item>

        <el-form-item label="新密码" prop="newPassword">
          <el-input
            type="password"
            v-model="passwordForm.newPassword"
          ></el-input>
        </el-form-item>

        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            type="password"
            v-model="passwordForm.confirmPassword"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            class="my-button"
            type="primary"
            @click="changePassword"
            :loading="loading.password"
            >修改密码
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import { getUserInfo, updateCurrentUser, updatePassword } from "@/api/user";

export default {
  name: "Profile",
  data() {
    return {
      profileForm: {
        username: "",
        nickname: "",
        email: "",
        phone: "",
      },
      profileRules: {
        nickname: [{ required: true, message: "请输入昵称", trigger: "blur" }],
        email: [
          { type: "email", message: "请输入正确的邮箱地址", trigger: "blur" },
        ],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
      },
      passwordForm: {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
      passwordRules: {
        oldPassword: [
          { required: true, message: "请输入原密码", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "请输入新密码", trigger: "blur" },
          { min: 6, message: "密码长度不能少于6位", trigger: "blur" },
        ],
        confirmPassword: [
          { required: true, message: "请确认新密码", trigger: "blur" },
          { validator: this.validateConfirmPassword, trigger: "blur" },
        ],
      },
      loading: {
        profile: false,
        password: false,
      },
    };
  },
  created() {
    this.loadProfile();
  },
  methods: {
    validateConfirmPassword(rule, value, callback) {
      if (value !== this.passwordForm.newPassword) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    },

    loadProfile() {
      // 从 store 获取用户信息
      const userInfo = this.$store.getters.userInfo;
      if (userInfo) {
        this.profileForm = {
          username: userInfo.username,
          nickname: userInfo.nickname || "",
          email: userInfo.email || "",
          phone: userInfo.phone || "",
        };
      }
    },

    async updateProfile() {
      this.$refs.profileForm.validate(async (valid) => {
        if (valid) {
          this.loading.profile = true;
          try {
            // 调用API更新用户信息
            await updateCurrentUser(this.profileForm);
            this.$message.success("个人信息更新成功");
            const userInfo = await getUserInfo();
            // 更新 Vuex 中的用户信息
            this.$store.commit("setUserInfo", userInfo.data);
          } catch (error) {
            this.$message.error("更新失败: " + (error.message || "未知错误"));
          } finally {
            this.loading.profile = false;
          }
        }
      });
    },

    async changePassword() {
      this.$refs.passwordForm.validate(async (valid) => {
        if (valid) {
          this.loading.password = true;
          try {
            // 调用API修改密码
            await updatePassword({
              oldPassword: this.passwordForm.oldPassword,
              newPassword: this.passwordForm.newPassword,
            });
            this.$message.success("密码修改成功");
            // 重置表单
            this.$refs.passwordForm.resetFields();
          } catch (error) {
            this.$message.error("修改失败: " + (error.message || "未知错误"));
          } finally {
            this.loading.password = false;
          }
        }
      });
    },
  },
};
</script>

<style scoped>
.profile {
  /* padding: 20px; */
}

.el-card {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.el-form {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

::v-deep(.el-card__header) {
  width: 100%;
}

::v-deep(.el-card__body) {
  width: 100%;

  .el-input {
    width: 240px;
  }
  .el-form-item {
    width: 400px;
  }
}

::v-deep(.el-form-item__content) {
  margin-left: 0px;
  width: 200px;
}
</style>
