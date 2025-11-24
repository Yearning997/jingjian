<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">会员管理</h1>
    </div>
    
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <el-input
              v-model="searchKeyword"
              placeholder="搜索会员"
              style="width: 200px; margin-right: 10px;"
              clearable
            >
              <template #prefix>
                <el-icon><Search /></el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="handleSearch">
              <el-icon><Search /></el-icon>
              搜索
            </el-button>
          </div>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加会员
          </el-button>
        </div>
      </template>
      
      <el-table :data="members" style="width: 100%">
        <el-table-column prop="id" label="会员号" width="120" />
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="phone" label="手机号" width="120" />
        <el-table-column prop="level" label="会员等级" width="120">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="points" label="积分" width="100" />
        <el-table-column prop="balance" label="余额" width="120">
          <template #default="{ row }">
            <span style="color: #E6A23C; font-weight: bold;">¥{{ row.balance }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="joinDate" label="加入时间" width="180" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '正常' ? 'success' : 'danger'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleRecharge(row)">充值</el-button>
            <el-button type="info" size="small" @click="handleEdit(row)">编辑</el-button>
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

const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)

const members = ref([
  {
    id: 'M001',
    name: '张三',
    phone: '13800138001',
    level: '黄金会员',
    points: 2580,
    balance: 580.50,
    joinDate: '2023-06-15',
    status: '正常'
  },
  {
    id: 'M002',
    name: '李四',
    phone: '13800138002',
    level: '白金会员',
    points: 8560,
    balance: 1280.00,
    joinDate: '2023-03-20',
    status: '正常'
  },
  {
    id: 'M003',
    name: '王五',
    phone: '13800138003',
    level: '普通会员',
    points: 520,
    balance: 120.80,
    joinDate: '2024-01-10',
    status: '正常'
  }
])

const getLevelType = (level) => {
  const types = {
    '普通会员': 'info',
    '黄金会员': 'warning',
    '白金会员': 'success',
    '钻石会员': 'danger'
  }
  return types[level] || 'info'
}

const handleSearch = () => {
  // 搜索逻辑
}

const handleAdd = () => {
  // 添加会员逻辑
}

const handleRecharge = (row) => {
  // 充值逻辑
}

const handleEdit = (row) => {
  // 编辑会员逻辑
}

const handleDelete = (row) => {
  // 删除会员逻辑
}
</script>