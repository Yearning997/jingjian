<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">设备管理</h1>
    </div>
    
    <!-- 设备状态统计 -->
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-icon" style="background-color: #67C23A;">
              <el-icon><CircleCheck /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ equipmentStats.online }}</div>
              <div class="stat-label">在线设备</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-icon" style="background-color: #E6A23C;">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ equipmentStats.using }}</div>
              <div class="stat-label">使用中</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-icon" style="background-color: #F56C6C;">
              <el-icon><CircleClose /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ equipmentStats.offline }}</div>
              <div class="stat-label">离线设备</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div class="stat-item">
            <div class="stat-icon" style="background-color: #909399;">
              <el-icon><Tools /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">{{ equipmentStats.maintenance }}</div>
              <div class="stat-label">维护中</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <el-select v-model="filterType" placeholder="设备类型" style="width: 150px; margin-right: 10px;">
              <el-option label="全部" value="" />
              <el-option label="游戏机" value="game" />
              <el-option label="娃娃机" value="doll" />
              <el-option label="按摩椅" value="massage" />
            </el-select>
            <el-select v-model="filterStatus" placeholder="设备状态" style="width: 150px;">
              <el-option label="全部" value="" />
              <el-option label="在线" value="online" />
              <el-option label="使用中" value="using" />
              <el-option label="离线" value="offline" />
              <el-option label="维护" value="maintenance" />
            </el-select>
          </div>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加设备
          </el-button>
        </div>
      </template>
      
      <el-table :data="equipment" style="width: 100%">
        <el-table-column prop="id" label="设备编号" width="120" />
        <el-table-column prop="name" label="设备名称" width="150" />
        <el-table-column prop="type" label="设备类型" width="120">
          <template #default="{ row }">
            <el-tag>{{ getTypeName(row.type) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="location" label="位置" width="120" />
        <el-table-column prop="status" label="状态" width="120">
          <template #default="{ row }">
            <el-tag :type="getStatusType(row.status)">{{ getStatusName(row.status) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="income" label="今日收入" width="120">
          <template #default="{ row }">
            <span style="color: #67C23A; font-weight: bold;">¥{{ row.income }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="lastUsed" label="最后使用" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="info" size="small" @click="handleControl(row)">控制</el-button>
            <el-button type="warning" size="small" @click="handleMaintain(row)">维护</el-button>
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const filterType = ref('')
const filterStatus = ref('')

const equipmentStats = ref({
  online: 380,
  using: 156,
  offline: 12,
  maintenance: 8
})

const equipment = ref([
  {
    id: 'A001',
    name: '赛车游戏机',
    type: 'game',
    location: 'A区',
    status: 'online',
    income: 580.50,
    lastUsed: '2024-01-20 15:30:25'
  },
  {
    id: 'B002',
    name: '娃娃机',
    type: 'doll',
    location: 'B区',
    status: 'using',
    income: 320.00,
    lastUsed: '2024-01-20 15:28:12'
  },
  {
    id: 'C003',
    name: '按摩椅',
    type: 'massage',
    location: 'C区',
    status: 'offline',
    income: 180.00,
    lastUsed: '2024-01-20 14:45:30'
  }
])

const getTypeName = (type) => {
  const names = {
    'game': '游戏机',
    'doll': '娃娃机',
    'massage': '按摩椅'
  }
  return names[type] || type
}

const getStatusType = (status) => {
  const types = {
    'online': 'success',
    'using': 'warning',
    'offline': 'danger',
    'maintenance': 'info'
  }
  return types[status] || 'info'
}

const getStatusName = (status) => {
  const names = {
    'online': '在线',
    'using': '使用中',
    'offline': '离线',
    'maintenance': '维护中'
  }
  return names[status] || status
}

const handleAdd = () => {
  // 添加设备逻辑
}

const handleControl = (row) => {
  // 控制设备逻辑
}

const handleMaintain = (row) => {
  // 维护设备逻辑
}

const handleEdit = (row) => {
  // 编辑设备逻辑
}
</script>

<style scoped>
.stat-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  margin-right: 16px;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 20px;
  font-weight: bold;
  color: #262626;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
}
</style>