<template>
  <div class="order-management">
    <el-card>
      <div slot="header">
        <span>订单管理</span>
        <el-button
          type="primary"
          size="small"
          @click="showCreateDialog"
          style="float: right"
        >
          新增订单
        </el-button>
      </div>

      <!-- 订单搜索 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="订单号">
          <el-input
            v-model="searchForm.orderNo"
            placeholder="请输入订单号"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户ID">
          <el-input
            v-model="searchForm.userId"
            placeholder="请输入用户ID"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchOrders">搜索</el-button>
          <el-button @click="resetSearch">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 订单列表 -->
      <el-table :data="orderList" style="width: 100%" v-loading="loading">
        <el-table-column prop="id" label="ID" width="80"></el-table-column>
        <el-table-column prop="orderNo" label="订单号"></el-table-column>
        <el-table-column prop="userId" label="用户ID"></el-table-column>
        <el-table-column prop="amount" label="订单金额"></el-table-column>
        <el-table-column prop="status" label="订单状态">
          <template slot-scope="scope">
            <el-tag :type="getOrderStatusType(scope.row.status)">
              {{ getOrderStatusText(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180"
        ></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              v-permission="'order:update'"
              size="mini"
              @click="editOrder(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              v-permission="'order:delete'"
              size="mini"
              type="danger"
              @click="deleteOrder(scope.row)"
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

    <!-- 新增/编辑订单对话框 -->
    <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" width="500px">
      <el-form :model="orderForm" :rules="orderRules" ref="orderForm">
        <el-form-item label="订单号" prop="orderNo">
          <el-input v-model="orderForm.orderNo" :disabled="isEdit"></el-input>
        </el-form-item>
        <el-form-item label="用户ID" prop="userId">
          <el-input v-model="orderForm.userId"></el-input>
        </el-form-item>
        <el-form-item label="订单金额" prop="amount">
          <el-input v-model="orderForm.amount"></el-input>
        </el-form-item>
        <el-form-item label="订单状态" prop="status">
          <el-select v-model="orderForm.status" placeholder="请选择订单状态">
            <el-option label="待支付" value="PENDING"></el-option>
            <el-option label="已支付" value="PAID"></el-option>
            <el-option label="已取消" value="CANCELLED"></el-option>
            <el-option label="已完成" value="COMPLETED"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrder">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrderPage,
  createOrder,
  updateOrder,
  deleteOrder,
} from "@/api/order";

export default {
  name: "OrderManagement",
  data() {
    return {
      loading: false,
      orderList: [],
      searchForm: {
        orderNo: "",
        userId: "",
      },
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      dialogVisible: false,
      dialogTitle: "",
      isEdit: false,
      orderForm: {
        id: null,
        orderNo: "",
        userId: "",
        amount: "",
        status: "",
      },
      orderRules: {
        orderNo: [{ required: true, message: "请输入订单号", trigger: "blur" }],
        userId: [{ required: true, message: "请输入用户ID", trigger: "blur" }],
        amount: [
          { required: true, message: "请输入订单金额", trigger: "blur" },
        ],
        status: [
          { required: true, message: "请选择订单状态", trigger: "change" },
        ],
      },
    };
  },
  created() {
    this.fetchOrderList();
  },
  methods: {
    // 获取订单列表
    async fetchOrderList() {
      this.loading = true;
      try {
        const params = {
          current: this.pagination.currentPage,
          size: this.pagination.pageSize,
          ...this.searchForm,
        };

        const response = await getOrderPage(params);
        this.orderList = response.data.records || [];
        this.pagination.total = response.data.total || 0;
        this.pagination.pageSize = response.data.size || 10;
        this.pagination.currentPage = response.data.current || 1;
      } catch (error) {
        this.$message.error("获取订单列表失败: " + (error.message || ""));
      } finally {
        this.loading = false;
      }
    },

    // 搜索订单
    searchOrders() {
      this.pagination.currentPage = 1;
      this.fetchOrderList();
    },

    // 重置搜索
    resetSearch() {
      this.searchForm.orderNo = "";
      this.searchForm.userId = "";
      this.searchOrders();
    },

    // 分页相关
    handleSizeChange(val) {
      this.pagination.pageSize = val;
      this.pagination.currentPage = 1;
      this.fetchOrderList();
    },

    handleCurrentChange(val) {
      this.pagination.currentPage = val;
      this.fetchOrderList();
    },

    // 显示创建对话框
    showCreateDialog() {
      this.dialogTitle = "新增订单";
      this.isEdit = false;
      this.orderForm = {
        id: null,
        orderNo: "",
        userId: "",
        amount: "",
        status: "",
      };
      this.dialogVisible = true;
    },

    // 编辑订单
    editOrder(order) {
      this.dialogTitle = "编辑订单";
      this.isEdit = true;
      this.orderForm = { ...order };
      this.dialogVisible = true;
    },

    // 保存订单
    saveOrder() {
      this.$refs.orderForm.validate(async (valid) => {
        if (valid) {
          try {
            if (this.isEdit) {
              await updateOrder(this.orderForm);
              this.$message.success("订单更新成功");
            } else {
              await createOrder(this.orderForm);
              this.$message.success("订单创建成功");
            }
            this.dialogVisible = false;
            this.fetchOrderList();
          } catch (error) {
            this.$message.error(
              (this.isEdit ? "更新" : "创建") +
                "订单失败: " +
                (error.message || "")
            );
          }
        }
      });
    },

    // 删除订单
    deleteOrder(order) {
      this.$confirm(`确定要删除订单 ${order.orderNo} 吗？`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          try {
            await deleteOrder(order.id);
            this.$message.success("删除成功");
            this.fetchOrderList();
          } catch (error) {
            this.$message.error("删除失败: " + (error.message || ""));
          }
        })
        .catch(() => {
          // 取消删除
        });
    },

    // 获取订单状态文本
    getOrderStatusText(status) {
      const statusMap = {
        PENDING: "待支付",
        PAID: "已支付",
        CANCELLED: "已取消",
        COMPLETED: "已完成",
      };
      return statusMap[status] || status;
    },

    // 获取订单状态标签类型
    getOrderStatusType(status) {
      const typeMap = {
        PENDING: "warning",
        PAID: "success",
        CANCELLED: "danger",
        COMPLETED: "info",
      };
      return typeMap[status] || "info";
    },
  },
};
</script>

<style scoped>
.order-management {
  /* padding: 20px; */
}

.search-form {
  /* margin-bottom: 20px; */
}
</style>
