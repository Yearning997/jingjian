<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">套餐管理</h1>
    </div>
    
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>套餐列表</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加套餐
          </el-button>
        </div>
      </template>
      
      <el-table :data="packages" style="width: 100%">
        <el-table-column prop="name" label="套餐名称" width="150" />
        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">
            <span style="color: #E6A23C; font-weight: bold;">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="originalPrice" label="原价" width="120">
          <template #default="{ row }">
            <span style="text-decoration: line-through; color: #999;">¥{{ row.originalPrice }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="duration" label="时长" width="120" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '上架' ? 'success' : 'danger'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button :type="row.status === '上架' ? 'warning' : 'success'" size="small" @click="toggleStatus(row)">
              {{ row.status === '上架' ? '下架' : '上架' }}
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const packages = ref([
  {
    name: '小时畅玩套餐',
    price: 30,
    originalPrice: 50,
    duration: '1小时',
    description: '全场游戏机畅玩1小时',
    status: '上架'
  },
  {
    name: '半日欢乐套餐',
    price: 88,
    originalPrice: 150,
    duration: '4小时',
    description: '全场游戏机畅玩4小时，赠送饮料',
    status: '上架'
  },
  {
    name: '全天通玩套餐',
    price: 158,
    originalPrice: 280,
    duration: '全天',
    description: '全场游戏机畅玩一整天，赠送午餐和饮料',
    status: '下架'
  }
])

const handleAdd = () => {
  // 添加套餐逻辑
}

const handleEdit = (row) => {
  // 编辑套餐逻辑
}

const toggleStatus = (row) => {
  row.status = row.status === '上架' ? '下架' : '上架'
}

const handleDelete = (row) => {
  // 删除套餐逻辑
}
</script>