<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">职位权限</h1>
    </div>
    
    <el-card>
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span>职位权限管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            添加职位
          </el-button>
        </div>
      </template>
      
      <el-table :data="positions" style="width: 100%">
        <el-table-column prop="name" label="职位名称" width="150" />
        <el-table-column prop="level" label="权限等级" width="120">
          <template #default="{ row }">
            <el-tag :type="getLevelType(row.level)">{{ row.level }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="count" label="员工数量" width="120" />
        <el-table-column prop="description" label="描述" />
        <el-table-column prop="createTime" label="创建时间" width="180" />
        <el-table-column label="操作" width="200">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handlePermission(row)">权限设置</el-button>
            <el-button type="info" size="small" @click="handleEdit(row)">编辑</el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 权限设置对话框 -->
    <el-dialog v-model="dialogVisible" title="权限设置" width="50%">
      <el-form :model="permissionForm" label-width="120px">
        <el-form-item label="职位名称">
          <el-input v-model="permissionForm.name" disabled />
        </el-form-item>
        <el-form-item label="菜单权限">
          <el-tree
            :data="menuPermissions"
            :props="defaultProps"
            show-checkbox
            node-key="id"
            :default-checked-keys="permissionForm.menus"
            @check="handleMenuCheck"
          />
        </el-form-item>
        <el-form-item label="功能权限">
          <el-checkbox-group v-model="permissionForm.functions">
            <el-checkbox label="view">查看</el-checkbox>
            <el-checkbox label="add">添加</el-checkbox>
            <el-checkbox label="edit">编辑</el-checkbox>
            <el-checkbox label="delete">删除</el-checkbox>
            <el-checkbox label="export">导出</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="savePermissions">保存</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const dialogVisible = ref(false)
const permissionForm = ref({
  name: '',
  menus: [],
  functions: []
})

const positions = ref([
  {
    name: '超级管理员',
    level: 'L1',
    count: 1,
    description: '拥有所有权限',
    createTime: '2023-01-01'
  },
  {
    name: '店长',
    level: 'L2',
    count: 2,
    description: '门店日常管理权限',
    createTime: '2023-01-15'
  },
  {
    name: '收银员',
    level: 'L3',
    count: 5,
    description: '收银和会员管理权限',
    createTime: '2023-02-01'
  },
  {
    name: '技术员',
    level: 'L3',
    count: 3,
    description: '设备管理和维护权限',
    createTime: '2023-02-15'
  }
])

const menuPermissions = ref([
  {
    id: 'dashboard',
    label: '首页',
    children: []
  },
  {
    id: 'daily',
    label: '日常管理',
    children: []
  },
  {
    id: 'packages',
    label: '套餐管理',
    children: []
  },
  {
    id: 'members',
    label: '会员管理',
    children: []
  },
  {
    id: 'settings',
    label: '设置',
    children: [
      {
        id: 'staff',
        label: '员工权限',
        children: [
          { id: 'staff-list', label: '员工管理' },
          { id: 'positions', label: '职位权限' }
        ]
      }
    ]
  }
])

const defaultProps = {
  children: 'children',
  label: 'label'
}

const getLevelType = (level) => {
  const types = {
    'L1': 'danger',
    'L2': 'warning',
    'L3': 'info',
    'L4': 'success'
  }
  return types[level] || 'info'
}

const handleAdd = () => {
  // 添加职位逻辑
}

const handlePermission = (row) => {
  permissionForm.value.name = row.name
  permissionForm.value.menus = ['dashboard', 'daily']
  permissionForm.value.functions = ['view', 'add', 'edit']
  dialogVisible.value = true
}

const handleEdit = (row) => {
  // 编辑职位逻辑
}

const handleDelete = (row) => {
  // 删除职位逻辑
}

const handleMenuCheck = (checkedNodes, checkedKeys) => {
  permissionForm.value.menus = checkedKeys
}

const savePermissions = () => {
  // 保存权限逻辑
  dialogVisible.value = false
}
</script>