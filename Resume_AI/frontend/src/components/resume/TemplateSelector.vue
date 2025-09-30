<template>
  <div class="template-selector">
    <div class="selector-header">
      <h4>选择模板样式</h4>
      <el-tooltip content="选择不同的简历模板样式" placement="top">
        <el-icon><QuestionFilled /></el-icon>
      </el-tooltip>
    </div>
    
    <el-select
      v-model="selectedTemplate"
      placeholder="请选择模板样式"
      class="template-select"
      @change="handleTemplateChange"
    >
      <el-option
        v-for="template in templates"
        :key="template.id"
        :label="template.name"
        :value="template.id"
      >
        <div class="option-content">
          <div class="option-preview">
            <div class="mini-thumbnail" :class="`preview-${template.id}`">
              <div class="mini-header"></div>
              <div class="mini-lines">
                <div class="mini-line"></div>
                <div class="mini-line short"></div>
              </div>
            </div>
          </div>
          <div class="option-info">
            <span class="option-name">{{ template.name }}</span>
            <span class="option-desc">{{ template.description }}</span>
          </div>
        </div>
      </el-option>
    </el-select>
  </div>
</template>

<script setup>
/**
 * 简历模板选择器组件
 * 用于在简历编辑时选择不同的模板样式
 */
import { ref, watch, defineEmits, defineProps } from 'vue'
import { QuestionFilled, Check } from '@element-plus/icons-vue'

// Props
const props = defineProps({
  modelValue: {
    type: String,
    default: 'modern'
  }
})

// Emits
const emit = defineEmits(['update:modelValue', 'template-change'])

// 当前选中的模板
const selectedTemplate = ref(props.modelValue)

// 可用的模板列表
const templates = ref([
  {
    id: 'modern',
    name: '现代简约',
    description: '简洁现代的设计风格，适合大多数行业'
  },
  {
    id: 'business',
    name: '专业商务',
    description: '正式专业的商务风格，适合企业职位'
  },
  {
    id: 'creative',
    name: '创意设计',
    description: '富有创意的设计风格，适合设计师和创意工作者'
  }
])

/**
 * 处理模板变化
 * @param {string} templateId - 模板ID
 */
const handleTemplateChange = (templateId) => {
  emit('update:modelValue', templateId)
  emit('template-change', templateId)
}

// 监听props变化
watch(() => props.modelValue, (newValue) => {
  selectedTemplate.value = newValue
})
</script>

<style lang="scss" scoped>
.template-selector {
  .selector-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 12px;
    
    h4 {
      margin: 0;
      font-size: 14px;
      font-weight: 600;
      color: #303133;
    }
    
    .el-icon {
      color: #909399;
      cursor: help;
    }
  }
  
  .template-select {
    width: 100%;
    
    :deep(.el-select__wrapper) {
      border-radius: 8px;
      border: 1px solid #dcdfe6;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #c0c4cc;
      }
      
      &.is-focused {
        border-color: #409eff;
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.1);
      }
    }
  }
}

// 下拉选项样式
:deep(.el-select-dropdown__item) {
  padding: 0 !important;
  height: auto !important;
  
  .option-content {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    gap: 12px;
    
    .option-preview {
      flex-shrink: 0;
      
      .mini-thumbnail {
        width: 32px;
        height: 44px;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        padding: 4px;
        background: white;
        
        .mini-header {
          height: 6px;
          border-radius: 2px;
          margin-bottom: 3px;
        }
        
        .mini-lines {
          .mini-line {
            height: 2px;
            border-radius: 1px;
            margin-bottom: 2px;
            
            &.short {
              width: 60%;
            }
          }
        }
        
        // 不同模板的预览样式
        &.preview-modern {
          .mini-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          
          .mini-line {
            background: #909399;
          }
        }
        
        &.preview-business {
          .mini-header {
            background: #2c3e50;
          }
          
          .mini-line {
            background: #34495e;
          }
        }
        
        &.preview-creative {
          .mini-header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          }
          
          .mini-line {
            background: linear-gradient(90deg, #667eea, #764ba2);
          }
        }
      }
    }
    
    .option-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 2px;
      
      .option-name {
        font-size: 14px;
        font-weight: 600;
        color: #303133;
        line-height: 1.2;
      }
      
      .option-desc {
        font-size: 12px;
        color: #606266;
        line-height: 1.3;
      }
    }
  }
}

// 选中状态样式
:deep(.el-select-dropdown__item.is-selected) {
  .option-content {
    background-color: #f5f7fa;
    
    .option-name {
      color: #409eff;
    }
  }
}

// 悬停状态样式
:deep(.el-select-dropdown__item:hover) {
  background-color: transparent !important;
  
  .option-content {
    background-color: #f5f7fa;
  }
}
</style>