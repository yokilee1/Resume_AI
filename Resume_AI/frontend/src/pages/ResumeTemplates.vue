<template>
  <div class="resume-templates">
    <div class="header">
      <h1>简历模板样式</h1>
      <p>选择适合您的简历模板风格</p>
    </div>

    <div class="template-selector">
      <div class="selector-tabs">
        <button 
          v-for="template in templates" 
          :key="template.id"
          :class="['tab-button', { active: selectedTemplate === template.id }]"
          @click="selectedTemplate = template.id"
        >
          {{ template.name }}
        </button>
      </div>
    </div>

    <div class="template-preview">
      <div class="preview-container">
        <!-- 现代简约风格 -->
        <ModernTemplate 
          v-if="selectedTemplate === 'modern'"
          :resume="sampleResume"
        />
        
        <!-- 专业商务风格 -->
        <BusinessTemplate 
          v-if="selectedTemplate === 'business'"
          :resume="sampleResume"
        />
        
        <!-- 创意设计师风格 -->
        <CreativeTemplate 
          v-if="selectedTemplate === 'creative'"
          :resume="sampleResume"
        />
      </div>
    </div>

    <div class="template-info">
      <div class="info-card">
        <h3>{{ currentTemplate.name }}</h3>
        <p>{{ currentTemplate.description }}</p>
        <div class="features">
          <span v-for="feature in currentTemplate.features" :key="feature" class="feature-tag">
            {{ feature }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 简历模板展示页面
 * 用于展示和测试不同风格的简历模板
 */
import { ref, computed } from 'vue';
import ModernTemplate from '@/components/resume/templates/ModernTemplate.vue';
import BusinessTemplate from '@/components/resume/templates/BusinessTemplate.vue';
import CreativeTemplate from '@/components/resume/templates/CreativeTemplate.vue';

// 当前选中的模板
const selectedTemplate = ref('modern');

// 模板配置
const templates = ref([
  {
    id: 'modern',
    name: '现代简约',
    description: '简洁现代的设计风格，适合大多数行业和职位',
    features: ['简洁布局', '现代设计', '易于阅读', '通用性强']
  },
  {
    id: 'business',
    name: '专业商务',
    description: '正式专业的商务风格，适合传统行业和高级职位',
    features: ['专业正式', '传统布局', '商务风格', '权威感强']
  },
  {
    id: 'creative',
    name: '创意设计',
    description: '富有创意的设计风格，适合设计师和创意行业',
    features: ['创意设计', '色彩丰富', '视觉冲击', '个性突出']
  }
]);

// 当前模板信息
const currentTemplate = computed(() => {
  return templates.value.find(t => t.id === selectedTemplate.value) || templates.value[0];
});

// 示例简历数据
const sampleResume = ref({
  basicInfo: {
    name: '张三',
    position: '前端开发工程师',
    phone: '138-0000-0000',
    email: 'zhangsan@example.com',
    introduction: '具有5年前端开发经验的工程师，熟练掌握Vue.js、React等现代前端框架，有丰富的项目开发和团队协作经验。热爱技术，追求代码质量，善于学习新技术并应用到实际项目中。'
  },
  experiences: [
    {
      company: '阿里巴巴集团',
      position: '高级前端开发工程师',
      startDate: '2021-03-01',
      endDate: '2024-01-01',
      description: '负责电商平台前端开发，参与架构设计和性能优化，带领团队完成多个重要项目。'
    },
    {
      company: '腾讯科技',
      position: '前端开发工程师',
      startDate: '2019-06-01',
      endDate: '2021-02-28',
      description: '参与微信小程序开发，负责用户界面设计和交互优化，提升用户体验。'
    },
    {
      company: '字节跳动',
      position: '初级前端开发工程师',
      startDate: '2018-07-01',
      endDate: '2019-05-31',
      description: '参与今日头条前端开发，学习现代前端技术栈，积累项目开发经验。'
    }
  ],
  education: [
    {
      school: '清华大学',
      major: '计算机科学与技术',
      degree: '本科',
      startDate: '2014-09-01',
      endDate: '2018-06-30'
    },
    {
      school: '北京大学',
      major: '软件工程',
      degree: '硕士',
      startDate: '2018-09-01',
      endDate: '2020-06-30'
    }
  ],
  skills: 'JavaScript, TypeScript, Vue.js, React, Node.js, HTML5, CSS3, Sass, Webpack, Git, Docker, 微信小程序开发, 移动端开发, 性能优化, 团队协作'
});
</script>

<style lang="scss" scoped>
.resume-templates {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 20px;

  .header {
    text-align: center;
    margin-bottom: 30px;
    
    h1 {
      font-size: 32px;
      font-weight: 700;
      color: #343a40;
      margin: 0 0 10px 0;
    }
    
    p {
      font-size: 16px;
      color: #6c757d;
      margin: 0;
    }
  }

  .template-selector {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
    
    .selector-tabs {
      display: flex;
      background: #ffffff;
      border: 1px solid #dee2e6;
      border-radius: 12px;
      padding: 6px;
      box-shadow: none;
      
      .tab-button {
        padding: 12px 24px;
        border: none;
        background: transparent;
        color: #6c757d;
        font-size: 14px;
        font-weight: 600;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          color: #495057;
          background: #e9ecef;
        }
        
        &.active {
          background: #343a40;
          color: #f8f9fa;
          box-shadow: none;
        }
      }
    }
  }

  .template-preview {
    display: flex;
    justify-content: center;
    margin-bottom: 30px;
    
    .preview-container {
      max-width: 100%;
      overflow: auto;
      border-radius: 12px;
      box-shadow: none;
      border: 1px solid #dee2e6;
    }
  }

  .template-info {
    display: flex;
    justify-content: center;
    
    .info-card {
      background: #ffffff;
      padding: 25px;
      border-radius: 12px;
      box-shadow: none;
      border: 1px solid #dee2e6;
      max-width: 500px;
      text-align: center;
      
      h3 {
        font-size: 20px;
        font-weight: 700;
        color: #343a40;
        margin: 0 0 10px 0;
      }
      
      p {
        font-size: 14px;
        color: #6c757d;
        line-height: 1.6;
        margin: 0 0 20px 0;
      }
      
      .features {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        justify-content: center;
        
        .feature-tag {
          background: #e9ecef;
          color: #212529;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
        }
      }
    }
  }

  // 响应式设计保持不变
  @media (max-width: 768px) {
    padding: 15px;
    
    .header h1 {
      font-size: 24px;
    }
    
    .template-selector .selector-tabs {
      flex-direction: column;
      width: 100%;
      max-width: 300px;
      margin: 0 auto;
      
      .tab-button {
        width: 100%;
        text-align: center;
      }
    }
    
    .template-info .info-card {
      margin: 0 10px;
    }
  }
}
</style>