<template>
  <div class="resume-card" :class="{ selected: isSelected }">
    <!-- 简历头部信息 -->
    <div class="resume-header">
      <div class="resume-info">
        <h3 class="resume-title">{{ resume.name || '未命名简历' }}</h3>
        <div class="resume-meta">
          <span class="create-time">
            <el-icon><Calendar /></el-icon>
            创建于 {{ formatDate(resume.createTime) }}
          </span>
          <span class="update-time">
            <el-icon><Edit /></el-icon>
            更新于 {{ formatDate(resume.updateTime) }}
          </span>
        </div>
      </div>
      <div class="resume-status">
        <el-tag :type="getStatusType(resume.status)" size="small">
          {{ getStatusText(resume.status) }}
        </el-tag>
      </div>
    </div>

    <!-- 简历预览信息 -->
    <div class="resume-preview" v-if="resume.content && resume.content.basicInfo">
      <div class="basic-info">
        <span class="name">{{ resume.content.basicInfo.name || '姓名未填写' }}</span>
        <span class="position" v-if="resume.content.basicInfo.position">
          {{ resume.content.basicInfo.position }}
        </span>
      </div>
      <div class="stats">
        <div class="stat-item">
          <span class="stat-label">工作经历</span>
          <span class="stat-value">{{ getExperienceCount() }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">教育背景</span>
          <span class="stat-value">{{ getEducationCount() }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">技能数量</span>
          <span class="stat-value">{{ getSkillsCount() }}</span>
        </div>
      </div>
    </div>

    <!-- 操作按钮 -->
    <div class="resume-actions">
      <el-button 
        type="primary" 
        size="small" 
        :icon="Edit"
        @click="handleEdit"
      >
        编辑
      </el-button>
      <el-button 
        size="small" 
        :icon="View"
        @click="handlePreview"
      >
        预览
      </el-button>
      <el-button 
        size="small" 
        :icon="Download"
        @click="handleDownload"
      >
        下载
      </el-button>
      <el-dropdown @command="handleCommand" trigger="click">
        <el-button size="small" :icon="MoreFilled" circle />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="duplicate">
              <el-icon><CopyDocument /></el-icon>
              复制简历
            </el-dropdown-item>
            <el-dropdown-item command="rename">
              <el-icon><EditPen /></el-icon>
              重命名
            </el-dropdown-item>
            <el-dropdown-item command="delete" divided>
              <el-icon><Delete /></el-icon>
              删除简历
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

    <!-- 选择框 -->
    <div class="resume-checkbox" v-if="showCheckbox">
      <el-checkbox 
        :model-value="isSelected" 
        @change="handleSelect"
        @click.stop
      />
    </div>
  </div>
</template>

<script setup>
/**
 * 简历卡片组件
 * 用于展示简历信息，提供编辑、预览、下载等操作
 */
import { computed } from 'vue';
import { 
  Calendar, 
  Edit, 
  View, 
  Download, 
  MoreFilled, 
  CopyDocument, 
  EditPen, 
  Delete 
} from '@element-plus/icons-vue';

// 组件属性
const props = defineProps({
  resume: {
    type: Object,
    required: true,
    default: () => ({
      id: null,
      name: '',
      createTime: '',
      updateTime: '',
      status: 'draft',
      content: null
    })
  },
  isSelected: {
    type: Boolean,
    default: false
  },
  showCheckbox: {
    type: Boolean,
    default: false
  }
});

// 组件事件
const emit = defineEmits([
  'edit', 
  'preview', 
  'download', 
  'delete', 
  'duplicate', 
  'rename', 
  'select'
]);

/**
 * 格式化日期显示
 * @param {string} dateString - 日期字符串
 * @returns {string} 格式化后的日期
 */
const formatDate = (dateString) => {
  if (!dateString) return '未知';
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * 获取状态类型
 * @param {string} status - 简历状态
 * @returns {string} Element Plus tag类型
 */
const getStatusType = (status) => {
  const statusMap = {
    draft: '',
    completed: 'success',
    published: 'warning'
  };
  return statusMap[status] || '';
};

/**
 * 获取状态文本
 * @param {string} status - 简历状态
 * @returns {string} 状态显示文本
 */
const getStatusText = (status) => {
  const statusMap = {
    draft: '草稿',
    completed: '已完成',
    published: '已发布'
  };
  return statusMap[status] || '草稿';
};

/**
 * 获取工作经历数量
 * @returns {number} 工作经历数量
 */
const getExperienceCount = () => {
  if (!props.resume.content || !props.resume.content.experiences) return 0;
  return props.resume.content.experiences.filter(exp => exp.company || exp.position).length;
};

/**
 * 获取教育背景数量
 * @returns {number} 教育背景数量
 */
const getEducationCount = () => {
  if (!props.resume.content || !props.resume.content.education) return 0;
  return props.resume.content.education.filter(edu => edu.school || edu.major).length;
};

/**
 * 获取技能数量
 * @returns {number} 技能数量
 */
const getSkillsCount = () => {
  if (!props.resume.content || !props.resume.content.skills) return 0;
  if (Array.isArray(props.resume.content.skills)) {
    return props.resume.content.skills.length;
  }
  if (typeof props.resume.content.skills === 'string') {
    return props.resume.content.skills.split(',').filter(skill => skill.trim()).length;
  }
  return 0;
};

// 事件处理函数
const handleEdit = () => {
  emit('edit', props.resume);
};

const handlePreview = () => {
  emit('preview', props.resume);
};

const handleDownload = () => {
  emit('download', props.resume);
};

const handleSelect = (value) => {
  emit('select', props.resume, value);
};

const handleCommand = (command) => {
  switch (command) {
    case 'duplicate':
      emit('duplicate', props.resume);
      break;
    case 'rename':
      emit('rename', props.resume);
      break;
    case 'delete':
      emit('delete', props.resume);
      break;
  }
};
</script>

<style lang="scss" scoped>
.resume-card {
  position: relative;
  background: white;
  border-radius: 12px;
  border: 2px solid #e9ecef;
  padding: 20px;
  transition: all 0.3s ease;
  cursor: pointer;
  overflow: hidden;

  &:hover {
    border-color: #409eff;
    box-shadow: 0 8px 25px rgba(64, 158, 255, 0.15);
    transform: translateY(-2px);
  }

  &.selected {
    border-color: #409eff;
    background: #f0f8ff;
    box-shadow: 0 4px 15px rgba(64, 158, 255, 0.2);
  }

  .resume-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 16px;

    .resume-info {
      flex: 1;

      .resume-title {
        font-size: 18px;
        font-weight: 600;
        color: #2c3e50;
        margin: 0 0 8px 0;
        line-height: 1.4;
      }

      .resume-meta {
        display: flex;
        flex-direction: column;
        gap: 4px;
        font-size: 12px;
        color: #6c757d;

        span {
          display: flex;
          align-items: center;
          gap: 4px;

          .el-icon {
            font-size: 12px;
          }
        }
      }
    }

    .resume-status {
      flex-shrink: 0;
    }
  }

  .resume-preview {
    margin-bottom: 16px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 8px;

    .basic-info {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;

      .name {
        font-weight: 600;
        color: #2c3e50;
      }

      .position {
        font-size: 14px;
        color: #6c757d;
        padding: 2px 8px;
        background: white;
        border-radius: 4px;
      }
    }

    .stats {
      display: flex;
      justify-content: space-between;
      gap: 12px;

      .stat-item {
        text-align: center;
        flex: 1;

        .stat-label {
          display: block;
          font-size: 12px;
          color: #6c757d;
          margin-bottom: 2px;
        }

        .stat-value {
          display: block;
          font-size: 16px;
          font-weight: 600;
          color: #409eff;
        }
      }
    }
  }

  .resume-actions {
    display: flex;
    gap: 8px;
    align-items: center;

    .el-button {
      flex: 1;
      
      &:last-child {
        flex: none;
      }
    }
  }

  .resume-checkbox {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;

    .el-checkbox {
      background: white;
      border-radius: 4px;
      padding: 4px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .resume-card {
    padding: 16px;

    .resume-header {
      .resume-info {
        .resume-title {
          font-size: 16px;
        }

        .resume-meta {
          font-size: 11px;
        }
      }
    }

    .resume-preview {
      .stats {
        flex-direction: column;
        gap: 8px;

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          text-align: left;

          .stat-label,
          .stat-value {
            display: inline;
          }
        }
      }
    }

    .resume-actions {
      flex-wrap: wrap;
      gap: 6px;

      .el-button {
        flex: none;
        min-width: 70px;
      }
    }
  }
}
</style>