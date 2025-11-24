<template>
  <div class="layout-container">
    <!-- 侧边栏 -->
    <div class="sidebar" :class="{ collapsed: isCollapsed }">
      <div class="logo">
        <span v-if="!isCollapsed">🐋 鲸舰电玩城</span>
        <span v-else>🐋</span>
      </div>
      <el-menu
        :default-active="$route.path"
        :collapse="isCollapsed"
        :unique-opened="true"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
      >
        <!-- 首页 -->
        <el-menu-item index="/dashboard">
          <el-icon><House /></el-icon>
          <template #title>首页</template>
        </el-menu-item>

        <!-- 日常 -->
        <el-menu-item index="/daily">
          <el-icon><Calendar /></el-icon>
          <template #title>日常</template>
        </el-menu-item>

        <!-- 套餐 -->
        <el-menu-item index="/packages">
          <el-icon><Box /></el-icon>
          <template #title>套餐</template>
        </el-menu-item>

        <!-- 会员 -->
        <el-menu-item index="/members">
          <el-icon><User /></el-icon>
          <template #title>会员</template>
        </el-menu-item>

        <!-- 商品 -->
        <el-menu-item index="/products">
          <el-icon><Goods /></el-icon>
          <template #title>商品</template>
        </el-menu-item>

        <!-- 营销 -->
        <el-menu-item index="/marketing">
          <el-icon><TrendCharts /></el-icon>
          <template #title>营销</template>
        </el-menu-item>

        <!-- 设备 -->
        <el-menu-item index="/equipment">
          <el-icon><Monitor /></el-icon>
          <template #title>设备</template>
        </el-menu-item>

        <!-- 氛围 -->
        <el-menu-item index="/atmosphere">
          <el-icon><Picture /></el-icon>
          <template #title>氛围</template>
        </el-menu-item>

        <!-- 台球 -->
        <el-menu-item index="/billiards">
          <el-icon><Compass /></el-icon>
          <template #title>台球</template>
        </el-menu-item>

        <!-- 线上 -->
        <el-menu-item index="/online">
          <el-icon><Link /></el-icon>
          <template #title>线上</template>
        </el-menu-item>

        <!-- 报表 -->
        <el-menu-item index="/reports">
          <el-icon><DataAnalysis /></el-icon>
          <template #title>报表</template>
        </el-menu-item>

        <!-- 设置 -->
        <el-sub-menu index="/settings">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>设置</span>
          </template>
          
          <!-- 员工权限 -->
          <el-sub-menu index="/staff-permissions">
            <template #title>
              <el-icon><UserFilled /></el-icon>
              <span>员工权限</span>
            </template>
            <el-menu-item index="/staff">
              <el-icon><User /></el-icon>
              <template #title>员工管理</template>
            </el-menu-item>
            <el-menu-item index="/positions">
              <el-icon><Medal /></el-icon>
              <template #title>职位权限</template>
            </el-menu-item>
          </el-sub-menu>

          <!-- 运营监控 -->
          <el-sub-menu index="/operations">
            <template #title>
              <el-icon><View /></el-icon>
              <span>运营监控</span>
            </template>
            <el-menu-item index="/risk-control">
              <el-icon><Warning /></el-icon>
              <template #title>风控设置</template>
            </el-menu-item>
            <el-menu-item index="/exceptions">
              <el-icon><CircleClose /></el-icon>
              <template #title>异常记录</template>
            </el-menu-item>
            <el-menu-item index="/export-center">
              <el-icon><Download /></el-icon>
              <template #title>导出中心</template>
            </el-menu-item>
            <el-menu-item index="/system-logs">
              <el-icon><Document /></el-icon>
              <template #title>系统日志</template>
            </el-menu-item>
            <el-menu-item index="/recycle">
              <el-icon><Delete /></el-icon>
              <template #title>回收站</template>
            </el-menu-item>
          </el-sub-menu>

          <!-- 基础设置 -->
          <el-sub-menu index="/basic-settings">
            <template #title>
              <el-icon><Tools /></el-icon>
              <span>基础设置</span>
            </template>
            <el-menu-item index="/finance-settings">
              <el-icon><Money /></el-icon>
              <template #title>财务设置</template>
            </el-menu-item>
            <el-menu-item index="/message-management">
              <el-icon><Bell /></el-icon>
              <template #title>消息管理</template>
            </el-menu-item>
            <el-menu-item index="/payment-merchants">
              <el-icon><CreditCard /></el-icon>
              <template #title>支付商户</template>
            </el-menu-item>
          </el-sub-menu>

          <!-- 更多设置 -->
          <el-menu-item index="/more-settings">
            <el-icon><MoreFilled /></el-icon>
            <template #title>更多设置</template>
          </el-menu-item>

          <!-- 数据管理 -->
          <el-menu-item index="/data-management">
            <el-icon><Database /></el-icon>
            <template #title>数据管理</template>
          </el-menu-item>

          <!-- 开放平台 -->
          <el-menu-item index="/open-platform">
            <el-icon><Connection /></el-icon>
            <template #title>开放平台</template>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </div>

    <!-- 主容器 -->
    <div class="main-container">
      <!-- 顶部导航 -->
      <div class="header">
        <div class="left">
          <el-button
            type="text"
            @click="toggleSidebar"
            style="font-size: 20px; margin-right: 20px;"
          >
            <el-icon><Fold v-if="!isCollapsed" /><Expand v-else /></el-icon>
          </el-button>
          <el-breadcrumb separator="/">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const isCollapsed = ref(false)

const toggleSidebar = () => {
  isCollapsed.value = !isCollapsed.value
}

const currentTitle = computed(() => {
  return route.meta.title || '首页'
})
</script>

<style scoped>
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