<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">日常管理</h1>
    </div>
    
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>日常运营记录</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加记录
          </el-button>
        </div>
      </template>
      
      <el-table :data="dailyRecords" style="width: 100%">
        <el-table-column prop="date" label="日期" width="180" />
        <el-table-column prop="shift" label="班次" width="120">
          <template #default="{ row }">
            <el-tag :type="row.shift === '白班' ? 'primary' : 'warning'">{{ row.shift }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="operator" label="操作员" width="120" />
        <el-table-column prop="revenue" label="收入" width="120">
          <template #default="{ row }">
            <span style="color: #67C23A; font-weight: bold;">¥{{ row.revenue }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="customers" label="客流量" width="120" />
        <el-table-column prop="notes" label="备注" />
        <el-table-column label="操作" width="150">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
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

const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const dailyRecords = ref([
  {
    date: '2024-01-20',
    shift: '白班',
    operator: '张三',
    revenue: 5680,
    customers: 156,
    notes: '周末客流高峰'
  },
  {
    date: '2024-01-19',
    shift: '晚班',
    operator: '李四',
    revenue: 3450,
    customers: 89,
    notes: '设备维护2小时'
  },
  {
    date: '2024-01-18',
    shift: '白班',
    operator: '王五',
    revenue: 4890,
    customers: 132,
    notes: '正常营业'
  }
])

const handleAdd = () => {
  // 添加记录逻辑
}

const handleEdit = (row) => {
  // 编辑记录逻辑
}

const handleDelete = (row) => {
  // 删除记录逻辑
}
</script>