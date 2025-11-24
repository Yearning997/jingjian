<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">异常记录</h1>
    </div>
    
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <el-select v-model="filterLevel" placeholder="异常级别" style="width: 150px; margin-right: 10px;">
              <el-option label="全部" value="" />
              <el-option label="低风险" value="L1" />
              <el-option label="中风险" value="L2" />
              <el-option label="高风险" value="L3" />
            </el-select>
            <el-date-picker
              v-model="dateRange"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="margin-right: 10px;"
            />
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
          </div>
          <el-button type="warning" @click="handleExport">
            <el-icon><Download /></el-icon>
            导出记录
          </el-button>
        </div>
      </template>
      
      <el-table :data="exceptions" style="width: 100%">
        <el-table-column prop="id" label="记录ID" width="120" />
        <el-table-column prop="time" label="发生时间" width="180" />
        <el-table-column prop="type" label="异常类型" width="120" />
        <el-table-column prop="level" label="风险级别" width="100">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">{{ getLevelName(row.level) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="异常描述" />
        <el-table-column prop="source" label="来源" width="120" />
        <el-table-column prop="status" label="处理状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleDetail(row)">详情</el-button>
            <el-button v-if="row.status === '待处理'" type="success" size="small" @click="handleProcess(row)">处理</el-button>
          </template>
        </el-table-column>
      </el-table>
      
      <el-pagination
        v-model:current-page="currentPage"
        :page-size="pageSize"
        :total="total"
        layout="total, prev, pager, next"
        style="margin-top: 20px; text-align: right;"
      />
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const filterLevel = ref('')
const dateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const exceptions = ref([
  {
    id: 'EX001',
    time: '2024-01-20 14:30:25',
    type: '设备异常',
    level: 'L2',
    description: '设备A003检测到异常振动，可能存在故障',
    source: '设备监控',
    status: '待处理'
  },
  {
    id: 'EX002',
    time: '2024-01-20 13:15:18',
    type: '支付异常',
    level: 'L1',
    description: '用户支付过程中网络中断，已自动退款',
    source: '支付系统',
    status: '已处理'
  },
  {
    id: 'EX003',
    time: '2024-01-20 12:45:12',
    type: '登录异常',
    level: 'L3',
    description: '检测到异常登录尝试，IP地址异常',
    source: '安全系统',
    status: '待处理'
  }
])

const getLevelType = (level) => {
  const types = {
    'L1': 'success',
    'L2': 'warning',
    'L3': 'danger'
  }
  return types[level] || 'info'
}

const getLevelName = (level) => {
  const names = {
    'L1': '低风险',
    'L2': '中风险',
    'L3': '高风险'
  }
  return names[level] || level
}

const getStatusType = (status) => {
  const types = {
    '待处理': 'warning',
    '已处理': 'success',
    '已忽略': 'info'
  }
  return types[status] || 'info'
}

const handleSearch = () => {
  // 搜索异常记录
}

const handleExport = () => {
  // 导出记录
}

const handleDetail = (row) => {
  // 查看详情
}

const handleProcess = (row) => {
  // 处理异常
  row.status = '已处理'
}
</script>