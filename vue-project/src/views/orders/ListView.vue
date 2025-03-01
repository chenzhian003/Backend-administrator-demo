<template>
  <div class="order-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-button-group>
              <el-button :type="orderStatus === '' ? 'primary' : ''" @click="handleFilterStatus('')">
                全部订单
              </el-button>
              <el-button :type="orderStatus === 'pending' ? 'primary' : ''" @click="handleFilterStatus('pending')">
                待付款
              </el-button>
              <el-button :type="orderStatus === 'paid' ? 'primary' : ''" @click="handleFilterStatus('paid')">
                待发货
              </el-button>
              <el-button :type="orderStatus === 'shipped' ? 'primary' : ''" @click="handleFilterStatus('shipped')">
                已发货
              </el-button>
              <el-button :type="orderStatus === 'completed' ? 'primary' : ''" @click="handleFilterStatus('completed')">
                已完成
              </el-button>
            </el-button-group>
          </div>
          <div class="header-right">
            <el-input
              v-model="searchQuery"
              placeholder="搜索订单号/用户名"
              class="search-input"
              clearable
              @clear="handleSearch"
              @keyup.enter="handleSearch"
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
          </div>
        </div>
      </template>

      <el-table :data="orderList" border style="width: 100%" v-loading="loading">
        <el-table-column prop="orderNo" label="订单号" width="180" />
        <el-table-column prop="username" label="用户名" width="120" />
        <el-table-column label="商品信息" min-width="300">
          <template #default="{ row }">
            <div v-for="item in row.items" :key="item.id" class="order-item">
              <el-image
                :src="item.image"
                style="width: 50px; height: 50px"
                :preview-src-list="[item.image]"
                fit="cover"
              />
              <div class="item-info">
                <div class="item-name">{{ item.name }}</div>
                <div class="item-meta">
                  ¥{{ item.price.toFixed(2) }} × {{ item.quantity }}
                </div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="totalAmount" label="总金额" width="120">
          <template #default="{ row }">
            ¥{{ row.totalAmount.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">
              {{ getStatusText(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button-group>
              <el-button type="primary" link @click="handleDetail(row)">
                详情
              </el-button>
              <el-button 
                v-if="row.status === 'paid'"
                type="success" 
                link 
                @click="handleShip(row)"
              >
                发货
              </el-button>
              <el-button 
                v-if="row.status === 'pending'"
                type="danger" 
                link 
                @click="handleCancel(row)"
              >
                取消
              </el-button>
            </el-button-group>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </el-card>

    <!-- 订单详情对话框 -->
    <el-dialog
      title="订单详情"
      v-model="detailDialogVisible"
      width="800px"
    >
      <el-descriptions :column="2" border>
        <el-descriptions-item label="订单号">{{ currentOrder?.orderNo }}</el-descriptions-item>
        <el-descriptions-item label="下单时间">{{ currentOrder?.createTime }}</el-descriptions-item>
        <el-descriptions-item label="用户名">{{ currentOrder?.username }}</el-descriptions-item>
        <el-descriptions-item label="订单状态">
          <el-tag :type="getStatusType(currentOrder?.status)">
            {{ getStatusText(currentOrder?.status) }}
          </el-tag>
        </el-descriptions-item>
      </el-descriptions>

      <el-divider>商品信息</el-divider>

      <el-table :data="currentOrder?.items" border>
        <el-table-column type="index" label="序号" width="50" />
        <el-table-column label="商品图片" width="80">
          <template #default="{ row }">
            <el-image
              :src="row.image"
              style="width: 50px; height: 50px"
              :preview-src-list="[row.image]"
              fit="cover"
            />
          </template>
        </el-table-column>
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="price" label="单价" width="120">
          <template #default="{ row }">
            ¥{{ row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="数量" width="80" />
        <el-table-column label="小计" width="120">
          <template #default="{ row }">
            ¥{{ (row.price * row.quantity).toFixed(2) }}
          </template>
        </el-table-column>
      </el-table>

      <el-divider>收货信息</el-divider>

      <el-descriptions :column="1" border>
        <el-descriptions-item label="收货人">{{ currentOrder?.address?.name }}</el-descriptions-item>
        <el-descriptions-item label="联系电话">{{ currentOrder?.address?.phone }}</el-descriptions-item>
        <el-descriptions-item label="收货地址">{{ currentOrder?.address?.fullAddress }}</el-descriptions-item>
      </el-descriptions>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 发货对话框 -->
    <el-dialog
      title="订单发货"
      v-model="shipDialogVisible"
      width="500px"
    >
      <el-form
        ref="shipFormRef"
        :model="shipForm"
        :rules="shipRules"
        label-width="100px"
      >
        <el-form-item label="物流公司" prop="company">
          <el-select v-model="shipForm.company" placeholder="请选择物流公司" style="width: 100%">
            <el-option label="顺丰快递" value="SF" />
            <el-option label="中通快递" value="ZTO" />
            <el-option label="圆通快递" value="YTO" />
            <el-option label="韵达快递" value="YD" />
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="trackingNo">
          <el-input v-model="shipForm.trackingNo" placeholder="请输入物流单号" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="shipDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleShipSubmit" :loading="submitting">
            确定发货
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 状态变量
const loading = ref(false)
const searchQuery = ref('')
const orderStatus = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const detailDialogVisible = ref(false)
const shipDialogVisible = ref(false)
const submitting = ref(false)
const currentOrder = ref(null)
const shipFormRef = ref(null)

// 发货表单数据
const shipForm = reactive({
  company: '',
  trackingNo: ''
})

// 发货表单验证规则
const shipRules = {
  company: [
    { required: true, message: '请选择物流公司', trigger: 'change' }
  ],
  trackingNo: [
    { required: true, message: '请输入物流单号', trigger: 'blur' },
    { pattern: /^[A-Za-z0-9]+$/, message: '物流单号只能包含字母和数字', trigger: 'blur' }
  ]
}

// 模拟订单数据
const orderList = ref([
  {
    orderNo: 'DD20240228001',
    username: '张三',
    items: [
      {
        id: 1,
        name: 'iPhone 14 Pro',
        price: 8999,
        quantity: 1,
        image: 'https://via.placeholder.com/50'
      }
    ],
    totalAmount: 8999,
    status: 'paid',
    createTime: '2024-02-28 10:00:00',
    address: {
      name: '张三',
      phone: '13800138000',
      fullAddress: '广东省深圳市南山区科技园'
    }
  },
  // 更多订单数据...
])

// 方法
const handleFilterStatus = (status) => {
  orderStatus.value = status
  // TODO: 重新加载数据
}

const handleSearch = () => {
  // TODO: 实现搜索逻辑
  console.log('搜索:', searchQuery.value)
}

const handleDetail = (row) => {
  currentOrder.value = row
  detailDialogVisible.value = true
}

const handleShip = (row) => {
  currentOrder.value = row
  shipDialogVisible.value = true
  shipFormRef.value?.resetFields()
}

const handleCancel = (row) => {
  ElMessageBox.confirm(
    '确定要取消该订单吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // TODO: 实现取消订单逻辑
    ElMessage.success('订单已取消')
  })
}

const handleShipSubmit = async () => {
  if (!shipFormRef.value) return
  
  try {
    await shipFormRef.value.validate()
    submitting.value = true
    
    // TODO: 实现发货逻辑
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    ElMessage.success('发货成功')
    shipDialogVisible.value = false
  } catch (error) {
    console.error(error)
  } finally {
    submitting.value = false
  }
}

const handleSizeChange = (val) => {
  pageSize.value = val
  // TODO: 重新加载数据
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  // TODO: 重新加载数据
}

const getStatusType = (status) => {
  const map = {
    pending: 'warning',
    paid: 'primary',
    shipped: 'success',
    completed: 'info',
    cancelled: 'danger'
  }
  return map[status] || 'info'
}

const getStatusText = (status) => {
  const map = {
    pending: '待付款',
    paid: '待发货',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  }
  return map[status] || '未知'
}
</script>

<style scoped>
.order-list {
  padding: 20px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-input {
  width: 300px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}

.order-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.order-item:last-child {
  border-bottom: none;
}

.item-info {
  margin-left: 10px;
}

.item-name {
  font-size: 14px;
  margin-bottom: 5px;
}

.item-meta {
  font-size: 12px;
  color: #999;
}
</style> 