<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <div class="sidebar">
      <div class="logo">
        <span>🐋 鲸舰电玩城</span>
      </div>
      
      <!-- 一级菜单 -->
      <div class="menu-container">
        <div 
          v-for="menu in menuData" 
          :key="menu.path"
          class="menu-item"
          :class="{ active: $route.path === menu.path }"
          @click="selectMenu(menu)"
          @mouseenter="showSubmenu(menu)"
          @mouseleave="hideSubmenu"
        >
          <span class="menu-icon">{{ menu.icon }}</span>
          <span class="menu-title">{{ menu.name }}</span>
        </div>
      </div>
    </div>

    <!-- 二级菜单 (显示在一级菜单右边) -->
    <div 
      v-if="currentMenu && currentMenu.children && currentMenu.children.length > 0"
      class="submenu-container"
      :style="{ left: '250px', top: currentMenuTop + 'px' }"
      @mouseenter="keepSubmenu"
      @mouseleave="hideSubmenu"
    >
      <div 
        v-for="submenu in currentMenu.children" 
        :key="submenu.path"
        class="submenu-item"
        :class="{ active: isSubmenuActive(submenu) }"
        @click="selectSubmenu(submenu)"
        @mouseenter="showThirdMenu(submenu)"
      >
        <span>{{ submenu.name }}</span>
        <span v-if="submenu.children && submenu.children.length > 0" class="arrow">▶</span>
      </div>
    </div>

    <!-- 三级菜单 (显示在二级菜单右边) -->
    <div 
      v-if="currentSubmenu && currentSubmenu.children && currentSubmenu.children.length > 0"
      class="thirdmenu-container"
      :style="{ left: '450px', top: thirdMenuTop + 'px' }"
      @mouseenter="keepThirdMenu"
      @mouseleave="hideAllMenus"
    >
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

    <!-- 主容器 -->
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
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const currentMenu = ref(null)
const currentSubmenu = ref(null)
const currentMenuTop = ref(0)
const thirdMenuTop = ref(0)
let hideTimeout = null
let hideThirdTimeout = null

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
  if (!menu.children || menu.children.length === 0) {
    router.push(menu.path)
    hideAllMenus()
  }
}

const selectSubmenu = (submenu) => {
  if (!submenu.children || submenu.children.length === 0) {
    router.push(submenu.path)
    hideAllMenus()
  }
}

const selectThirdMenu = (third) => {
  router.push(third.path)
  hideAllMenus()
}

const showSubmenu = (menu) => {
  currentMenu.value = menu
  currentMenuTop.value = 80 + menuData.value.indexOf(menu) * 50
  currentSubmenu.value = null
  clearTimeout(hideTimeout)
}

const showThirdMenu = (submenu) => {
  currentSubmenu.value = submenu
  const submenuIndex = currentMenu.value.children.indexOf(submenu)
  thirdMenuTop.value = currentMenuTop.value + submenuIndex * 40
  clearTimeout(hideThirdTimeout)
}

const hideSubmenu = () => {
  hideTimeout = setTimeout(() => {
    if (!currentSubmenu.value) {
      currentMenu.value = null
    }
  }, 200)
}

const hideThirdMenu = () => {
  hideThirdTimeout = setTimeout(() => {
    currentSubmenu.value = null
    currentMenu.value = null
  }, 200)
}

const keepSubmenu = () => {
  clearTimeout(hideTimeout)
}

const keepThirdMenu = () => {
  clearTimeout(hideThirdTimeout)
  clearTimeout(hideTimeout)
}

const hideAllMenus = () => {
  currentMenu.value = null
  currentSubmenu.value = null
  clearTimeout(hideTimeout)
  clearTimeout(hideThirdTimeout)
}

const isSubmenuActive = (submenu) => {
  return route.path.startsWith(submenu.path) && submenu.children && submenu.children.length > 0
}

onMounted(() => {
  // 初始化时根据当前路由设置菜单状态
  menuData.value.forEach(menu => {
    if (menu.children) {
      menu.children.forEach(submenu => {
        if (submenu.children) {
          submenu.children.forEach(third => {
            if (route.path === third.path) {
              currentMenu.value = menu
              currentSubmenu.value = submenu
            }
          })
        }
      })
    }
  })
})
</script>

<style scoped>
.layout-container {
  height: 100vh;
  display: flex;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.sidebar {
  width: 250px;
  background-color: #304156;
  box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
  display: flex;
  flex-direction: column;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  background-color: #2b2f3a;
  color: #fff;
  font-size: 18px;
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
  margin-right: 12px;
  font-size: 16px;
}

.menu-title {
  font-size: 14px;
}

/* 二级菜单 */
.submenu-container {
  position: fixed;
  width: 200px;
  background-color: #fff;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  z-index: 1000;
  overflow: hidden;
}

.submenu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 15px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.submenu-item:hover {
  background-color: #f5f7fa;
  color: #409EFF;
}

.submenu-item.active {
  background-color: #ecf5ff;
  color: #409EFF;
}

.arrow {
  font-size: 10px;
  color: #c0c4cc;
}

/* 三级菜单 */
.thirdmenu-container {
  position: fixed;
  width: 150px;
  background-color: #fff;
  box-shadow: 2px 2px 8px rgba(0, 0, 0, 0.15);
  border-radius: 4px;
  z-index: 1001;
  overflow: hidden;
}

.thirdmenu-item {
  padding: 10px 15px;
  color: #606266;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 14px;
}

.thirdmenu-item:hover {
  background-color: #f5f7fa;
  color: #409EFF;
}

.thirdmenu-item.active {
  background-color: #ecf5ff;
  color: #409EFF;
}

/* 主容器 */
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.header {
  height: 60px;
  background-color: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
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