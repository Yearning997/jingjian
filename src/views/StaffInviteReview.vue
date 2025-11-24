<template>
  <div class="staff-invite-review">
    <div class="page-header">
      <h2>邀请员工审核</h2>
      <p>审核和管理员工邀请申请</p>
    </div>

    <div class="filter-section">
      <el-card class="filter-card">
        <div class="filter-row">
          <el-input
            v-model="searchKeyword"
            placeholder="搜索员工姓名、手机号或邮箱"
            clearable
            style="width: 300px"
            @clear="handleSearch"
            @keyup.enter="handleSearch"
          >
            <template #prefix>
              <el-icon><Search /></el-icon>
            </template>
          </el-input>
          
          <el-select v-model="statusFilter" placeholder="审核状态" style="width: 150px; margin-left: 10px">
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
            style="width: 240px; margin-left: 10px"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />

          <el-button type="primary" @click="handleSearch" style="margin-left: 10px">
            <el-icon><Search /></el-icon>
            搜索
          </el-button>
          
          <el-button @click="resetFilter">
            <el-icon><Refresh /></el-icon>
            重置
          </el-button>
        </div>
      </el-card>
    </div>

    <div class="table-section">
      <el-card class="table-card">
        <el-table 
          :data="tableData" 
          v-loading="loading"
          stripe
          border
          style="width: 100%"
        >
          <el-table-column type="selection" width="55" />
          
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
                @click="viewDetails(row)"
              >
                详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>

    <!-- 详情弹窗 -->
    <el-dialog
      v-model="detailDialogVisible"
      title="邀请详情"
      width="600px"
      :before-close="handleDetailClose"
    >
      <div v-if="selectedRow" class="detail-content">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="邀请码">{{ selectedRow.inviteCode }}</el-descriptions-item>
          <el-descriptions-item label="员工姓名">{{ selectedRow.staffName }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{ selectedRow.phone }}</el-descriptions-item>
          <el-descriptions-item label="邮箱">{{ selectedRow.email }}</el-descriptions-item>
          <el-descriptions-item label="申请职位">{{ selectedRow.position }}</el-descriptions-item>
          <el-descriptions-item label="邀请人">{{ selectedRow.inviter }}</el-descriptions-item>
          <el-descriptions-item label="邀请时间">{{ formatDate(selectedRow.inviteTime) }}</el-descriptions-item>
          <el-descriptions-item label="审核状态">
            <el-tag :type="getStatusType(selectedRow.status)">
              {{ getStatusText(selectedRow.status) }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="审核时间" v-if="selectedRow.reviewTime">
            {{ formatDate(selectedRow.reviewTime) }}
          </el-descriptions-item>
          <el-descriptions-item label="审核人" v-if="selectedRow.reviewer">
            {{ selectedRow.reviewer }}
          </el-descriptions-item>
          <el-descriptions-item label="备注" :span="2" v-if="selectedRow.remark">
            {{ selectedRow.remark }}
          </el-descriptions-item>
        </el-descriptions>
      </div>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="detailDialogVisible = false">关闭</el-button>
          <el-button 
            v-if="selectedRow && selectedRow.status === 'pending'"
            type="success" 
            @click="approveFromDialog"
          >
            通过
          </el-button>
          <el-button 
            v-if="selectedRow && selectedRow.status === 'pending'"
            type="danger" 
            @click="rejectFromDialog"
          >
            拒绝
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 审核弹窗 -->
    <el-dialog
      v-model="reviewDialogVisible"
      :title="reviewType === 'approve' ? '通过邀请' : '拒绝邀请'"
      width="500px"
    >
      <el-form :model="reviewForm" :rules="reviewRules" ref="reviewFormRef" label-width="80px">
        <el-form-item label="备注" prop="remark">
          <el-input
            v-model="reviewForm.remark"
            type="textarea"
            :rows="4"
            :placeholder="reviewType === 'approve' ? '请输入通过理由（可选）' : '请输入拒绝理由'"
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="reviewDialogVisible = false">取消</el-button>
          <el-button 
            :type="reviewType === 'approve' ? 'success' : 'danger'"
            @click="submitReview"
            :loading="reviewLoading"
          >
            确认{{ reviewType === 'approve' ? '通过' : '拒绝' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Refresh } from '@element-plus/icons-vue'

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const statusFilter = ref('')
const dateRange = ref([])
const currentPage = ref(1)
const pageSize = ref(20)
const total = ref(0)
const tableData = ref([])

// 弹窗相关
const detailDialogVisible = ref(false)
const reviewDialogVisible = ref(false)
const selectedRow = ref(null)
const reviewType = ref('approve')
const reviewLoading = ref(false)

// 审核表单
const reviewForm = reactive({
  remark: ''
})

const reviewRules = {
  remark: [
    { required: true, message: '请输入审核理由', trigger: 'blur' }
  ]
}

// 模拟数据
const mockData = [
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

// 方法
const handleSearch = () => {
  currentPage.value = 1
  fetchData()
}

const resetFilter = () => {
  searchKeyword.value = ''
  statusFilter.value = ''
  dateRange.value = []
  currentPage.value = 1
  fetchData()
}

const fetchData = async () => {
  loading.value = true
  try {
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500))
    
    let filteredData = [...mockData]
    
    // 搜索过滤
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
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
    
    total.value = filteredData.length
    
    // 分页
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    tableData.value = filteredData.slice(start, end)
    
  } catch (error) {
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
  fetchData()
}

const handleCurrentChange = (page) => {
  currentPage.value = page
  fetchData()
}

const approveInvite = (row) => {
  reviewType.value = 'approve'
  selectedRow.value = row
  reviewDialogVisible.value = true
}

const rejectInvite = (row) => {
  reviewType.value = 'reject'
  selectedRow.value = row
  reviewDialogVisible.value = true
}

const viewDetails = (row) => {
  selectedRow.value = row
  detailDialogVisible.value = true
}

const approveFromDialog = () => {
  approveInvite(selectedRow.value)
  detailDialogVisible.value = false
}

const rejectFromDialog = () => {
  rejectInvite(selectedRow.value)
  detailDialogVisible.value = false
}

const submitReview = async () => {
  try {
    await ElMessageBox.confirm(
      `确认${reviewType.value === 'approve' ? '通过' : '拒绝'}此邀请申请？`,
      '确认操作',
      {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        type: reviewType.value === 'approve' ? 'success' : 'warning'
      }
    )
    
    reviewLoading.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // 更新状态
    const index = mockData.findIndex(item => item.id === selectedRow.value.id)
    if (index !== -1) {
      mockData[index].status = reviewType.value === 'approve' ? 'approved' : 'rejected'
      mockData[index].reviewTime = new Date().toLocaleString()
      mockData[index].reviewer = '当前管理员'
      mockData[index].remark = reviewForm.remark
    }
    
    ElMessage.success(`邀请${reviewType.value === 'approve' ? '通过' : '拒绝'}成功`)
    reviewDialogVisible.value = false
    fetchData()
    
  } catch (error) {
    // 用户取消操作
  } finally {
    reviewLoading.value = false
  }
}

const handleDetailClose = () => {
  detailDialogVisible.value = false
  selectedRow.value = null
}

const getStatusType = (status) => {
  const statusMap = {
    'pending': 'warning',
    'approved': 'success',
    'rejected': 'danger'
  }
  return statusMap[status] || 'info'
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
  fetchData()
})
</script>

<style scoped>
.staff-invite-review {
  padding: 20px;
}

.page-header {
  margin-bottom: 20px;
}

.page-header h2 {
  margin: 0 0 8px 0;
  color: #30BB83;
  font-size: 24px;
  font-weight: 600;
}

.page-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.filter-section {
  margin-bottom: 20px;
}

.filter-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.table-section {
  margin-bottom: 20px;
}

.table-card {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.detail-content {
  padding: 10px 0;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
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

:deep(.el-dialog__body) {
  padding: 20px;
}

:deep(.el-descriptions__label) {
  font-weight: 600;
  color: #333;
}

:deep(.el-descriptions__content) {
  color: #666;
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }
  
  .filter-row > * {
    width: 100%;
    margin: 5px 0;
  }
}
</style>