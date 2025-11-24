<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">商品管理</h1>
    </div>
    
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <el-select v-model="filterCategory" placeholder="商品分类" style="width: 150px; margin-right: 10px;">
              <el-option label="全部" value="" />
              <el-option label="饮料" value="drink" />
              <el-option label="零食" value="snack" />
              <el-option label="玩具" value="toy" />
              <el-option label="纪念品" value="souvenir" />
            </el-select>
          </div>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加商品
          </el-button>
        </div>
      </template>
      
      <el-table :data="products" style="width: 100%">
        <el-table-column prop="code" label="商品编号" width="120" />
        <el-table-column prop="name" label="商品名称" width="150" />
        <el-table-column prop="category" label="分类" width="120">
          <template #default="{ row }">
            <el-tag>{{ getCategoryName(row.category) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="price" label="售价" width="120">
          <template #default="{ row }">
            <span style="color: #E6A23C; font-weight: bold;">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="cost" label="成本" width="120">
          <template #default="{ row }">
            <span style="color: #909399;">¥{{ row.cost }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="stock" label="库存" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === '在售' ? 'success' : 'danger'">{{ row.status }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="warning" size="small" @click="handleStock(row)">库存</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const filterCategory = ref('')

const products = ref([
  {
    code: 'P001',
    name: '可口可乐',
    category: 'drink',
    price: 5.00,
    cost: 2.50,
    stock: 120,
    status: '在售'
  },
  {
    code: 'P002',
    name: '薯片',
    category: 'snack',
    price: 8.00,
    cost: 4.00,
    stock: 85,
    status: '在售'
  },
  {
    code: 'P003',
    name: '游戏币',
    category: 'toy',
    price: 1.00,
    cost: 0.10,
    stock: 1000,
    status: '在售'
  }
])

const getCategoryName = (category) => {
  const names = {
    'drink': '饮料',
    'snack': '零食',
    'toy': '玩具',
    'souvenir': '纪念品'
  }
  return names[category] || category
}

const handleAdd = () => {
  // 添加商品逻辑
}

const handleEdit = (row) => {
  // 编辑商品逻辑
}

const handleStock = (row) => {
  // 库存管理逻辑
}

const handleDelete = (row) => {
  // 删除商品逻辑
}
</script>