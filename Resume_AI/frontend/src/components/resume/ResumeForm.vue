<template>
  <div class="resume-form-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="title-section">
          <h1 class="page-title">
            <el-icon><component :is="isEditMode ? EditPen : DocumentAdd" /></el-icon>
            {{ isEditMode ? '编辑简历' : '创建简历' }}
          </h1>
          <p v-if="isEditMode" class="page-subtitle">{{ resumeData.name || '未命名简历' }}</p>
        </div>
        <div class="header-actions">
          <el-button @click="handleBack" icon="ArrowLeft">返回</el-button>
          <el-button 
            type="primary" 
            @click="handleSave" 
            icon="Check" 
            :loading="saving"
          >
            {{ isEditMode ? '保存简历' : '创建简历' }}
          </el-button>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>

    <!-- 编辑内容 -->
    <div v-else-if="resumeData" class="edit-container">
      <div class="resume-container">
        <!-- 简历预览 -->
        <div class="preview-section">
          <div class="preview-header">
            <h3>预览</h3>
            <el-button size="small" @click="togglePreview" :icon="previewVisible ? 'Hide' : 'View'">
              {{ previewVisible ? '隐藏预览' : '显示预览' }}
            </el-button>
          </div>
          
          <!-- 模板选择器 -->
          <div v-show="previewVisible" class="template-selector-wrapper">
            <TemplateSelector 
              v-model="selectedTemplate"
              @template-change="handleTemplateChange"
            />
          </div>
          
          <div v-show="previewVisible" class="preview-content">
            <ResumePreview 
              :resume="resumeData"
              :basic-info="resumeData.content?.basicInfo" 
              :experiences="resumeData.content?.experiences"
              :education="resumeData.content?.education"
              :skills="resumeData.content?.skills"
              :template="selectedTemplate"
            />
          </div>
        </div>

        <!-- 简历编辑器 -->
        <div class="editor-section">
          <ResumeEditor 
            ref="resumeEditor"
            v-model:basicInfo="resumeData.content.basicInfo"
            v-model:experiences="resumeData.content.experiences"
            v-model:education="resumeData.content.education"
            v-model:skills="resumeData.content.skills"
            @ai-polish="handleAIPolish"
            @ai-evaluate="handleAIEvaluate" 
          />
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else class="error-container">
      <el-result
        icon="error"
        title="加载失败"
        sub-title="无法加载简历数据，请检查网络连接或稍后重试"
      >
        <template #extra>
          <el-button type="primary" @click="loadResumeData">重新加载</el-button>
          <el-button @click="handleBack">返回列表</el-button>
        </template>
      </el-result>
    </div>
  </div>
</template>

<script setup>
/**
 * 通用简历表单组件
 * 支持创建和编辑两种模式
 */
import { ref, onMounted, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { EditPen, ArrowLeft, Check, Hide, View, DocumentAdd } from '@element-plus/icons-vue'
import ResumeEditor from './ResumeEditor.vue'
import ResumePreview from './ResumePreview.vue'
import TemplateSelector from './TemplateSelector.vue'
import { useResumeStore } from '@/stores/resumeStore'

// Props
const props = defineProps({
  mode: {
    type: String,
    default: 'create', // 'create' 或 'edit'
    validator: (value) => ['create', 'edit'].includes(value)
  },
  resumeId: {
    type: [String, Number],
    default: null
  }
})

// Emits
const emit = defineEmits(['save-success', 'back'])

const route = useRoute()
const router = useRouter()
const resumeStore = useResumeStore()

// 计算属性
const isEditMode = computed(() => props.mode === 'edit')

// 响应式数据
const loading = ref(false)
const saving = ref(false)
const previewVisible = ref(true)
const resumeEditor = ref(null)
const selectedTemplate = ref('modern') // 默认选择现代简约模板

// 简历数据
const resumeData = ref({
  id: null,
  name: '',
  content: {
    basicInfo: {
      name: '',
      age: '',
      phone: '',
      email: '',
      introduction: ''
    },
    experiences: [{
      company: '',
      position: '',
      timeRange: '',
      description: ''
    }],
    education: [{
      school: '',
      major: '',
      degree: '',
      timeRange: ''
    }],
    skills: ''
  }
})

/**
 * 初始化数据
 */
const initializeData = () => {
  if (isEditMode.value) {
    loadResumeData()
  } else {
    // 创建模式，使用默认空数据
    loading.value = false
  }
}

/**
 * 加载简历数据（编辑模式）
 */
const loadResumeData = async () => {
  try {
    loading.value = true
    const resumeId = props.resumeId || route.params.id
    
    if (!resumeId) {
      ElMessage.error('简历ID不存在')
      handleBack()
      return
    }

    // 从store中获取简历数据
    const resume = resumeStore.getResumeById(resumeId)
    
    if (!resume) {
      ElMessage.error('简历不存在')
      handleBack()
      return
    }

    // 设置简历数据，确保content结构完整
    resumeData.value.id = resume.id
    resumeData.value.name = resume.name || ''
    
    // 安全地更新content
    if (resume.content) {
      Object.assign(resumeData.value.content.basicInfo, resume.content.basicInfo || {})
      resumeData.value.content.experiences = resume.content.experiences || [{
        company: '',
        position: '',
        timeRange: '',
        description: ''
      }]
      resumeData.value.content.education = resume.content.education || [{
        school: '',
        major: '',
        degree: '',
        timeRange: ''
      }]
      resumeData.value.content.skills = resume.content.skills || ''
    }
    
  } catch (error) {
    console.error('加载简历失败:', error)
    ElMessage.error('加载简历失败')
  } finally {
    loading.value = false
  }
}

/**
 * 保存简历
 */
const handleSave = async () => {
  try {
    saving.value = true
    
    // 更新简历名称（如果基本信息中有姓名）
    if (resumeData.value.content.basicInfo.name) {
      resumeData.value.name = `${resumeData.value.content.basicInfo.name}的简历`
    }
    
    let result
    if (isEditMode.value) {
      // 编辑模式：更新现有简历
      result = await resumeStore.updateResume(resumeData.value.id, resumeData.value)
      ElMessage.success('简历保存成功')
    } else {
      // 创建模式：创建新简历
      result = await resumeStore.createResume(resumeData.value)
      ElMessage.success('简历创建成功')
      // 创建成功后可以跳转到编辑模式
      router.push(`/resume/edit/${result.id}`)
    }
    
    emit('save-success', result)
    
  } catch (error) {
    console.error('保存简历失败:', error)
    ElMessage.error(isEditMode.value ? '保存简历失败' : '创建简历失败')
  } finally {
    saving.value = false
  }
}

/**
 * 返回上一页
 */
const handleBack = async () => {
  // 检查是否有未保存的更改
  const hasChanges = checkForChanges()
  
  if (hasChanges) {
    try {
      await ElMessageBox.confirm(
        '您有未保存的更改，确定要离开吗？',
        '确认离开',
        {
          confirmButtonText: '保存并离开',
          cancelButtonText: '直接离开',
          distinguishCancelAndClose: true,
          type: 'warning'
        }
      )
      
      // 用户选择保存并离开
      await handleSave()
      navigateBack()
      
    } catch (action) {
      if (action === 'cancel') {
        // 用户选择直接离开
        navigateBack()
      }
      // 用户选择取消，不做任何操作
    }
  } else {
    navigateBack()
  }
}

/**
 * 导航返回
 */
const navigateBack = () => {
  emit('back')
  router.push('/resume-management')
}

/**
 * 检查是否有未保存的更改
 * @returns {boolean} 是否有更改
 */
const checkForChanges = () => {
  // 这里可以实现更复杂的变更检测逻辑
  // 暂时返回false，表示没有未保存的更改
  return false
}

/**
 * 切换预览显示/隐藏
 */
const togglePreview = () => {
  previewVisible.value = !previewVisible.value
}

/**
 * 处理模板切换
 * @param {string} templateId - 新选择的模板ID
 */
const handleTemplateChange = (templateId) => {
  console.log('切换到模板:', templateId)
  // 这里可以添加额外的逻辑，比如保存用户的模板偏好
}

/**
 * AI润色功能
 */
const handleAIPolish = () => {
  ElMessage.info('AI润色功能开发中...')
}

/**
 * AI评估功能
 */
const handleAIEvaluate = () => {
  ElMessage.info('AI评估功能开发中...')
}

// 监听简历数据变化，自动保存（可选）
// watch(
//   () => resumeData.value.content,
//   () => {
//     // 可以在这里实现自动保存功能
//   },
//   { deep: true }
// )

// 组件挂载时初始化数据
onMounted(() => {
  initializeData()
})

// 暴露方法给父组件
defineExpose({
  save: handleSave,
  loadData: loadResumeData
})
</script>

<style lang="scss" scoped>
.resume-form-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
}

/* 页面头部 */
.page-header {
  background: white;
  border-bottom: 1px solid #e5e7eb;
  padding: 20px 0;
  margin-bottom: 24px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
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
  font-size: 28px;
  font-weight: 700;
}

.page-title .el-icon {
  font-size: 32px;
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

/* 加载和错误状态 */
.loading-container,
.error-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 24px;
}

/* 编辑容器 */
.edit-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px 40px;
}

.resume-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: start;
}

/* 预览区域 */
.preview-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  position: sticky;
  top: 120px;
  max-height: calc(100vh - 140px);
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid #e5e7eb;
  background: #f9fafb;

  h3 {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: #374151;
  }
}

.template-selector-wrapper {
  margin-bottom: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.preview-content {
  padding: 20px;
  overflow-y: auto;
  max-height: calc(100vh - 200px);
}

/* 编辑器区域 */
.editor-section {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  padding: 20px;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .resume-container {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .preview-section {
    position: static;
    max-height: none;
  }

  .preview-content {
    max-height: 400px;
  }
}

@media (max-width: 768px) {
  .page-header {
    padding: 16px 0;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
    padding: 0 16px;
  }

  .header-actions {
    justify-content: stretch;
  }

  .header-actions .el-button {
    flex: 1;
  }

  .page-title {
    font-size: 24px;
  }

  .page-title .el-icon {
    font-size: 28px;
  }

  .edit-container {
    padding: 0 16px 24px;
  }

  .resume-container {
    gap: 16px;
  }

  .preview-section,
  .editor-section {
    padding: 16px;
  }
}

/* 滚动条样式 */
.preview-content::-webkit-scrollbar {
  width: 6px;
}

.preview-content::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.preview-content::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.preview-content::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}
</style>