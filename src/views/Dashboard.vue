<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">首页概览</h1>
    </div>
    
    <!-- 统计卡片 -->
    <el-row :gutter="20" style="margin-bottom: 20px;">
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon" style="background-color: #409EFF;">
              <el-icon><User /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">1,234</div>
              <div class="stat-label">会员总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon" style="background-color: #67C23A;">
              <el-icon><Money /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">¥89,432</div>
              <div class="stat-label">今日收入</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon" style="background-color: #E6A23C;">
              <el-icon><Monitor /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">456</div>
              <div class="stat-label">设备总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="stat-card">
          <div class="stat-item">
            <div class="stat-icon" style="background-color: #F56C6C;">
              <el-icon><Box /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-number">78</div>
              <div class="stat-label">套餐售出</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 图表区域 -->
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card title="收入趋势">
          <template #header>
            <span>收入趋势</span>
          </template>
          <div class="chart-placeholder">
            <el-empty description="图表组件占位" />
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card title="设备状态">
          <template #header>
            <span>设备状态</span>
          </template>
          <div class="chart-placeholder">
            <el-empty description="图表组件占位" />
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 最新动态 -->
    <el-card style="margin-top: 20px;">
      <template #header>
        <span>最新动态</span>
      </template>
      <el-table :data="recentActivities" style="width: 100%">
        <el-table-column prop="time" label="时间" width="180" />
        <el-table-column prop="type" label="类型" width="120">
          <template #default="{ row }">
            <el-tag :type="getTagType(row.type)">{{ row.type }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="operator" label="操作人" width="120" />
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const recentActivities = ref([
  {
    time: '2024-01-20 14:30:25',
    type: '会员',
    description: '新会员注册：张三',
    operator: '系统'
  },
  {
    time: '2024-01-20 14:25:18',
    type: '设备',
    description: '设备A001状态更新为使用中',
    operator: '系统'
  },
  {
    time: '2024-01-20 14:20:12',
    type: '收入',
    description: '套餐B销售成功，收入¥50',
    operator: '收银员001'
  },
  {
    time: '2024-01-20 14:15:08',
    type: '异常',
    description: '设备C003检测到异常',
    operator: '系统'
  }
])

const getTagType = (type) => {
  const types = {
    '会员': 'success',
    '设备': 'info',
    '收入': 'warning',
    '异常': 'danger'
  }
  return types[type] || 'info'
}
</script>

<style scoped>
.stat-card {
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
}

.stat-icon {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  margin-right: 16px;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  color: #262626;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
}

.chart-placeholder {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>