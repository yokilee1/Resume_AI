<template>
  <div class="resume-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <el-icon><Document /></el-icon>
            简历管理
          </h1>
          <p class="page-subtitle">管理您的所有简历，让求职更高效</p>
        </div>
        <div class="header-actions">
          <el-button 
            type="primary" 
            size="large"
            :icon="Plus"
            @click="createNewResume"
          >
            新建简历
          </el-button>
        </div>
      </div>
    </div>

    <!-- 工具栏 -->
    <div class="toolbar">
      <div class="toolbar-left">
        <el-input
          v-model="searchKeyword"
          placeholder="搜索简历..."
          :prefix-icon="Search"
          class="search-input"
          clearable
        />
        <el-select
          v-model="statusFilter"
          placeholder="状态筛选"
          clearable
          class="status-filter"
        >
          <el-option label="全部状态" value="" />
          <el-option label="草稿" value="draft" />
          <el-option label="已完成" value="completed" />
          <el-option label="已发布" value="published" />
        </el-select>
        <el-select
          v-model="sortBy"
          placeholder="排序方式"
          class="sort-select"
        >
          <el-option label="最近更新" value="updateTime" />
          <el-option label="创建时间" value="createTime" />
          <el-option label="名称" value="name" />
        </el-select>
      </div>
      <div class="toolbar-right">
        <el-button
          :icon="batchMode ? 'Close' : 'Select'"
          @click="toggleBatchMode"
        >
          {{ batchMode ? '取消选择' : '批量操作' }}
        </el-button>
        <el-dropdown v-if="batchMode && selectedResumes.length > 0" @command="handleBatchCommand">
          <el-button type="primary">
            批量操作 ({{ selectedResumes.length }})
            <el-icon><ArrowDown /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="delete">
                <el-icon><Delete /></el-icon>
                删除选中
              </el-dropdown-item>
              <el-dropdown-item command="export">
                <el-icon><Download /></el-icon>
                导出选中
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>

    <!-- 简历列表 -->
    <div class="content-container">
      <div class="resume-stats" v-if="!batchMode">
        <div class="stat-card">
          <div class="stat-number">{{ resumeList.length }}</div>
          <div class="stat-label">总简历数</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ completedCount }}</div>
          <div class="stat-label">已完成</div>
        </div>
        <div class="stat-card">
          <div class="stat-number">{{ draftCount }}</div>
          <div class="stat-label">草稿</div>
        </div>
      </div>

      <div class="resume-list" v-if="filteredResumes.length > 0">
        <ResumeCard 
          v-for="resume in filteredResumes" 
          :key="resume.id"
          :resume="resume"
          :is-selected="selectedResumes.includes(resume.id)"
          :show-checkbox="batchMode"
          @edit="editResume"
          @preview="previewResume"
          @download="downloadResume"
          @delete="deleteResume"
          @duplicate="duplicateResume"
          @rename="renameResume"
          @select="handleResumeSelect"
        />
      </div>

      <!-- 空状态 -->
      <div class="empty-state" v-else>
        <div class="empty-icon">
          <el-icon><DocumentAdd /></el-icon>
        </div>
        <h3>{{ searchKeyword ? '未找到匹配的简历' : '还没有简历' }}</h3>
        <p>{{ searchKeyword ? '尝试调整搜索条件' : '创建您的第一份简历，开始求职之旅' }}</p>
        <el-button 
          v-if="!searchKeyword"
          type="primary" 
          size="large"
          :icon="Plus"
          @click="createNewResume"
        >
          创建第一份简历
        </el-button>
      </div>
    </div>

    <!-- 简历预览对话框 -->
    <el-dialog
      v-model="previewDialogVisible"
      title="简历预览"
      width="80%"
      :before-close="closePreviewDialog"
    >
      <ResumePreview
        v-if="currentPreviewResume"
        :basicInfo="currentPreviewResume.content?.basicInfo || {}"
        :experiences="currentPreviewResume.content?.experiences || []"
        :education="currentPreviewResume.content?.education || []"
        :skills="currentPreviewResume.content?.skills || ''"
      />
    </el-dialog>

    <!-- 重命名对话框 -->
    <el-dialog
      v-model="renameDialogVisible"
      title="重命名简历"
      width="400px"
    >
      <el-form @submit.prevent="confirmRename">
        <el-form-item label="简历名称">
          <el-input
            v-model="newResumeName"
            placeholder="请输入新的简历名称"
            maxlength="50"
            show-word-limit
            ref="renameInput"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="renameDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirmRename">确认</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  Document, 
  Plus, 
  Search, 
  ArrowDown, 
  Delete, 
  Download, 
  DocumentAdd 
} from '@element-plus/icons-vue'
import ResumeCard from '@/components/resume/ResumeCard.vue'
import ResumePreview from '@/components/resume/ResumePreview.vue'
import { useResumeStore } from '@/stores/resumeStore'

const router = useRouter()
const resumeStore = useResumeStore()

// 响应式数据
const searchKeyword = ref('')
const statusFilter = ref('')
const sortBy = ref('updateTime')
const batchMode = ref(false)
const selectedResumes = ref([])

// 对话框状态
const previewDialogVisible = ref(false)
const renameDialogVisible = ref(false)
const currentPreviewResume = ref(null)
const currentRenameResume = ref(null)
const newResumeName = ref('')
const renameInput = ref(null)

// 计算属性 - 使用store中的数据
const resumeList = computed(() => resumeStore.resumes)

const filteredResumes = computed(() => {
  let filtered = resumeStore.getAllResumes()

  // 搜索过滤
  if (searchKeyword.value) {
    filtered = resumeStore.searchResumes(searchKeyword.value)
  }

  // 状态过滤
  if (statusFilter.value) {
    filtered = resumeStore.filterResumesByStatus(statusFilter.value)
    
    // 如果同时有搜索和状态过滤，需要进一步过滤
    if (searchKeyword.value) {
      const keyword = searchKeyword.value.toLowerCase()
      filtered = filtered.filter(resume => 
        resume.name.toLowerCase().includes(keyword) ||
        resume.content?.basicInfo?.name?.toLowerCase().includes(keyword) ||
        resume.content?.basicInfo?.position?.toLowerCase().includes(keyword)
      )
    }
  }

  // 排序
  return resumeStore.sortResumes(filtered, sortBy.value, 'desc')
})

const completedCount = computed(() => resumeStore.completedCount)
const draftCount = computed(() => resumeStore.draftCount)

// 方法
/**
 * 编辑简历
 * @param {Object} resume - 简历对象
 */
const editResume = (resume) => {
  router.push(`/resume/edit/${resume.id}`)
}

/**
 * 预览简历
 * @param {Object} resume - 简历对象
 */
const previewResume = (resume) => {
  currentPreviewResume.value = resume
  previewDialogVisible.value = true
}

/**
 * 关闭预览对话框
 */
const closePreviewDialog = () => {
  previewDialogVisible.value = false
  currentPreviewResume.value = null
}

/**
 * 下载简历
 * @param {Object} resume - 简历对象
 */
const downloadResume = (resume) => {
  ElMessage.success(`正在下载简历：${resume.name}`)
  // 这里实现下载逻辑
}

/**
 * 删除简历
 * @param {Object} resume - 简历对象
 */
const deleteResume = async (resume) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除简历"${resume.name}"吗？此操作不可恢复。`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    await resumeStore.deleteResume(resume.id)
    ElMessage.success('简历删除成功')
  } catch (error) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

/**
 * 复制简历
 * @param {Object} resume - 简历对象
 */
const duplicateResume = async (resume) => {
  try {
    await resumeStore.duplicateResume(resume.id)
    ElMessage.success('简历复制成功')
  } catch (error) {
    ElMessage.error('复制失败')
  }
}

/**
 * 重命名简历
 * @param {Object} resume - 简历对象
 */
const renameResume = (resume) => {
  currentRenameResume.value = resume
  newResumeName.value = resume.name
  renameDialogVisible.value = true
  nextTick(() => {
    renameInput.value?.focus()
  })
}

/**
 * 确认重命名
 */
const confirmRename = async () => {
  if (!newResumeName.value.trim()) {
    ElMessage.warning('请输入简历名称')
    return
  }
  
  try {
    await resumeStore.updateResume(currentRenameResume.value.id, {
      name: newResumeName.value.trim()
    })
    renameDialogVisible.value = false
    currentRenameResume.value = null
    newResumeName.value = ''
    ElMessage.success('重命名成功')
  } catch (error) {
    ElMessage.error('重命名失败')
  }
}

/**
 * 创建新简历
 */
const createNewResume = () => {
  router.push('/create-resume')
}

/**
 * 切换批量操作模式
 */
const toggleBatchMode = () => {
  batchMode.value = !batchMode.value
  if (!batchMode.value) {
    selectedResumes.value = []
  }
}

/**
 * 处理简历选择
 * @param {Object} resume - 简历对象
 * @param {boolean} selected - 是否选中
 */
const handleResumeSelect = (resume, selected) => {
  if (selected) {
    if (!selectedResumes.value.includes(resume.id)) {
      selectedResumes.value.push(resume.id)
    }
  } else {
    const index = selectedResumes.value.indexOf(resume.id)
    if (index > -1) {
      selectedResumes.value.splice(index, 1)
    }
  }
}

/**
 * 处理批量操作命令
 * @param {string} command - 操作命令
 */
const handleBatchCommand = async (command) => {
  if (selectedResumes.value.length === 0) {
    ElMessage.warning('请选择要操作的简历')
    return
  }
  
  switch (command) {
    case 'delete':
      try {
        await ElMessageBox.confirm(
          `确定要删除选中的 ${selectedResumes.value.length} 份简历吗？此操作不可恢复。`,
          '批量删除确认',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
          }
        )
        
        await resumeStore.batchDeleteResumes(selectedResumes.value)
        selectedResumes.value = []
        ElMessage.success('批量删除成功')
      } catch (error) {
        if (error !== 'cancel') {
          ElMessage.error('批量删除失败')
        }
      }
      break
      
    case 'export':
      ElMessage.info('批量导出功能开发中...')
      break
  }
}

// 组件挂载时初始化数据
onMounted(async () => {
  try {
    await resumeStore.fetchResumes()
    console.log('ResumeManagement页面已加载')
  } catch (error) {
    ElMessage.error('获取简历列表失败')
  }
})
</script>

<style scoped>
.resume-management {
  min-height: 100vh;
}

/* 页面头部 */
.page-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 24px 0;
  margin-bottom: 24px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-section {
  flex: 1;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 32px;
  font-weight: 700;
}

.page-title .el-icon {
  font-size: 36px;
  color: #3b82f6;
}

.page-subtitle {
  margin: 0;
  color: #6b7280;
  font-size: 16px;
  font-weight: 400;
}

.header-actions {
  display: flex;
  gap: 12px;
}

/* 工具栏 */
.toolbar {
  max-width: 1200px;
  margin: 0 auto 24px auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.toolbar-left {
  display: flex;
  gap: 12px;
  flex: 1;
}

.toolbar-right {
  display: flex;
  gap: 12px;
}

.search-input {
  width: 300px;
}

.status-filter,
.sort-select {
  width: 150px;
}

/* 内容容器 */
.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

/* 统计卡片 */
.resume-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 32px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px -5px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 36px;
  font-weight: 700;
  color: #3b82f6;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

/* 简历列表 */
.resume-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

/* 空状态 */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.empty-icon {
  margin-bottom: 24px;
}

.empty-icon .el-icon {
  font-size: 64px;
  color: #d1d5db;
}

.empty-state h3 {
  margin: 0 0 12px 0;
  color: #374151;
  font-size: 20px;
  font-weight: 600;
}

.empty-state p {
  margin: 0 0 24px 0;
  color: #6b7280;
  font-size: 16px;
}

/* 对话框样式 */
:deep(.el-dialog) {
  border-radius: 12px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
  padding: 20px 24px;
}

:deep(.el-dialog__title) {
  font-weight: 600;
  color: #1f2937;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .header-content {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .toolbar-left {
    flex-direction: column;
  }

  .toolbar-right {
    justify-content: flex-end;
  }

  .search-input,
  .status-filter,
  .sort-select {
    width: 100%;
  }

  .resume-list {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 16px 0;
  }

  .header-content {
    padding: 0 16px;
  }

  .page-title {
    font-size: 24px;
  }

  .page-title .el-icon {
    font-size: 28px;
  }

  .toolbar {
    padding: 0 16px;
    margin-bottom: 16px;
  }

  .content-container {
    padding: 0 16px;
  }

  .resume-stats {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .stat-card {
    padding: 16px;
  }

  .stat-number {
    font-size: 28px;
  }

  .resume-list {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .empty-state {
    padding: 60px 16px;
  }

  .empty-icon .el-icon {
    font-size: 48px;
  }
}

@media (max-width: 480px) {
  .header-actions {
    width: 100%;
  }

  .header-actions .el-button {
    width: 100%;
  }

  .toolbar-left {
    gap: 8px;
  }

  .toolbar-right {
    gap: 8px;
  }

  .resume-stats {
    grid-template-columns: 1fr;
  }
}

/* 动画效果 */
.resume-list > * {
  animation: fadeInUp 0.6s ease-out;
}

.resume-list > *:nth-child(1) { animation-delay: 0.1s; }
.resume-list > *:nth-child(2) { animation-delay: 0.2s; }
.resume-list > *:nth-child(3) { animation-delay: 0.3s; }
.resume-list > *:nth-child(4) { animation-delay: 0.4s; }
.resume-list > *:nth-child(5) { animation-delay: 0.5s; }
.resume-list > *:nth-child(6) { animation-delay: 0.6s; }

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 滚动条样式 */
:deep(.el-scrollbar__wrap) {
  scrollbar-width: thin;
  scrollbar-color: #d1d5db #f3f4f6;
}

:deep(.el-scrollbar__wrap::-webkit-scrollbar) {
  width: 6px;
}

:deep(.el-scrollbar__wrap::-webkit-scrollbar-track) {
  background: #f3f4f6;
  border-radius: 3px;
}

:deep(.el-scrollbar__wrap::-webkit-scrollbar-thumb) {
  background: #d1d5db;
  border-radius: 3px;
}

:deep(.el-scrollbar__wrap::-webkit-scrollbar-thumb:hover) {
  background: #9ca3af;
}
</style>