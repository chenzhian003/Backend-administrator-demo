<template>
  <div class="delivery-list">
    <el-card>
      <template #header>
        <div class="card-header">
          <div class="header-left">
            <el-radio-group v-model="deliveryStatus" @change="handleStatusChange">
              <el-radio-button label="all">全部订单</el-radio-button>
              <el-radio-button label="pending">待发货</el-radio-button>
              <el-radio-button label="shipped">已发货</el-radio-button>
            </el-radio-group>
          </div>
          <div class="header-right">
            <el-input
              v-model="searchQuery"
              placeholder="搜索订单号/收货人"
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
        <el-table-column prop="receiver" label="收货人" width="120" />
        <el-table-column prop="phone" label="联系电话" width="140" />
        <el-table-column prop="address" label="收货地址" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'pending' ? 'warning' : 'success'">
              {{ row.status === 'pending' ? '待发货' : '已发货' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="下单时间" width="180" />
        <el-table-column label="操作" width="120" fixed="right">
          <template #default="{ row }">
            <el-button
              v-if="row.status === 'pending'"
              type="primary"
              link
              @click="handleShip(row)"
            >
              发货
            </el-button>
            <el-button
              v-else
              type="primary"
              link
              @click="handleViewShipping(row)"
            >
              物流信息
            </el-button>
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
            <el-option label="圆通快递" value="YTO" />
            <el-option label="中通快递" value="ZTO" />
            <el-option label="韵达快递" value="YD" />
            <el-option label="申通快递" value="STO" />
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
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 物流信息对话框 -->
    <el-dialog
      title="物流信息"
      v-model="trackingDialogVisible"
      width="600px"
    >
      <el-descriptions :column="1" border>
        <el-descriptions-item label="物流公司">
          {{ currentTracking.company }}
        </el-descriptions-item>
        <el-descriptions-item label="物流单号">
          {{ currentTracking.trackingNo }}
        </el-descriptions-item>
      </el-descriptions>
      
      <el-timeline class="tracking-timeline">
        <el-timeline-item
          v-for="(item, index) in currentTracking.traces"
          :key="index"
          :timestamp="item.time"
        >
          {{ item.content }}
        </el-timeline-item>
      </el-timeline>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

// 状态变量
const loading = ref(false)
const deliveryStatus = ref('all')
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const shipDialogVisible = ref(false)
const trackingDialogVisible = ref(false)
const submitting = ref(false)
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
    { min: 5, max: 32, message: '长度在 5 到 32 个字符', trigger: 'blur' }
  ]
}

// 模拟订单数据
const orderList = ref([
  {
    orderNo: 'DD20240301001',
    receiver: '张三',
    phone: '13800138000',
    address: '北京市朝阳区某某街道1号楼',
    status: 'pending',
    createTime: '2024-03-01 10:00:00'
  },
  {
    orderNo: 'DD20240301002',
    receiver: '李四',
    phone: '13900139000',
    address: '上海市浦东新区某某路2号',
    status: 'shipped',
    createTime: '2024-03-01 11:00:00',
    shipping: {
      company: '顺丰快递',
      trackingNo: 'SF1234567890'
    }
  }
])

// 当前查看的物流信息
const currentTracking = reactive({
  company: '',
  trackingNo: '',
  traces: [
    {
      time: '2024-03-01 14:00:00',
      content: '快件已签收，签收人：李四'
    },
    {
      time: '2024-03-01 13:30:00',
      content: '快件已到达【上海浦东新区某某营业点】'
    },
    {
      time: '2024-03-01 10:00:00',
      content: '快件已发出，正在运输中'
    }
  ]
})

// 方法
const handleStatusChange = () => {
  // TODO: 根据状态筛选订单
  console.log('状态变更:', deliveryStatus.value)
}

const handleSearch = () => {
  // TODO: 实现搜索逻辑
  console.log('搜索:', searchQuery.value)
}

const handleSizeChange = (val) => {
  pageSize.value = val
  // TODO: 重新加载数据
}

const handleCurrentChange = (val) => {
  currentPage.value = val
  // TODO: 重新加载数据
}

const handleShip = (row) => {
  shipForm.company = ''
  shipForm.trackingNo = ''
  shipDialogVisible.value = true
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

const handleViewShipping = (row) => {
  if (row.shipping) {
    currentTracking.company = row.shipping.company
    currentTracking.trackingNo = row.shipping.trackingNo
    trackingDialogVisible.value = true
  }
}
</script>

<style scoped>
.delivery-list {
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

.tracking-timeline {
  margin-top: 20px;
  padding: 20px;
}
</style> 