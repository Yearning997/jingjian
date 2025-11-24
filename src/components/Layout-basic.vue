<template>
  <div style="display: flex; height: 100vh;">
    <!-- 侧边栏 -->
    <div style="width: 250px; background-color: #304156; color: white;">
      <div style="padding: 20px; border-bottom: 1px solid #2b2f3a;">
        <h3>🐋 鲸舰电玩城</h3>
      </div>
      <div style="padding: 10px 0;">
        <div 
          v-for="item in menuItems" 
          :key="item.path"
          @click="$router.push(item.path)"
          :style="{
            padding: '12px 20px',
            cursor: 'pointer',
            backgroundColor: $route.path === item.path ? '#409EFF' : 'transparent'
          }"
        >
          {{ item.name }}
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div style="flex: 1; display: flex; flex-direction: column;">
      <!-- 顶部导航 -->
      <div style="height: 60px; background-color: white; border-bottom: 1px solid #e4e7ed; display: flex; align-items: center; padding: 0 20px; justify-content: space-between;">
        <div>
          <span style="margin-right: 20px;">首页</span>
          <span style="color: #909399;">/ {{ $route.meta.title || '首页' }}</span>
        </div>
        <div style="display: flex; align-items: center;">
          <span style="margin-right: 10px;">管理员</span>
          <div style="width: 30px; height: 30px; background-color: #409EFF; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white;">管</div>
        </div>
      </div>

      <!-- 内容区域 -->
      <div style="flex: 1; background-color: #f5f5f5; overflow-y: auto;">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const menuItems = ref([
  { name: '首页', path: '/dashboard' },
  { name: '日常', path: '/daily' },
  { name: '套餐', path: '/packages' },
  { name: '会员', path: '/members' },
  { name: '商品', path: '/products' },
  { name: '营销', path: '/marketing' },
  { name: '设备', path: '/equipment' },
  { name: '氛围', path: '/atmosphere' },
  { name: '台球', path: '/billiards' },
  { name: '线上', path: '/online' },
  { name: '报表', path: '/reports' },
  { name: '设置', path: '/settings' }
])
</script>