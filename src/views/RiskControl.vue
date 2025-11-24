<template>
  <div class="page-container">
    <div class="page-header">
      <h1 class="page-title">风控设置</h1>
    </div>
    
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card title="风控规则设置">
          <template #header>
            <span>风控规则设置</span>
          </template>
          
          <el-form :model="riskSettings" label-width="150px">
            <el-form-item label="单日消费上限">
              <el-input-number v-model="riskSettings.dailyLimit" :min="0" />
              <span style="margin-left: 10px; color: #999;">元</span>
            </el-form-item>
            
            <el-form-item label="单笔交易上限">
              <el-input-number v-model="riskSettings.singleLimit" :min="0" />
              <span style="margin-left: 10px; color: #999;">元</span>
            </el-form-item>
            
            <el-form-item label="连续失败次数">
              <el-input-number v-model="riskSettings.failCount" :min="0" />
              <span style="margin-left: 10px; color: #999;">次</span>
            </el-form-item>
            
            <el-form-item label="异常登录监控">
              <el-switch v-model="riskSettings.loginMonitor" />
            </el-form-item>
            
            <el-form-item label="设备异常监控">
              <el-switch v-model="riskSettings.deviceMonitor" />
            </el-form-item>
            
            <el-form-item>
              <el-button type="primary" @click="saveSettings">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
      
      <el-col :span="12">
        <el-card title="风控统计">
          <template #header>
            <span>风控统计</span>
          </template>
          
          <div class="risk-stats">
            <div class="stat-item">
              <div class="stat-label">今日拦截异常</div>
              <div class="stat-value">23</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">本周拦截异常</div>
              <div class="stat-value">156</div>
            </div>
            <div class="stat-item">
              <div class="stat-label">本月拦截异常</div>
              <div class="stat-value">678</div>
            </div>
          </div>
        </el-card>
        
        <el-card style="margin-top: 20px;" title="风控级别设置">
          <template #header>
            <span>风控级别设置</span>
          </template>
          
          <el-table :data="riskLevels" style="width: 100%">
            <el-table-column prop="level" label="级别" width="80" />
            <el-table-column prop="name" label="名称" width="100" />
            <el-table-column prop="description" label="描述" />
            <el-table-column prop="action" label="处理方式" width="120" />
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const riskSettings = ref({
  dailyLimit: 5000,
  singleLimit: 1000,
  failCount: 5,
  loginMonitor: true,
  deviceMonitor: true
})

const riskLevels = ref([
  {
    level: 'L1',
    name: '低风险',
    description: '轻微异常，持续观察',
    action: '记录日志'
  },
  {
    level: 'L2',
    name: '中风险',
    description: '明显异常，需要验证',
    action: '短信验证'
  },
  {
    level: 'L3',
    name: '高风险',
    description: '严重异常，立即处理',
    action: '临时冻结'
  }
])

const saveSettings = () => {
  // 保存风控设置
}
</script>

<style scoped>
.risk-stats {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #409EFF;
}
</style>