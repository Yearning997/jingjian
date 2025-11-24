<template>
  <div class="layout-container">
    <!-- 顶部导航栏 - 与一级菜单一体化 -->
    <div class="top-header">
      <div class="left">
        <div class="global-logo">
          <span>🐋</span>
          <span class="logo-title">鲸舰电玩城</span>
        </div>
        <div class="store-name">翠花科技3157号店</div>
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

    <div class="main-layout">
      <!-- 左侧：一级菜单 -->
      <div class="sidebar">
        <div class="menu-container">
          <div 
            v-for="menu in menuData" 
            :key="menu.path"
            class="menu-item"
            :class="{ active: isMenuActive(menu) }"
            @click="selectMenu(menu)"
          >
            <div class="menu-icon">{{ menu.icon }}</div>
            <div class="menu-title">{{ menu.name }}</div>
          </div>
        </div>
      </div>

      <!-- 右侧：二级菜单和三级菜单 -->
      <div 
        v-if="currentMenu && currentMenu.children && currentMenu.children.length > 0"
        class="submenu-area"
      >
        <div class="submenu-content">
          <div 
            v-for="submenu in currentMenu.children" 
            :key="submenu.path"
            class="submenu-item"
            :class="{ active: isSubmenuActive(submenu) }"
            @click="selectSubmenu(submenu)"
          >
            <div class="submenu-title">
              <span>{{ submenu.name }}</span>
              <span v-if="submenu.children && submenu.children.length > 0" class="arrow">▼</span>
            </div>
            
            <!-- 三级菜单在二级菜单下面展示 -->
            <div 
              v-if="submenu.children && submenu.children.length > 0 && currentSubmenu === submenu"
              class="thirdmenu-list"
            >
              <div 
                v-for="third in submenu.children" 
                :key="third.path"
                class="thirdmenu-item"
                :class="{ active: $route.path === third.path }"
                @click.stop="selectThirdMenu(third)"
              >
                {{ third.name }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 主内容区 -->
      <div class="main-container">
        <!-- 面包屑导航 -->
        <div class="breadcrumb-container">
          <el-breadcrumb separator="/" class="breadcrumb">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentMenu">{{ currentMenu.name }}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="currentSubmenu">{{ currentSubmenu.name }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>

        <!-- 内容区域 -->
        <div class="content">
          <router-view />
        </div>
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
    icon: '🖥️',
    children: []
  },
  {
    name: '套餐',
    path: '/packages',
    icon: '🛍️',
    children: []
  },
  {
    name: '会员',
    path: '/members',
    icon: '◇',
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
    icon: '🖥️',
    children: []
  },
  {
    name: '设备',
    path: '/equipment',
    icon: '🏧',
    children: []
  },
  {
    name: '氛围',
    path: '/atmosphere',
    icon: '💡',
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
    icon: '📊',
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
  // 查找当前路由对应的三级菜单名称
  let thirdMenuName = null
  menuData.value.forEach(menu => {
    if (menu.children) {
      menu.children.forEach(submenu => {
        if (submenu.children) {
          submenu.children.forEach(third => {
            if (third.path === route.path) {
              thirdMenuName = third.name
            }
          })
        }
      })
    }
  })
  
  return thirdMenuName || route.meta.title || '首页'
})

const selectMenu = (menu) => {
  currentMenu.value = menu
  currentSubmenu.value = null
  
  if (!menu.children || menu.children.length === 0) {
    router.push(menu.path)
  } else {
    // 如果有子菜单，默认选择第一个
    if (menu.children.length > 0) {
      selectSubmenu(menu.children[0])
    }
  }
}

const selectSubmenu = (submenu) => {
  if (currentSubmenu.value === submenu) {
    // 如果点击的是当前选中的二级菜单，切换三级菜单显示状态
    currentSubmenu.value = null
  } else {
    currentSubmenu.value = submenu
    
    if (!submenu.children || submenu.children.length === 0) {
      router.push(submenu.path)
    } else {
      // 如果有三级菜单，自动选择第一个
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
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: #f5f5f5;
}

/* 顶部导航栏 - 与一级菜单一体化 */
.top-header {
  height: 70px;
  background: #30BB83;
  display: flex;
  align-items: center;
  padding: 0 25px;
  justify-content: space-between;
  flex-shrink: 0;
}

.main-layout {
  display: flex;
  flex: 1;
}

/* 一级菜单 - 图标在上文字在下 */
.sidebar {
  width: 80px;
  background: #30BB83;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: #30BB83;
  color: #fff;
  font-size: 24px;
  font-weight: bold;
}

.menu-container {
  flex: 1;
  padding: 20px 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 70px;
  height: 65px;
  margin: 4px 5px;
  color: #fff;
  cursor: pointer;
  transition: all 0.3s;
  border-radius: 8px;
  position: relative;
}

.menu-item:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #fff;
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.2);
}

.menu-item.active {
  background: rgba(255, 255, 255, 0.3);
  color: #fff;
  box-shadow: 0 4px 15px rgba(255, 255, 255, 0.3);
}

.menu-icon {
  font-size: 18px;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 6px;
}

.menu-title {
  font-size: 9px;
  font-weight: 500;
  text-align: center;
  line-height: 1.2;
}

/* 二级菜单区域 - 150px宽 */
.submenu-area {
  width: 150px;
  background: #fff;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  margin-top: -1px;
}

.submenu-header {
  height: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: #30BB83;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
}

.header-icon {
  font-size: 28px;
  margin-bottom: 5px;
}

.header-title {
  font-size: 12px;
}

.submenu-content {
  flex: 1;
  padding: 15px 0;
}

.submenu-item {
  margin-bottom: 8px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.submenu-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  color: #555;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 13px;
  font-weight: 500;
  background: #fff;
}

.submenu-title:hover {
  background: #E8F3FE;
  color: #333;
  transform: translateX(3px);
}

.submenu-item.active .submenu-title {
  background: #E8F3FE;
  color: #333;
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(232, 243, 254, 0.5);
}

.arrow {
  font-size: 12px;
  color: #888;
  transition: transform 0.3s;
}

.submenu-item.active .arrow {
  transform: rotate(180deg);
  color: #333;
}

/* 三级菜单 - 在二级菜单下面展示 */
.thirdmenu-list {
  background: #fff;
}

.thirdmenu-item {
  padding: 10px 20px;
  color: #666;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 12px;
  background: #fff;
}

.thirdmenu-item:hover {
  background: #E8F3FE;
  color: #333;
}

.thirdmenu-item.active {
  background: #E8F3FE;
  color: #333;
  font-weight: 600;
}

/* 主容器 */
.main-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.breadcrumb-container {
  height: 60px;
  display: flex;
  align-items: center;
  padding: 0 25px;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  flex-shrink: 0;
}

.content {
  flex: 1;
  padding: 25px;
  background: #f5f5f5;
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

.global-logo {
  display: flex;
  align-items: center;
  margin-right: 20px;
  font-size: 28px;
  color: #fff;
}

.logo-title {
  margin-left: 10px;
  font-size: 18px;
  font-weight: bold;
  color: #fff;
}

.store-name {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

.breadcrumb {
  color: #666;
}

.breadcrumb :deep(.el-breadcrumb__item) {
  color: #666;
}

.breadcrumb :deep(.el-breadcrumb__item:last-child) {
  color: #333;
  font-weight: 600;
}

.user-info {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 10px 15px;
  border-radius: 20px;
  transition: all 0.3s;
  background: rgba(255, 255, 255, 0.9);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.user-info:hover {
  background: rgba(255, 255, 255, 1);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .sidebar {
    width: 180px;
  }
  .submenu-area {
    width: 120px;
  }
}

@media screen and (max-width: 1000px) {
  .sidebar {
    width: 160px;
  }
  .submenu-area {
    width: 100px;
  }
}
</style>