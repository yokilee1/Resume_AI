<template>
  <div class="resume-preview">
    <!-- 动态模板组件 -->
    <component 
      :is="currentTemplateComponent"
      :basic-info="resumeBasicInfo"
      :experiences="resumeExperiences"
      :education="resumeEducation"
      :skills="resumeSkills"
      v-if="currentTemplateComponent"
    />
    
    <!-- 默认模板（兼容旧版本） -->
    <div v-else class="a4-paper">
      <div class="resume-header">
        <h1>{{ resumeBasicInfo.name || '姓名' }}</h1>
        <div class="contact-info">
          <p v-if="resumeBasicInfo.phone">电话: {{ resumeBasicInfo.phone }}</p>
          <p v-if="resumeBasicInfo.email">邮箱: {{ resumeBasicInfo.email }}</p>
          <p v-if="resumeBasicInfo.position">职位: {{ resumeBasicInfo.position }}</p>
        </div>
      </div>
      
      <!-- 个人简介 -->
      <div class="resume-section" v-if="resumeBasicInfo.introduction">
        <h2>个人简介</h2>
        <p class="introduction">{{ resumeBasicInfo.introduction }}</p>
      </div>
      
      <!-- 工作经历 -->
      <div class="resume-section" v-if="resumeExperiences && resumeExperiences.length > 0">
        <h2>工作经历</h2>
        <div v-for="(exp, index) in resumeExperiences" :key="index" class="experience">
          <div class="experience-header">
            <div class="experience-title">
              <h3>{{ exp.company || '公司名称' }}</h3>
              <span class="position">{{ exp.position || '职位' }}</span>
            </div>
            <div class="experience-time">
              <span v-if="exp.startDate && exp.endDate">
                {{ formatDate(exp.startDate) }} - {{ formatDate(exp.endDate) }}
              </span>
            </div>
          </div>
          <p class="experience-description" v-if="exp.description">{{ exp.description }}</p>
        </div>
      </div>
      
      <!-- 教育经历 -->
      <div class="resume-section" v-if="resumeEducation && resumeEducation.length > 0">
        <h2>教育经历</h2>
        <div v-for="(edu, index) in resumeEducation" :key="index" class="education">
          <div class="education-header">
            <div class="education-title">
              <h3>{{ edu.school || '学校名称' }}</h3>
              <span class="major">{{ edu.major || '专业' }} {{ edu.degree ? '(' + edu.degree + ')' : '' }}</span>
            </div>
            <div class="education-time">
              <span v-if="edu.startDate && edu.endDate">
                {{ formatDate(edu.startDate) }} - {{ formatDate(edu.endDate) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 专业技能 -->
      <div class="resume-section" v-if="resumeSkills">
        <h2>专业技能</h2>
        <p class="skills">{{ resumeSkills }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 简历预览组件
 * 用于实时预览简历编辑结果，支持动态模板切换
 */
import { computed } from 'vue'
import ModernTemplate from './templates/ModernTemplate.vue'
import BusinessTemplate from './templates/BusinessTemplate.vue'
import CreativeTemplate from './templates/CreativeTemplate.vue'

const props = defineProps({
  // 支持传入完整的简历对象
  resume: {
    type: Object,
    default: () => ({})
  },
  // 兼容原有的分别传入方式
  basicInfo: {
    type: Object,
    default: () => ({})
  },
  experiences: {
    type: Array,
    default: () => []
  },
  education: {
    type: Array,
    default: () => []
  },
  skills: {
    type: String,
    default: ''
  },
  // 新增：模板选择
  template: {
    type: String,
    default: 'modern',
    validator: (value) => ['modern', 'business', 'creative'].includes(value)
  }
})

// 模板组件映射
const templateComponents = {
  modern: ModernTemplate,
  business: BusinessTemplate,
  creative: CreativeTemplate
}

// 当前模板组件
const currentTemplateComponent = computed(() => {
  return templateComponents[props.template] || null
})

// 计算属性，优先使用resume对象中的数据
const resumeBasicInfo = computed(() => {
  return props.resume?.content?.basicInfo || props.basicInfo || {}
});

const resumeExperiences = computed(() => {
  return props.resume?.content?.experiences || props.experiences || []
});

const resumeEducation = computed(() => {
  return props.resume?.content?.education || props.education || []
});

const resumeSkills = computed(() => {
  return props.resume?.content?.skills || props.skills || ''
});

// 格式化日期
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  
  // 处理 YYYY-MM 格式
  if (dateStr.includes('-') && dateStr.length === 7) {
    return dateStr.replace('-', '.');
  }
  
  // 处理完整日期格式
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
};

// 格式化日期范围（保留兼容性）
const formatDateRange = (dateRange) => {
  if (!dateRange || !dateRange[0] || !dateRange[1]) return '';
  
  const start = new Date(dateRange[0]);
  const end = new Date(dateRange[1]);
  
  return `${start.getFullYear()}.${start.getMonth() + 1} - ${end.getFullYear()}.${end.getMonth() + 1}`;
};
</script>

<style lang="scss" scoped>
.resume-preview {
  display: flex;
  justify-content: center;
  
  .a4-paper {
    box-sizing: border-box;
    width: min(100%, 210mm);
    max-width: 100%;
    height: auto;
    min-height: 297mm;
    padding: clamp(16px, 3vw, 24px);
    background-color: white;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    overflow: auto;
    
    // 响应式设计
    @media (max-width: 1200px) {
      width: 100%;
      height: auto;
      min-height: 297mm;
      padding: 15mm;
    }
    
    @media (max-width: 768px) {
      padding: 10mm;
      box-shadow: none;
      border: 1px solid #e9ecef;
    }
    
    .resume-header {
      margin-bottom: 20px;
      text-align: center;
      
      h1 {
        font-size: 24px;
        margin-bottom: 10px;
      }
      
      .contact-info {
        display: flex;
        justify-content: center;
        gap: 20px;
        
        p {
          margin: 0;
          font-size: 14px;
        }
      }
    }
    
    .resume-section {
      margin-bottom: 20px;
      
      h2 {
        font-size: 18px;
        border-bottom: 1px solid #ddd;
        padding-bottom: 5px;
        margin-bottom: 10px;
      }
      
      .experience {
        margin-bottom: 20px;
        
        .experience-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
          
          .experience-title {
            flex: 1;
            
            h3 {
              font-size: 16px;
              margin: 0 0 4px 0;
              color: #333;
              font-weight: 600;
            }
            
            .position {
              font-size: 14px;
              color: #666;
              font-weight: 500;
            }
          }
          
          .experience-time {
            flex-shrink: 0;
            margin-left: 20px;
            
            span {
              font-size: 14px;
              color: #888;
              white-space: nowrap;
            }
          }
        }
        
        .experience-description {
          font-size: 14px;
          line-height: 1.6;
          margin: 0;
          color: #666;
          margin-top: 8px;
        }
      }
      
      .introduction {
        color: #666;
        line-height: 1.6;
        margin: 0;
      }
      
      .education {
        margin-bottom: 20px;
        
        .education-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
          
          .education-title {
            flex: 1;
            
            h3 {
              font-size: 16px;
              margin: 0 0 4px 0;
              color: #333;
              font-weight: 600;
            }
            
            .major {
              font-size: 14px;
              color: #666;
              font-weight: 500;
            }
          }
          
          .education-time {
            flex-shrink: 0;
            margin-left: 20px;
            
            span {
              font-size: 14px;
              color: #888;
              white-space: nowrap;
            }
          }
        }
      }
      
      .skills {
        color: #666;
        line-height: 1.6;
        margin: 0;
      }
    }
  }
}
</style>