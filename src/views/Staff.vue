<template>
  <div class="page-container">
    <div class="page-header">
      <div class="tab-nav">
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'staff' }"
          @click="switchTab('staff')"
        >
          员工审核
        </div>
        <div 
          class="tab-item" 
          :class="{ active: activeTab === 'invite' }"
          @click="switchTab('invite')"
        >
          邀请员工审核
        </div>
      </div>
    </div>

    <!-- 员工管理内容 -->
    <div v-if="activeTab === 'staff'" class="tab-content">
      <el-card>
        <template #header>
          <div style="width: 100%;">
            <!-- 筛选条件 -->
            <div style="display: flex; align-items: center; flex-wrap: wrap; gap: 10px; margin-bottom: 15px;">
              <div style="display: flex; align-items: center; gap: 5px;">
                <span style="font-size: 14px; color: #606266; white-space: nowrap;">员工姓名</span>
                <el-input
                  v-model="staffNameFilter"
                  placeholder="请输入员工姓名"
                  style="width: 150px;"
                  clearable
                />
              </div>
              
              <div style="display: flex; align-items: center; gap: 5px;">
                <span style="font-size: 14px; color: #606266; white-space: nowrap;">手机号码</span>
                <el-input
                  v-model="phoneFilter"
                  placeholder="请输入手机号码"
                  style="width: 150px;"
                  clearable
                />
              </div>
              
              <div style="display: flex; align-items: center; gap: 5px;">
                <span style="font-size: 14px; color: #606266; white-space: nowrap;">工号</span>
                <el-input
                  v-model="staffIdFilter"
                  placeholder="请输入工号"
                  style="width: 150px;"
                  clearable
                />
              </div>
              
              <div style="display: flex; align-items: center; gap: 5px;">
                <span style="font-size: 14px; color: #606266; white-space: nowrap;">状态</span>
                <el-select v-model="statusFilter" placeholder="请选择状态" style="width: 120px;">
                  <el-option label="全部" value="" />
                  <el-option label="启用" value="启用" />
                  <el-option label="过期" value="过期" />
                  <el-option label="禁用" value="禁用" />
                </el-select>
              </div>
              
              <div style="display: flex; align-items: center; gap: 5px;">
                <span style="font-size: 14px; color: #606266; white-space: nowrap;">创建来源</span>
                <el-select v-model="createSourceFilter" placeholder="请选择来源" style="width: 120px;">
                  <el-option label="全部" value="" />
                  <el-option label="门店" value="门店" />
                  <el-option label="集团" value="集团" />
                </el-select>
              </div>
              
              <div style="display: flex; align-items: center; gap: 5px;">
                <span style="font-size: 14px; color: #606266; white-space: nowrap;">所属职位</span>
                <el-select v-model="positionFilter" placeholder="请选择职位" style="width: 120px;">
                  <el-option label="全部" value="" />
                  <el-option label="管理员" value="管理员" />
                  <el-option label="门店店长" value="门店店长" />
                  <el-option label="收银员" value="收银员" />
                </el-select>
              </div>

              <el-button type="primary" @click="handleSearch">
                <el-icon><Search /></el-icon>
                搜索
              </el-button>
              
              <el-button @click="resetFilter">
                <el-icon><Refresh /></el-icon>
                重置
              </el-button>
            </div>
            
            <!-- 操作按钮 -->
            <div style="display: flex; align-items: center; gap: 10px;">
              <el-button type="primary" @click="handleAdd">
                <el-icon><Plus /></el-icon>
                添加员工
              </el-button>
              
              <el-button 
                type="warning" 
                @click="handleBatchExtend"
                :disabled="selectedRows.length === 0"
              >
                <el-icon><Clock /></el-icon>
                批量延期
              </el-button>
              
              <el-button 
                type="success" 
                @click="handleChangeSuperAdmin"
              >
                <el-icon><User /></el-icon>
                变更超级管理员
              </el-button>
            </div>
          </div>
        </template>
        
        <el-table 
          :data="staff" 
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :row-class-name="tableRowClassName"
          v-loading="tableLoading"
        >
          <el-table-column type="selection" width="55" />
          <el-table-column prop="staffId" label="工号" min-width="100" show-overflow-tooltip />
          <el-table-column prop="name" label="员工姓名" min-width="120" show-overflow-tooltip />
          <el-table-column prop="phone" label="手机号" min-width="130" show-overflow-tooltip />
          <el-table-column prop="position" label="所属职位" min-width="120">
            <template #default="{ row }">
              <el-tag :type="getPositionType(row.position)" size="small">{{ row.position }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="department" label="部门" min-width="120" show-overflow-tooltip />
          <el-table-column prop="createSource" label="创建来源" min-width="100">
            <template #default="{ row }">
              <el-tag :type="row.createSource === '集团' ? 'primary' : 'success'" size="small">{{ row.createSource }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="joinDate" label="入职时间" min-width="120" show-overflow-tooltip />
          <el-table-column prop="status" label="状态" min-width="100">
            <template #default="{ row }">
              <el-tag :type="getStaffStatusType(row.status)" size="small">{{ row.status }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="320" fixed="right">
            <template #default="{ row }">
              <el-button 
                style="background-color: #4C9DFF; border-color: #4C9DFF; color: white;" 
                size="small" 
                @click="handleEdit(row)"
              >
                编辑
              </el-button>
              <el-button 
                style="background-color: #4C9DFF; border-color: #4C9DFF; color: white;" 
                size="small" 
                @click="handleExtend(row)"
              >
                延期
              </el-button>
              <el-button 
                :style="{ backgroundColor: row.status === '启用' ? '#A0CFFF' : '#4C9DFF', borderColor: row.status === '启用' ? '#A0CFFF' : '#4C9DFF', color: 'white' }"
                size="small" 
                @click="handleEnable(row)"
                :disabled="row.status === '启用'"
              >
                启用
              </el-button>
              <el-button 
                style="background-color: #FFA726; border-color: #FFA726; color: white;" 
                size="small" 
                @click="handleDisable(row)"
                :disabled="row.status === '禁用'"
              >
                禁用
              </el-button>
              <el-button 
                style="background-color: #EC808D; border-color: #EC808D; color: white;" 
                size="small" 
                @click="handleDelete(row)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          layout="total, prev, pager, next"
          style="margin-top: 20px; text-align: right;"
        />
      </el-card>
    </div>

    <!-- 变更管理员弹窗 -->
    <el-dialog
      v-model="changeAdminDialogVisible"
      title="变更管理员"
      width="600px"
      :before-close="handleDialogClose"
    >
      <el-form :model="adminForm" label-width="120px">
        <el-form-item label="原管理员姓名：">
          <el-input v-model="adminForm.originalName" placeholder="请输入原管理员姓名" />
        </el-form-item>
        
        <el-form-item label="原管理员号码：">
          <el-input v-model="adminForm.originalPhone" placeholder="请输入原管理员手机号码">
            <template #append>
              <el-button @click="sendOriginalCode" :disabled="originalCodeCountdown > 0">
                {{ originalCodeCountdown > 0 ? `${originalCodeCountdown}秒后重发` : '获取验证码' }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="图形验证码：">
          <div style="display: flex; gap: 10px;">
            <el-input v-model="adminForm.originalCaptcha" placeholder="请输入图形验证码" style="width: 150px;" />
            <div style="width: 120px; height: 40px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; border: 1px solid #dcdfe6; border-radius: 4px; cursor: pointer;" @click="refreshOriginalCaptcha">
              <span style="color: #666; font-size: 16px; font-weight: bold;">{{ originalCaptchaText }}</span>
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="验证码：">
          <el-input v-model="adminForm.originalCode" placeholder="请输入验证码" />
          <div style="margin-top: 8px;">
            <span 
              style="color: #4C9DFF; font-size: 12px; cursor: pointer;"
              @click="handleUploadCertification"
            >
              无法接收验证码？
            </span>
          </div>
        </el-form-item>
        
        <el-divider />
        
        <el-form-item label="新管理员姓名：">
          <el-input v-model="adminForm.newName" placeholder="请输入新管理员姓名" />
        </el-form-item>
        
        <el-form-item label="新管理员号码：">
          <el-input v-model="adminForm.newPhone" placeholder="请输入新管理员手机号码">
            <template #append>
              <el-button @click="sendNewCode" :disabled="newCodeCountdown > 0">
                {{ newCodeCountdown > 0 ? `${newCodeCountdown}秒后重发` : '获取验证码' }}
              </el-button>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="图形验证码：">
          <div style="display: flex; gap: 10px;">
            <el-input v-model="adminForm.newCaptcha" placeholder="请输入图形验证码" style="width: 150px;" />
            <div style="width: 120px; height: 40px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; border: 1px solid #dcdfe6; border-radius: 4px; cursor: pointer;" @click="refreshNewCaptcha">
              <span style="color: #666; font-size: 16px; font-weight: bold;">{{ newCaptchaText }}</span>
            </div>
          </div>
        </el-form-item>
        
        <el-form-item label="验证码：">
          <el-input v-model="adminForm.newCode" placeholder="请输入验证码" />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div style="text-align: center;">
          <el-button @click="handleDialogClose">取消</el-button>
          <el-button type="primary" @click="submitAdminChange">提交</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 上传资质弹窗 -->
    <el-dialog
      v-model="uploadCertDialogVisible"
      title="上传资质证明"
      width="500px"
      :before-close="handleUploadDialogClose"
    >
      <el-form :model="uploadForm" label-width="120px">
        <el-form-item label="营业执照：">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleBusinessLicenseChange"
            :file-list="uploadForm.businessLicense ? [uploadForm.businessLicense] : []"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">
                请上传清晰的营业执照照片
              </div>
            </template>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="法人身份证正面：">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleLegalPersonFrontChange"
            :file-list="uploadForm.legalPersonFront ? [uploadForm.legalPersonFront] : []"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">
                请上传清晰的法人身份证正面照片
              </div>
            </template>
          </el-upload>
        </el-form-item>
        
        <el-form-item label="法人身份证反面：">
          <el-upload
            class="upload-demo"
            action="#"
            :auto-upload="false"
            :on-change="handleLegalPersonBackChange"
            :file-list="uploadForm.legalPersonBack ? [uploadForm.legalPersonBack] : []"
          >
            <el-button type="primary">点击上传</el-button>
            <template #tip>
              <div class="el-upload__tip">
                请上传清晰的法人身份证反面照片
              </div>
            </template>
          </el-upload>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div style="text-align: center;">
          <el-button @click="handleUploadDialogClose">取消</el-button>
          <el-button type="primary" @click="submitUpload" :disabled="!uploadForm.businessLicense || !uploadForm.legalPersonFront || !uploadForm.legalPersonBack">提交</el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 邀请员工审核内容 -->
    <div v-if="activeTab === 'invite'" class="tab-content">
      <el-card>
        <template #header>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div>
              <el-input
                v-model="inviteSearchKeyword"
                placeholder="搜索员工姓名、手机号或邮箱"
                style="width: 300px; margin-right: 10px;"
                clearable
              >
                <template #prefix>
                  <el-icon><Search /></el-icon>
                </template>
              </el-input>
              
              <el-select v-model="statusFilter" placeholder="审核状态" style="width: 150px; margin-right: 10px">
                <el-option label="全部" value="" />
                <el-option label="待审核" value="pending" />
                <el-option label="已通过" value="approved" />
                <el-option label="已拒绝" value="rejected" />
              </el-select>

              <el-date-picker
                v-model="dateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width: 240px; margin-right: 10px"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
              />

              <el-button type="primary" @click="handleInviteSearch">
                <el-icon><Search /></el-icon>
                搜索
              </el-button>
              
              <el-button @click="resetInviteFilter">
                <el-icon><Refresh /></el-icon>
                重置
              </el-button>
            </div>
          </div>
        </template>
        
        <el-table :data="inviteData" style="width: 100%" v-loading="inviteLoading">
          <el-table-column prop="inviteCode" label="邀请码" width="120" />
          <el-table-column prop="staffName" label="员工姓名" width="120" />
          <el-table-column prop="phone" label="手机号" width="130" />
          <el-table-column prop="email" label="邮箱" min-width="180">
            <template #default="{ row }">
              <el-tooltip :content="row.email" placement="top" :disabled="row.email.length <= 25">
                <span>{{ row.email.length > 25 ? row.email.substring(0, 25) + '...' : row.email }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="position" label="申请职位" width="120" />
          <el-table-column prop="inviter" label="邀请人" width="120" />
          <el-table-column prop="inviteTime" label="邀请时间" width="160">
            <template #default="{ row }">
              {{ formatDate(row.inviteTime) }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="100">
            <template #default="{ row }">
              <el-tag 
                :type="getStatusType(row.status)"
                size="small"
              >
                {{ getStatusText(row.status) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="180" fixed="right">
            <template #default="{ row }">
              <el-button 
                v-if="row.status === 'pending'"
                type="success" 
                size="small"
                @click="approveInvite(row)"
              >
                通过
              </el-button>
              <el-button 
                v-if="row.status === 'pending'"
                type="danger" 
                size="small"
                @click="rejectInvite(row)"
              >
                拒绝
              </el-button>
              <el-button 
                type="primary" 
                size="small"
                @click="viewInviteDetails(row)"
              >
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <el-pagination
          v-model:current-page="inviteCurrentPage"
          :page-size="invitePageSize"
          :total="inviteTotal"
          layout="total, prev, pager, next"
          style="margin-top: 20px; text-align: right;"
        />
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh, Plus, Clock, User } from '@element-plus/icons-vue'

// Tab切换相关
const activeTab = ref('staff')

// 员工管理相关
const searchKeyword = ref('')
const staffNameFilter = ref('')
const phoneFilter = ref('')
const staffIdFilter = ref('')
const statusFilter = ref('')
const createSourceFilter = ref('')
const positionFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
const selectedRows = ref([])
const tableLoading = ref(false)

// 变更管理员相关
const changeAdminDialogVisible = ref(false)
const originalCodeCountdown = ref(0)
const newCodeCountdown = ref(0)
const originalCaptchaText = ref('')
const newCaptchaText = ref('')
const adminForm = ref({
  originalName: '',
  originalPhone: '',
  originalCaptcha: '',
  originalCode: '',
  newName: '',
  newPhone: '',
  newCaptcha: '',
  newCode: ''
})

// 上传资质相关
const uploadCertDialogVisible = ref(false)
const uploadForm = ref({
  businessLicense: null,
  legalPersonFront: null,
  legalPersonBack: null
})

// 邀请审核相关
const inviteSearchKeyword = ref('')
const inviteStatusFilter = ref('')
const dateRange = ref([])
const inviteCurrentPage = ref(1)
const invitePageSize = ref(20)
const inviteTotal = ref(0)
const inviteLoading = ref(false)
const inviteData = ref([])

const staff = ref([
  {
    id: 'S001',
    name: '张三',
    phone: '13900139001',
    position: '管理员',
    department: '管理部',
    joinDate: '2023-01-15',
    status: '启用',
    createSource: '集团',
    staffId: 'GY001'
  },
  {
    id: 'S002',
    name: '李四',
    phone: '13900139002',
    position: '收银员',
    department: '运营部',
    joinDate: '2023-03-20',
    status: '启用',
    createSource: '门店',
    staffId: 'GY002'
  },
  {
    id: 'S003',
    name: '王五',
    phone: '13900139003',
    position: '门店店长',
    department: '运营部',
    joinDate: '2023-06-10',
    status: '禁用',
    createSource: '门店',
    staffId: 'GY003'
  },
  {
    id: 'S004',
    name: '赵六',
    phone: '13900139004',
    position: '收银员',
    department: '运营部',
    joinDate: '2023-08-05',
    status: '过期',
    createSource: '门店',
    staffId: 'GY004'
  },
  {
    id: 'S005',
    name: '钱七',
    phone: '13900139005',
    position: '管理员',
    department: '管理部',
    joinDate: '2023-10-15',
    status: '启用',
    createSource: '集团',
    staffId: 'GY005'
  }
])

// 模拟邀请数据
const mockInviteData = [
  {
    id: 1,
    inviteCode: 'INV001',
    staffName: '张三',
    phone: '13812345678',
    email: 'zhangsan@example.com',
    position: '收银员',
    inviter: '李四',
    inviteTime: '2024-01-15 10:30:00',
    status: 'pending'
  },
  {
    id: 2,
    inviteCode: 'INV002',
    staffName: '王五',
    phone: '13987654321',
    email: 'wangwu@example.com',
    position: '服务员',
    inviter: '赵六',
    inviteTime: '2024-01-14 14:20:00',
    status: 'approved',
    reviewTime: '2024-01-15 09:15:00',
    reviewer: '管理员',
    remark: '审核通过'
  },
  {
    id: 3,
    inviteCode: 'INV003',
    staffName: '赵七',
    phone: '13666666666',
    email: 'zhaoqi@example.com',
    position: '店长',
    inviter: '钱八',
    inviteTime: '2024-01-13 16:45:00',
    status: 'rejected',
    reviewTime: '2024-01-14 10:30:00',
    reviewer: '管理员',
    remark: '信息不符，拒绝申请'
  }
]

// Tab切换
const switchTab = (tab) => {
  activeTab.value = tab
  if (tab === 'invite') {
    fetchInviteData()
  }
}

// 员工管理方法
const handleSelectionChange = (selection) => {
  selectedRows.value = selection
}

const handleSearch = () => {
  currentPage.value = 1
  
  // 根据筛选条件过滤数据
  let filteredData = [...staff.value]
  
  if (staffNameFilter.value) {
    filteredData = filteredData.filter(item => 
      item.name.includes(staffNameFilter.value)
    )
  }
  
  if (phoneFilter.value) {
    filteredData = filteredData.filter(item => 
      item.phone.includes(phoneFilter.value)
    )
  }
  
  if (staffIdFilter.value) {
    filteredData = filteredData.filter(item => 
      item.staffId.includes(staffIdFilter.value)
    )
  }
  
  if (statusFilter.value) {
    filteredData = filteredData.filter(item => 
      item.status === statusFilter.value
    )
  }
  
  if (createSourceFilter.value) {
    filteredData = filteredData.filter(item => 
      item.createSource === createSourceFilter.value
    )
  }
  
  if (positionFilter.value) {
    filteredData = filteredData.filter(item => 
      item.position === positionFilter.value
    )
  }
  
  // 更新表格数据
  staff.value = filteredData
  total.value = filteredData.length
  
  ElMessage.success('搜索完成')
}

const resetFilter = () => {
  staffNameFilter.value = ''
  phoneFilter.value = ''
  staffIdFilter.value = ''
  statusFilter.value = ''
  createSourceFilter.value = ''
  positionFilter.value = ''
  currentPage.value = 1
  
  // 重置为原始数据
  staff.value = [
    {
      id: 'S001',
      name: '张三',
      phone: '13900139001',
      position: '管理员',
      department: '管理部',
      joinDate: '2023-01-15',
      status: '启用',
      createSource: '集团',
      staffId: 'GY001'
    },
    {
      id: 'S002',
      name: '李四',
      phone: '13900139002',
      position: '收银员',
      department: '运营部',
      joinDate: '2023-03-20',
      status: '启用',
      createSource: '门店',
      staffId: 'GY002'
    },
    {
      id: 'S003',
      name: '王五',
      phone: '13900139003',
      position: '门店店长',
      department: '运营部',
      joinDate: '2023-06-10',
      status: '禁用',
      createSource: '门店',
      staffId: 'GY003'
    },
    {
      id: 'S004',
      name: '赵六',
      phone: '13900139004',
      position: '收银员',
      department: '运营部',
      joinDate: '2023-08-05',
      status: '过期',
      createSource: '门店',
      staffId: 'GY004'
    },
    {
      id: 'S005',
      name: '钱七',
      phone: '13900139005',
      position: '管理员',
      department: '管理部',
      joinDate: '2023-10-15',
      status: '启用',
      createSource: '集团',
      staffId: 'GY005'
    }
  ]
  total.value = staff.value.length
  
  ElMessage.success('筛选条件已重置')
}

const handleAdd = () => {
  // 添加员工逻辑
  ElMessage.success('添加员工')
}

const handleEdit = (row) => {
  // 编辑员工逻辑
  ElMessage.success(`编辑员工: ${row.name}`)
}

const handleExtend = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确认延期员工 ${row.name} 的权限？`,
      '延期确认',
      {
        confirmButtonText: '确认延期',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟延期操作
    tableLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 更新状态
    row.status = '启用'
    ElMessage.success(`员工 ${row.name} 权限已延期`)
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('延期失败')
    }
  } finally {
    tableLoading.value = false
  }
}

const handleEnable = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确认启用员工 ${row.name} 的权限？`,
      '启用确认',
      {
        confirmButtonText: '确认启用',
        cancelButtonText: '取消',
        type: 'success'
      }
    )
    
    // 模拟启用操作
    tableLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 更新状态
    row.status = '启用'
    ElMessage.success(`员工 ${row.name} 已启用`)
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('启用失败')
    }
  } finally {
    tableLoading.value = false
  }
}

const handleDisable = async (row) => {
  try {
    await ElMessageBox.confirm(
      `确认禁用员工 ${row.name} 的权限？`,
      '禁用确认',
      {
        confirmButtonText: '确认禁用',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟禁用操作
    tableLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 800))
    
    // 更新状态
    row.status = '禁用'
    ElMessage.success(`员工 ${row.name} 已禁用`)
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('禁用失败')
    }
  } finally {
    tableLoading.value = false
  }
}

const handleDelete = (row) => {
  // 删除员工逻辑
  ElMessage.success(`删除员工: ${row.name}`)
}

const handleBatchExtend = async () => {
  try {
    await ElMessageBox.confirm(
      `确认批量延期选中的 ${selectedRows.value.length} 名员工？`,
      '批量操作确认',
      {
        confirmButtonText: '确认延期',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟批量延期操作
    ElMessage.success(`已为 ${selectedRows.value.length} 名员工办理延期`)
    
    // 清空选择
    selectedRows.value = []
    
  } catch (error) {
    // 用户取消操作
  }
}

const handleChangeSuperAdmin = () => {
  // 打开变更管理员弹窗
  changeAdminDialogVisible.value = true
  
  // 初始化图形验证码
  refreshOriginalCaptcha()
  refreshNewCaptcha()
}

// 生成随机验证码
const generateCaptcha = () => {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'
  let result = ''
  for (let i = 0; i < 4; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

// 刷新原管理员图形验证码
const refreshOriginalCaptcha = () => {
  originalCaptchaText.value = generateCaptcha()
}

// 刷新新管理员图形验证码
const refreshNewCaptcha = () => {
  newCaptchaText.value = generateCaptcha()
}

// 发送原管理员验证码
const sendOriginalCode = async () => {
  if (!adminForm.value.originalPhone) {
    ElMessage.error('请输入原管理员手机号码')
    return
  }
  
  if (!adminForm.value.originalCaptcha) {
    ElMessage.error('请输入图形验证码')
    return
  }
  
  if (adminForm.value.originalCaptcha.toUpperCase() !== originalCaptchaText.value.toUpperCase()) {
    ElMessage.error('图形验证码错误')
    refreshOriginalCaptcha()
    return
  }
  
  // 模拟发送验证码
  tableLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 开始倒计时
    originalCodeCountdown.value = 60
    const timer = setInterval(() => {
      originalCodeCountdown.value--
      if (originalCodeCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    
    ElMessage.success('验证码已发送')
    
  } catch (error) {
    ElMessage.error('发送验证码失败')
  } finally {
    tableLoading.value = false
  }
}

// 发送新管理员验证码
const sendNewCode = async () => {
  if (!adminForm.value.newPhone) {
    ElMessage.error('请输入新管理员手机号码')
    return
  }
  
  if (!adminForm.value.newCaptcha) {
    ElMessage.error('请输入图形验证码')
    return
  }
  
  if (adminForm.value.newCaptcha.toUpperCase() !== newCaptchaText.value.toUpperCase()) {
    ElMessage.error('图形验证码错误')
    refreshNewCaptcha()
    return
  }
  
  // 模拟发送验证码
  tableLoading.value = true
  try {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 开始倒计时
    newCodeCountdown.value = 60
    const timer = setInterval(() => {
      newCodeCountdown.value--
      if (newCodeCountdown.value <= 0) {
        clearInterval(timer)
      }
    }, 1000)
    
    ElMessage.success('验证码已发送')
    
  } catch (error) {
    ElMessage.error('发送验证码失败')
  } finally {
    tableLoading.value = false
  }
}

// 提交变更管理员
const submitAdminChange = async () => {
  if (!adminForm.value.originalName) {
    ElMessage.error('请输入原管理员姓名')
    return
  }
  
  if (!adminForm.value.originalPhone) {
    ElMessage.error('请输入原管理员手机号码')
    return
  }
  
  if (!adminForm.value.originalCode) {
    ElMessage.error('请输入原管理员验证码')
    return
  }
  
  if (!adminForm.value.newName) {
    ElMessage.error('请输入新管理员姓名')
    return
  }
  
  if (!adminForm.value.newPhone) {
    ElMessage.error('请输入新管理员手机号码')
    return
  }
  
  if (!adminForm.value.newCode) {
    ElMessage.error('请输入新管理员验证码')
    return
  }
  
  try {
    await ElMessageBox.confirm(
      '确认提交变更管理员申请？',
      '确认操作',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟提交操作
    tableLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('变更管理员申请已提交，请等待审核')
    handleDialogClose()
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('提交失败')
    }
  } finally {
    tableLoading.value = false
  }
}

// 关闭弹窗
const handleDialogClose = () => {
  changeAdminDialogVisible.value = false
  // 重置表单
  Object.keys(adminForm.value).forEach(key => {
    adminForm.value[key] = ''
  })
  originalCodeCountdown.value = 0
  newCodeCountdown.value = 0
  refreshOriginalCaptcha()
  refreshNewCaptcha()
}

// 处理上传资质
const handleUploadCertification = () => {
  uploadCertDialogVisible.value = true
}

// 处理营业执照上传
const handleBusinessLicenseChange = (file) => {
  uploadForm.value.businessLicense = file
}

// 处理法人身份证正面上传
const handleLegalPersonFrontChange = (file) => {
  uploadForm.value.legalPersonFront = file
}

// 处理法人身份证反面上传
const handleLegalPersonBackChange = (file) => {
  uploadForm.value.legalPersonBack = file
}

// 关闭上传资质弹窗
const handleUploadDialogClose = () => {
  uploadCertDialogVisible.value = false
  // 重置表单
  uploadForm.value = {
    businessLicense: null,
    legalPersonFront: null,
    legalPersonBack: null
  }
}

// 提交资质上传
const submitUpload = async () => {
  try {
    await ElMessageBox.confirm(
      '确认提交资质证明？',
      '确认操作',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟提交操作
    tableLoading.value = true
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    ElMessage.success('资质证明已提交，请等待审核')
    handleUploadDialogClose()
    
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('提交失败')
    }
  } finally {
    tableLoading.value = false
  }
}

const handleChangeAdmin = async () => {
  try {
    await ElMessageBox.confirm(
      `确认将选中的 ${selectedRows.value.length} 名员工设为管理员？`,
      '变更管理员确认',
      {
        confirmButtonText: '确认变更',
        cancelButtonText: '取消',
        type: 'success'
      }
    )
    
    // 模拟变更管理员操作
    ElMessage.success(`已将 ${selectedRows.value.length} 名员工设为管理员`)
    
    // 清空选择
    selectedRows.value = []
    
  } catch (error) {
    // 用户取消操作
  }
}

// 邀请审核方法
const handleInviteSearch = () => {
  inviteCurrentPage.value = 1
  fetchInviteData()
}

const resetInviteFilter = () => {
  inviteSearchKeyword.value = ''
  statusFilter.value = ''
  dateRange.value = []
  inviteCurrentPage.value = 1
  fetchInviteData()
}

const fetchInviteData = async () => {
  inviteLoading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredData = [...mockInviteData]
    
    // 搜索过滤
    if (inviteSearchKeyword.value) {
      const keyword = inviteSearchKeyword.value.toLowerCase()
      filteredData = filteredData.filter(item => 
        item.staffName.toLowerCase().includes(keyword) ||
        item.phone.includes(keyword) ||
        item.email.toLowerCase().includes(keyword)
      )
    }
    
    // 状态过滤
    if (statusFilter.value) {
      filteredData = filteredData.filter(item => item.status === statusFilter.value)
    }
    
    inviteTotal.value = filteredData.length
    
    // 分页
    const start = (inviteCurrentPage.value - 1) * invitePageSize.value
    const end = start + invitePageSize.value
    inviteData.value = filteredData.slice(start, end)
    
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    inviteLoading.value = false
  }
}

const approveInvite = async (row) => {
  try {
    await ElMessageBox.confirm(
      '确认通过此邀请申请？',
      '确认操作',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'success'
      }
    )
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新状态
    const index = mockInviteData.findIndex(item => item.id === row.id)
    if (index !== -1) {
      mockInviteData[index].status = 'approved'
      mockInviteData[index].reviewTime = new Date().toLocaleString()
      mockInviteData[index].reviewer = '当前管理员'
      mockInviteData[index].remark = '审核通过'
    }
    
    ElMessage.success('邀请通过成功')
    fetchInviteData()
    
  } catch (error) {
    // 用户取消操作
  }
}

const rejectInvite = async (row) => {
  try {
    await ElMessageBox.confirm(
      '确认拒绝此邀请申请？',
      '确认操作',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新状态
    const index = mockInviteData.findIndex(item => item.id === row.id)
    if (index !== -1) {
      mockInviteData[index].status = 'rejected'
      mockInviteData[index].reviewTime = new Date().toLocaleString()
      mockInviteData[index].reviewer = '当前管理员'
      mockInviteData[index].remark = '拒绝申请'
    }
    
    ElMessage.success('邀请拒绝成功')
    fetchInviteData()
    
  } catch (error) {
    // 用户取消操作
  }
}

const viewInviteDetails = (row) => {
  // 查看详情逻辑
  console.log('查看详情:', row)
}

const getStatusType = (status) => {
  const statusMap = {
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'danger'
  }
  return statusMap[status] || 'info'
}

const getStaffStatusType = (status) => {
  const statusMap = {
    '启用': 'success',
    '过期': 'warning',
    '禁用': 'danger'
  }
  return statusMap[status] || 'info'
}

const getPositionType = (position) => {
  const positionMap = {
    '超级管理员': 'danger',
    '管理员': 'warning',
    '门店店长': 'primary',
    '收银员': 'success'
  }
  return positionMap[position] || 'info'
}

const tableRowClassName = ({ row, rowIndex }) => {
  if (row.position === '超级管理员') {
    return 'super-admin-row'
  }
  return ''
}

const getStatusText = (status) => {
  const statusMap = {
    'pending': '待审核',
    'approved': '已通过',
    'rejected': '已拒绝'
  }
  return statusMap[status] || '未知'
}

const formatDate = (dateString) => {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 生命周期
onMounted(() => {
  // 默认加载员工管理数据
})
</script>

<style scoped>
.page-container {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-title {
  margin: 0;
  color: #30BB83;
  font-size: 24px;
  font-weight: 600;
}

/* Tab导航样式 */
.tab-nav {
  display: flex;
  border-bottom: 2px solid #e5e5e5;
  margin-bottom: 20px;
}

.tab-item {
  padding: 12px 24px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  color: #666;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  transition: all 0.3s;
  position: relative;
}

.tab-item:hover {
  color: #30BB83;
  background: rgba(48, 187, 131, 0.05);
}

.tab-item.active {
  color: #4C9DFF;
  border-bottom-color: #4C9DFF;
  font-weight: 600;
}

.tab-content {
  min-height: 400px;
}

/* 表格样式优化 */
:deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid #e5e5e5;
}

:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table th) {
  background-color: #f8f9fa;
  color: #333;
  font-weight: 600;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #fafafa;
}

:deep(.el-pagination) {
  justify-content: flex-end;
}

/* 表格样式优化 */
:deep(.el-table) {
  font-size: 14px;
}

:deep(.el-table th) {
  background-color: #f8f9fa;
  color: #333;
  font-weight: 600;
  white-space: nowrap;
}

:deep(.el-table--striped .el-table__body tr.el-table__row--striped td) {
  background-color: #fafafa;
}

:deep(.el-table .super-admin-row) {
  background-color: #fff2f0;
}

:deep(.el-table .super-admin-row:hover > td) {
  background-color: #ffe6e6 !important;
}

:deep(.el-table .cell) {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

:deep(.el-table .el-tag) {
  font-size: 12px;
  padding: 2px 8px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .tab-nav {
    flex-direction: column;
    border-bottom: none;
    border-left: 2px solid #e5e5e5;
  }
  
  .tab-item {
    border-bottom: none;
    border-left: 2px solid transparent;
    margin-bottom: 0;
    margin-left: -2px;
  }
  
  .tab-item.active {
    border-left-color: #4C9DFF;
    border-bottom-color: transparent;
  }
  
  :deep(.el-card__header > div) {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }
  
  :deep(.el-card__header > div > *) {
    width: 100%;
  }
  
  /* 移动端表格优化 */
  :deep(.el-table) {
    font-size: 12px;
  }
  
  :deep(.el-table th),
  :deep(.el-table td) {
    padding: 8px 4px;
  }
  
  :deep(.el-table .el-button) {
    font-size: 11px;
    padding: 4px 8px;
  }
  
  :deep(.el-table .el-tag) {
    font-size: 10px;
    padding: 1px 6px;
  }
}

/* 超小屏幕优化 */
@media (max-width: 480px) {
  .page-container {
    padding: 10px;
  }
  
  :deep(.el-table) {
    font-size: 11px;
  }
  
  :deep(.el-table th),
  :deep(.el-table td) {
    padding: 6px 2px;
  }
  
  :deep(.el-table .el-button) {
    font-size: 10px;
    padding: 3px 6px;
    margin: 1px;
  }
}
</style>