<template>
  <div class="layout-container">
    <!-- 左侧：一级菜单 -->
    <div class="sidebar">
      <div class="logo">
        <span>🐋 鲸舰电玩城</span>
      </div>
      
      <div class="menu-container">
        <div 
          v-for="menu in menuData" 
          :key="menu.path"
          class="menu-item"
          :class="{ active: isMenuActive(menu) }"
          @click="selectMenu(menu)"
        >
          <span class="menu-icon">{{ menu.icon }}</span>
          <span class="menu-title">{{ menu.name }}</span>
        </div>
      </div>
    </div>

    <!-- 中间：二级菜单 -->
    <div 
      v-if="currentMenu && currentMenu.children && currentMenu.children.length > 0"
      class="submenu-sidebar"
    >
      <div class="submenu-header">
        {{ currentMenu.name }}
      </div>
      <div class="submenu-container">
        <div 
          v-for="submenu in currentMenu.children" 
          :key="submenu.path"
          class="submenu-item"
          :class="{ active: isSubmenuActive(submenu) }"
          @click="selectSubmenu(submenu)"
        >
          <span class="submenu-title">{{ submenu.name }}</span>
          <span v-if="submenu.children && submenu.children.length > 0" class="arrow">▶</span>
        </div>
      </div>
    </div>

    <!-- 右侧：三级菜单 -->
    <div 
      v-if="currentSubmenu && currentSubmenu.children && currentSubmenu.children.length > 0"
      class="thirdmenu-sidebar"
    >
      <div class="thirdmenu-header">
        {{ currentSubmenu.name }}
      </div>
      <div class="thirdmenu-container">
        <div 
          v-for="third in currentSubmenu.children" 
          :key="third.path"
          class="thirdmenu-item"
          :class="{ active: $route.path === third.path }"
          @click="selectThirdMenu(third)"
        >
          <span>{{ third.name }}</span>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="main-container">
      <!-- 顶部导航 -->
      <div class="header">
        <div class="left">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentMenu">{{ currentMenu.name }}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentSubmenu">{{ currentSubmenu.name }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="right">
          <el-dropdown>
            <span class="user-info">
              <el-avatar :size="30">管</el-avatar>
              <span style="margin-left: 8px;">管理员</span>
              <el-icon style="margin-left: 4px;"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>修改密码</el-dropdown-item>
                <el-dropdown-item divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>

      <!-- 内容区域 -->
      <div class="content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const currentMenu = ref(null)
const currentSubmenu = ref(null)

// 菜单数据
const menuData = ref([
  {
    name: '日常',
    path: '/daily',
    icon: '📅',
    children: []
  },
  {
    name: '套餐',
    path: '/packages',
    icon: '📦',
    children: []
  },
  {
    name: '会员',
    path: '/members',
    icon: '👥',
    children: []
  },
  {
    name: '商品',
    path: '/products',
    icon: '🛍️',
    children: []
  },
  {
    name: '营销',
    path: '/marketing',
    icon: '📊',
    children: []
  },
  {
    name: '设备',
    path: '/equipment',
    icon: '🎮',
    children: []
  },
  {
    name: '氛围',
    path: '/atmosphere',
    icon: '🎨',
    children: []
  },
  {
    name: '台球',
    path: '/billiards',
    icon: '🎱',
    children: []
  },
  {
    name: '线上',
    path: '/online',
    icon: '🌐',
    children: []
  },
  {
    name: '报表',
    path: '/reports',
    icon: '📈',
    children: []
  },
  {
    name: '设置',
    path: '/settings',
    icon: '⚙️',
    children: [
      {
        name: '员工权限',
        path: '/staff-permissions',
        children: [
          { name: '员工管理', path: '/staff' },
          { name: '职位权限', path: '/positions' }
        ]
      },
      {
        name: '运营监控',
        path: '/operations',
        children: [
          { name: '风控设置', path: '/risk-control' },
          { name: '异常记录', path: '/exceptions' },
          { name: '导出中心', path: '/export-center' },
          { name: '系统日志', path: '/system-logs' },
          { name: '回收站', path: '/recycle' }
        ]
      },
      {
        name: '基础设置',
        path: '/basic-settings',
        children: [
          { name: '财务设置', path: '/finance-settings' },
          { name: '消息管理', path: '/message-management' },
          { name: '支付商户', path: '/payment-merchants' }
        ]
      },
      {
        name: '更多设置',
        path: '/more-settings',
        children: []
      },
      {
        name: '数据管理',
        path: '/data-management',
        children: []
      },
      {
        name: '开放平台',
        path: '/open-platform',
        children: []
      }
    ]
  }
])

const currentTitle = computed(() => {
  return route.meta.title || '首页'
})

const selectMenu = (menu) => {
  currentMenu.value = menu
  currentSubmenu.value = null
  
  if (!menu.children || menu.children.length === 0) {
    router.push(menu.path)
  } else {
    // 如果没有子菜单被选中，自动选择第一个
    if (menu.children.length > 0) {
      selectSubmenu(menu.children[0])
    }
  }
}

const selectSubmenu = (submenu) => {
  currentSubmenu.value = submenu
  
  if (!submenu.children || submenu.children.length === 0) {
    router.push(submenu.path)
  } else {
    // 如果有三级菜单，自动选择第一个
    if (submenu.children.length > 0) {
      selectThirdMenu(submenu.children[0])
    }
  }
}

const selectThirdMenu = (third) => {
  router.push(third.path)
}

const isMenuActive = (menu) => {
  if (!menu.children || menu.children.length === 0) {
    return route.path === menu.path
  }
  return currentMenu.value?.path === menu.path
}

const isSubmenuActive = (submenu) => {
  if (!submenu.children || submenu.children.length === 0) {
    return route.path === submenu.path
  }
  return currentSubmenu.value?.path === submenu.path
}

// 监听路由变化，自动更新菜单状态
watch(() => route.path, (newPath) => {
  menuData.value.forEach(menu => {
    if (menu.children) {
      menu.children.forEach(submenu => {
        if (submenu.children) {
          submenu.children.forEach(third => {
            if (newPath === third.path) {
              currentMenu.value = menu
              currentSubmenu.value = submenu
            }
          })
        } else if (newPath === submenu.path) {
          currentMenu.value = menu
          currentSubmenu.value = submenu
        }
      })
    } else if (newPath === menu.path) {
      currentMenu.value = menu
      currentSubmenu.value = null
    }
  })
}, { immediate: true })

// 初始化默认选中设置菜单
selectMenu(menuData.value[10]) // 设置菜单是第11个
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 一级菜单 */
.sidebar {
  width: 200px;
  background-color: #304156;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: #2b2f3a;
  color: #fff;
  font-size: 16px;
  font-weight: bold;
}

.menu-container {
  flex: 1;
  padding-top: 20px;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: #bfcbd9;
  cursor: pointer;
  transition: all 0.3s;
  position: relative;
}

.menu-item:hover {
  background-color: #409EFF;
  color: #fff;
}

.menu-item.active {
  background-color: #409EFF;
  color: #fff;
}

.menu-icon {
  margin-right: 10px;
  font-size: 14px;
}

.menu-title {
  font-size: 13px;
}

/* 二级菜单 */
.submenu-sidebar {
  width: 180px;
  background-color: #f8f9fa;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.submenu-header {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  background-color: #ecf5ff;
  border-bottom: 1px solid #b3d8ff;
  color: #409EFF;
  font-size: 14px;
  font-weight: 600;
}

.submenu-container {
  flex: 1;
  padding-top: 10px;
}

.submenu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
}

.submenu-item:hover {
  background-color: #e6f7ff;
  color: #409EFF;
}

.submenu-item.active {
  background-color: #e6f7ff;
  color: #409EFF;
}

.arrow {
  font-size: 10px;
  color: #909399;
}

/* 三级菜单 */
.thirdmenu-sidebar {
  width: 160px;
  background-color: #fafafa;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.thirdmenu-header {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 15px;
  background-color: #f0f9ff;
  border-bottom: 1px solid #b3e5fc;
  color: #00bcd4;
  font-size: 14px;
  font-weight: 600;
}

.thirdmenu-container {
  flex: 1;
  padding-top: 10px;
}

.thirdmenu-item {
  padding: 10px 15px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
}

.thirdmenu-item:hover {
  background-color: #e0f7fa;
  color: #00bcd4;
}

.thirdmenu-item.active {
  background-color: #e0f7fa;
  color: #00bcd4;
}

/* 主容器 */
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.header {
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
  flex-shrink: 0;
}

.content {
  flex: 1;
  padding: 20px;
  background-color: #f5f5f5;
  overflow-y: auto;
}

.left {
  display: flex;
  align-items: center;
}

.right {
  display: flex;
  align-items: center;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.user-info:hover {
  background-color: #f5f5f5;
}
</style>