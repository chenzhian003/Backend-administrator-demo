<template>
  <div class="dashboard">
    <!-- 数据概览 -->
    <el-row :gutter="20">
      <el-col :span="6" v-for="(card, index) in dataCards" :key="index">
        <el-card shadow="hover" class="data-card">
          <template #header>
            <div class="card-header">
              <span>{{ card.title }}</span>
              <el-tag :type="card.tagType">{{ card.period }}</el-tag>
            </div>
          </template>
          <div class="card-content">
            <div class="main-value">
              <span class="prefix" v-if="card.prefix">{{ card.prefix }}</span>
              {{ card.value }}
            </div>
            <div class="sub-value">
              <template v-for="(sub, idx) in card.subValues" :key="idx">
                <span>{{ sub.label }} {{ sub.value }}</span>
                <el-divider direction="vertical" v-if="idx < card.subValues.length - 1" />
              </template>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表展示 -->
    <el-row :gutter="20" class="chart-row">
      <el-col :span="16">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <span class="title">销售趋势</span>
                <el-radio-group v-model="saleTimeRange" size="small">
                  <el-radio-button label="week">本周</el-radio-button>
                  <el-radio-button label="month">本月</el-radio-button>
                  <el-radio-button label="year">全年</el-radio-button>
                </el-radio-group>
              </div>
              <div class="header-right">
                <el-button-group>
                  <el-button size="small" :type="chartType === 'line' ? 'primary' : ''" @click="chartType = 'line'">
                    折线图
                  </el-button>
                  <el-button size="small" :type="chartType === 'bar' ? 'primary' : ''" @click="chartType = 'bar'">
                    柱状图
                  </el-button>
                </el-button-group>
              </div>
            </div>
          </template>
          <v-chart class="chart" :option="saleChartOption" autoresize />
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover" class="chart-card">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <span class="title">商品分类占比</span>
              </div>
              <el-select v-model="categoryTimeRange" size="small" style="width: 120px">
                <el-option label="近7天" value="week" />
                <el-option label="近30天" value="month" />
                <el-option label="全年" value="year" />
              </el-select>
            </div>
          </template>
          <v-chart class="chart" :option="pieChartOption" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <!-- 最新动态 -->
    <el-row :gutter="20" class="table-row">
      <el-col :span="12">
        <el-card shadow="hover" class="list-card">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <span class="title">最新订单</span>
                <el-tag type="info" effect="plain" class="header-tag">
                  实时更新
                </el-tag>
              </div>
              <el-button text type="primary">查看更多</el-button>
            </div>
          </template>
          <el-table :data="latestOrders" style="width: 100%">
            <el-table-column prop="orderNo" label="订单号" width="180" />
            <el-table-column prop="customer" label="客户" />
            <el-table-column prop="amount" label="金额" width="120">
              <template #default="{ row }">
                <span class="amount">¥{{ row.amount.toFixed(2) }}</span>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="{ row }">
                <el-tag :type="row.status.type" size="small">
                  {{ row.status.text }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card shadow="hover" class="list-card">
          <template #header>
            <div class="card-header">
              <div class="header-left">
                <span class="title">系统通知</span>
                <el-tag type="info" effect="plain" class="header-tag">
                  最近更新
                </el-tag>
              </div>
              <el-button text type="primary">查看更多</el-button>
            </div>
          </template>
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :type="activity.type"
              :color="activity.color"
              :timestamp="activity.timestamp"
              :hollow="activity.hollow"
            >
              <div class="timeline-content">
                <span>{{ activity.content }}</span>
                <el-tag 
                  v-if="activity.tag"
                  :type="activity.tag.type"
                  size="small"
                  effect="plain"
                >
                  {{ activity.tag.text }}
                </el-tag>
              </div>
            </el-timeline-item>
          </el-timeline>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, BarChart, PieChart } from 'echarts/charts'
import {
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
} from 'echarts/components'
import VChart from 'vue-echarts'

// 注册 ECharts 组件
use([
  CanvasRenderer,
  LineChart,
  BarChart,
  PieChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  TitleComponent
])

// 数据概览卡片数据
const dataCards = [
  {
    title: '总销售额',
    value: '12,589',
    prefix: '¥',
    period: '日',
    tagType: 'success',
    subValues: [
      { label: '周同比', value: '12%' },
      { label: '日同比', value: '11%' }
    ]
  },
  {
    title: '访问量',
    value: '2,589',
    period: '周',
    tagType: 'warning',
    subValues: [
      { label: '总访问量', value: '15,233' }
    ]
  },
  {
    title: '订单量',
    value: '589',
    period: '月',
    tagType: 'danger',
    subValues: [
      { label: '转化率', value: '22.8%' }
    ]
  },
  {
    title: '新增用户',
    value: '89',
    period: '月',
    tagType: '',
    subValues: [
      { label: '总用户数', value: '1,233' }
    ]
  }
]

// 销售趋势图配置
const saleTimeRange = ref('month')
const chartType = ref('line')

const saleChartOption = computed(() => ({
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: '#eee',
    borderWidth: 1,
    textStyle: {
      color: '#333'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: chartType.value === 'bar',
    data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    axisLine: {
      lineStyle: {
        color: '#ddd'
      }
    }
  },
  yAxis: {
    type: 'value',
    axisLine: {
      show: false
    },
    splitLine: {
      lineStyle: {
        color: '#eee'
      }
    }
  },
  series: [
    {
      name: '销售额',
      type: chartType.value,
      data: [820, 932, 901, 934, 1290, 1330, 1320],
      smooth: true,
      itemStyle: {
        color: '#0062ff'
      },
      areaStyle: chartType.value === 'line' ? {
        color: {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: 'rgba(0,98,255,0.2)'
          }, {
            offset: 1,
            color: 'rgba(0,98,255,0.05)'
          }]
        }
      } : undefined
    }
  ]
}))

// 饼图配置
const categoryTimeRange = ref('month')

const pieChartOption = computed(() => ({
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderColor: '#eee',
    borderWidth: 1,
    textStyle: {
      color: '#333'
    }
  },
  legend: {
    orient: 'vertical',
    right: '5%',
    top: 'center',
    textStyle: {
      color: '#666'
    }
  },
  series: [
    {
      name: '商品分类',
      type: 'pie',
      radius: ['40%', '70%'],
      center: ['40%', '50%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false
      },
      emphasis: {
        label: {
          show: true,
          fontSize: 14,
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: 1048, name: '电子产品', itemStyle: { color: '#0062ff' } },
        { value: 735, name: '服装', itemStyle: { color: '#36cfc9' } },
        { value: 580, name: '食品', itemStyle: { color: '#ffd666' } },
        { value: 484, name: '家居', itemStyle: { color: '#ff7875' } },
        { value: 300, name: '其他', itemStyle: { color: '#95de64' } }
      ]
    }
  ]
}))

// 最新订单数据
const latestOrders = ref([
  {
    orderNo: 'DD20240301001',
    customer: '张三',
    amount: 299.00,
    status: { type: 'success', text: '已完成' }
  },
  {
    orderNo: 'DD20240301002',
    customer: '李四',
    amount: 599.00,
    status: { type: 'warning', text: '处理中' }
  },
  {
    orderNo: 'DD20240301003',
    customer: '王五',
    amount: 199.00,
    status: { type: 'info', text: '待付款' }
  }
])

// 系统活动数据
const activities = ref([
  {
    content: '新增商品 iPhone 14 Pro',
    timestamp: '10:00',
    type: 'primary',
    color: '#0062ff',
    tag: { type: 'success', text: '新增' }
  },
  {
    content: '更新系统设置',
    timestamp: '09:30',
    type: 'warning',
    color: '#faad14',
    tag: { type: 'warning', text: '更新' }
  },
  {
    content: '新用户注册: user123',
    timestamp: '09:00',
    type: 'info',
    color: '#00b96b',
    tag: { type: 'info', text: '用户' }
  }
])
</script>

<style scoped>
.dashboard {
  padding: 20px;
  background: #f5f7fa;
  min-height: 100%;
}

.data-card {
  height: 180px;
  border-radius: 15px;
  transition: all 0.3s ease;
}

.data-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 98, 255, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.header-tag {
  font-size: 12px;
  padding: 0 8px;
  height: 22px;
  line-height: 20px;
}

.title {
  font-size: 16px;
  font-weight: 500;
  color: #1f2937;
}

.card-content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  height: calc(100% - 40px);
}

.main-value {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 10px;
  color: #1f2937;
  display: flex;
  align-items: baseline;
}

.prefix {
  font-size: 16px;
  margin-right: 4px;
  color: #666;
}

.sub-value {
  color: #6b7280;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.chart-row {
  margin-top: 20px;
}

.chart-card {
  border-radius: 15px;
  transition: all 0.3s ease;
}

.chart-card:hover {
  box-shadow: 0 8px 20px rgba(0, 98, 255, 0.1);
}

.chart {
  height: 350px;
}

.table-row {
  margin-top: 20px;
}

.list-card {
  border-radius: 15px;
  transition: all 0.3s ease;
}

.list-card:hover {
  box-shadow: 0 8px 20px rgba(0, 98, 255, 0.1);
}

:deep(.el-card) {
  border: none;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(10px);
}

:deep(.el-card__header) {
  border-bottom: 1px solid rgba(0, 98, 255, 0.1);
  padding: 12px 20px;
}

:deep(.el-table) {
  background: transparent;
}

:deep(.el-table th) {
  background: #f8fafc;
}

:deep(.el-table--enable-row-hover .el-table__body tr:hover > td) {
  background: #f8fafc;
}

.amount {
  color: #0062ff;
  font-weight: 500;
}

.timeline-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

:deep(.el-timeline-item__node) {
  border-width: 2px;
}

:deep(.el-timeline-item__wrapper) {
  padding-right: 20px;
}

:deep(.el-timeline-item__content) {
  font-size: 14px;
  color: #1f2937;
}

:deep(.el-timeline-item__timestamp) {
  font-size: 12px;
  color: #6b7280;
}

@media (max-width: 768px) {
  .dashboard {
    padding: 10px;
  }

  .data-card {
    margin-bottom: 15px;
  }

  .chart-row, .table-row {
    margin-top: 15px;
  }

  .chart {
    height: 300px;
  }
}
</style> 