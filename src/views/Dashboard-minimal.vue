<template>
  <div style="padding: 20px;">
    <h1>欢迎使用鲸舰电玩城管理系统</h1>
    <el-row :gutter="20" style="margin-top: 20px;">
      <el-col :span="6">
        <el-card>
          <div style="text-align: center;">
            <div style="font-size: 24px; color: #409EFF; margin-bottom: 10px;">👥</div>
            <div style="font-size: 20px; font-weight: bold;">1,234</div>
            <div style="color: #999;">会员总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div style="text-align: center;">
            <div style="font-size: 24px; color: #67C23A; margin-bottom: 10px;">💰</div>
            <div style="font-size: 20px; font-weight: bold;">¥89,432</div>
            <div style="color: #999;">今日收入</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div style="text-align: center;">
            <div style="font-size: 24px; color: #E6A23C; margin-bottom: 10px;">🎮</div>
            <div style="font-size: 20px; font-weight: bold;">456</div>
            <div style="color: #999;">设备总数</div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div style="text-align: center;">
            <div style="font-size: 24px; color: #F56C6C; margin-bottom: 10px;">📦</div>
            <div style="font-size: 20px; font-weight: bold;">78</div>
            <div style="color: #999;">套餐售出</div>
          </div>
        </el-card>
      </el-col>
    </el-row>
    
    <el-card style="margin-top: 20px;">
      <template #header>
        <span>最新动态</span>
      </template>
      <el-table :data="activities">
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

const activities = ref([
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