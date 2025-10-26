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

<style scoped lang="scss">
.resume-management {
  padding: var(--spacing-xl);
  min-height: 100vh;

  /* 黑白灰主题变量（页面局部覆盖） */
  --ui-bg: #ffffff;
  --ui-bg-alt: #f8f9fa;
  --ui-hover-bg: #f2f3f5;
  --ui-border: #e5e7eb;
  --ui-text-primary: #111111;
  --ui-text-secondary: #555555;
  --ui-focus-outline: #111111;
  --ui-accent: #111111;
}

/* 页面头部 */
.page-header {
  margin-bottom: var(--spacing-4xl);
  padding: var(--spacing-4xl) 0;
  background: var(--ui-bg);
  border-radius: var(--radius-2xl);
  color: inherit;
  position: relative;
  overflow: hidden;
  box-shadow: none;
  border: 1px solid var(--ui-border);
}

.page-title .el-icon {
  color: var(--ui-text-primary);
}

.page-subtitle {
  color: var(--ui-text-secondary);
}

.header-actions :deep(.el-button--primary) {
  background: var(--ui-accent);
  border-color: var(--ui-accent);
  color: var(--white);
  box-shadow: none;
}

.header-actions :deep(.el-button--primary:hover) {
  background: var(--gray-800);
  border-color: var(--gray-800);
}

/* 卡片与操作按钮令牌化 */
.resume-card {
  background: var(--ui-bg);
  border: 1px solid var(--ui-border);
}

.action-btn {
  border: 1px solid var(--ui-border);
  background: var(--ui-bg);
  color: var(--ui-text-secondary);
}

.action-btn:hover {
  background: var(--ui-hover-bg);
  color: var(--ui-text-primary);
  border-color: var(--ui-focus-outline);
}

/* 可访问性：键盘焦点 */
.action-btn:focus-visible,
.resume-card:focus-visible,
.header-actions :deep(.el-button--primary:focus-visible) {
  outline: 2px solid var(--ui-focus-outline);
  outline-offset: 2px;
}
.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: none;
  pointer-events: none;
}

.toolbar {
  background: var(--ui-bg);
  padding: var(--spacing-xl);
  border-radius: var(--radius-xl);
  box-shadow: none;
  margin-bottom: var(--spacing-xl);
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: var(--spacing-lg);
  border: 1px solid var(--ui-border);
  max-width: 1400px;
  margin-left: auto;
  margin-right: auto;
}

.toolbar-left {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr;
  gap: var(--spacing-md);
  align-items: center;
}

.toolbar-right {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  justify-content: flex-end;
}

@media (max-width: 1024px) {
  .toolbar {
    grid-template-columns: 1fr;
  }
  .toolbar-right {
    justify-content: flex-start;
    flex-wrap: wrap;
  }
  .toolbar-left {
    grid-template-columns: 1fr;
  }
}

/* 统计卡片布局统一 */
.resume-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

@media (max-width: 1024px) {
  .resume-stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .resume-stats {
    grid-template-columns: 1fr;
  }
}

.stat-card {
  background: var(--ui-bg);
  padding: var(--spacing-xl);
  border-radius: var(--radius-md);
  box-shadow: none;
  text-align: center;
  border: 1px solid var(--ui-border);
}

.stat-number {
  font-size: var(--text-3xl);
  font-weight: var(--font-extrabold);
  color: var(--ui-text-primary);
  margin-bottom: var(--spacing-sm);
}

.stat-label {
  color: var(--ui-text-secondary);
}

.resumes-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xl);
}

@media (max-width: 1200px) {
  .resumes-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .resumes-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
}

.resume-card {
  background: var(--ui-bg);
  border: 1px solid var(--ui-border);
  border-radius: var(--radius-md);
  box-shadow: none;
  transition: border-color var(--transition-fast), background var(--transition-fast);
  content-visibility: auto;
  contain-intrinsic-size: 220px;
}

.resume-card:hover {
  background: var(--ui-hover-bg);
  border-color: var(--ui-focus-outline);
}

.resume-card .title {
  color: var(--ui-text-primary);
}

.resume-card .desc {
  color: var(--ui-text-secondary);
}

/* 按钮统一样式 */
:deep(.el-button--primary) {
  background: var(--ui-accent);
  border-color: var(--ui-accent);
  color: #fff;
}

:deep(.el-button--primary:hover) {
  filter: brightness(0.96);
}

/* 表格/列表滚动优化 */
.list-wrapper {
  content-visibility: auto;
  contain-intrinsic-size: 600px;
}
.resume-card.selected {
  border-color: #495057;
  box-shadow: none;
}

.resume-title {
  font-size: var(--text-xl);
  font-weight: var(--font-semibold);
  color: #343a40;
  margin: 0 0 var(--spacing-sm) 0;
  line-height: 1.3;
}

.resume-subtitle {
  font-size: var(--text-sm);
  color: #6c757d;
  margin: 0;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  border: 1px solid #ced4da;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: var(--transition-normal);
  color: #6c757d;
}

.action-btn:hover {
  background: #e9ecef;
  color: #343a40;
  border-color: #495057;
  transform: translateY(-1px);
}

.resume-tag {
  background: #e9ecef;
  color: #212529;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-md);
  font-size: var(--text-xs);
  font-weight: var(--font-medium);
  transition: var(--transition-normal);
}

.resume-tag:hover {
  background: #dee2e6;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid #dee2e6;
}

.status-badge {
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-full);
  font-size: var(--text-xs);
  font-weight: var(--font-semibold);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.draft {
  background: #dee2e6;
  color: #495057;
}

.status-badge.completed {
  background: #ced4da;
  color: #343a40;
}

.status-badge.published {
  background: #adb5bd;
  color: #212529;
}

.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: #ffffff;
  border-radius: 16px;
  box-shadow: none;
  border: 1px solid #dee2e6;
}

.empty-icon .el-icon {
  font-size: 64px;
  color: #adb5bd;
}

.empty-state h3 {
  margin: 0 0 12px 0;
  color: #343a40;
  font-size: 20px;
  font-weight: 600;
}

.empty-state p {
  margin: 0 0 24px 0;
  color: #6c757d;
  font-size: 16px;
}

:deep(.el-scrollbar__wrap) {
  scrollbar-width: thin;
  scrollbar-color: #ced4da #e9ecef;
}

:deep(.el-scrollbar__wrap::-webkit-scrollbar-track) {
  background: #e9ecef;
  border-radius: 3px;
}

:deep(.el-scrollbar__wrap::-webkit-scrollbar-thumb) {
  background: #ced4da;
  border-radius: 3px;
}

:deep(.el-scrollbar__wrap::-webkit-scrollbar-thumb:hover) {
  background: #adb5bd;
}
</style>