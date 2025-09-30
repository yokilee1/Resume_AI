<template>
  <BaseResumeTemplate v-bind="$props">
    <template #default="{ basicInfo, experiences, education, skills, formatDate }">
      <div class="modern-template">
        <div class="a4-paper">
          <!-- 头部区域 -->
          <div class="header-section">
            <div class="name-title">
              <h1 class="name">{{ basicInfo.name || '姓名' }}</h1>
              <p class="position">{{ basicInfo.position || '职位' }}</p>
            </div>
            <div class="contact-info">
              <div class="contact-item" v-if="basicInfo.phone">
                <span class="contact-label">电话</span>
                <span class="contact-value">{{ basicInfo.phone }}</span>
              </div>
              <div class="contact-item" v-if="basicInfo.email">
                <span class="contact-label">邮箱</span>
                <span class="contact-value">{{ basicInfo.email }}</span>
              </div>
            </div>
          </div>

          <!-- 个人简介 -->
          <div class="section" v-if="basicInfo.introduction">
            <h2 class="section-title">个人简介</h2>
            <div class="section-content">
              <p class="introduction">{{ basicInfo.introduction }}</p>
            </div>
          </div>

          <!-- 工作经历 -->
          <div class="section" v-if="experiences && experiences.length > 0">
            <h2 class="section-title">工作经历</h2>
            <div class="section-content">
              <div v-for="(exp, index) in experiences" :key="index" class="experience-item">
                <div class="item-header">
                  <div class="item-title">
                    <h3 class="company">{{ exp.company || '公司名称' }}</h3>
                    <span class="role">{{ exp.position || '职位' }}</span>
                  </div>
                  <div class="item-time">
                    <span v-if="exp.startDate && exp.endDate">
                      {{ formatDate(exp.startDate) }} - {{ formatDate(exp.endDate) }}
                    </span>
                  </div>
                </div>
                <p class="item-description" v-if="exp.description">{{ exp.description }}</p>
              </div>
            </div>
          </div>

          <!-- 教育经历 -->
          <div class="section" v-if="education && education.length > 0">
            <h2 class="section-title">教育经历</h2>
            <div class="section-content">
              <div v-for="(edu, index) in education" :key="index" class="education-item">
                <div class="item-header">
                  <div class="item-title">
                    <h3 class="school">{{ edu.school || '学校名称' }}</h3>
                    <span class="major">{{ edu.major || '专业' }} {{ edu.degree ? '(' + edu.degree + ')' : '' }}</span>
                  </div>
                  <div class="item-time">
                    <span v-if="edu.startDate && edu.endDate">
                      {{ formatDate(edu.startDate) }} - {{ formatDate(edu.endDate) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 专业技能 -->
          <div class="section" v-if="skills">
            <h2 class="section-title">专业技能</h2>
            <div class="section-content">
              <p class="skills-content">{{ skills }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseResumeTemplate>
</template>

<script setup>
/**
 * 现代简约风格简历模板
 * 特点：简洁清爽、线条分明、现代感强
 */
import BaseResumeTemplate from './BaseResumeTemplate.vue';

defineProps({
  resume: {
    type: Object,
    default: () => ({})
  },
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
  }
});
</script>

<style lang="scss" scoped>
.modern-template {
  display: flex;
  justify-content: center;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  
  .a4-paper {
    width: 210mm;
    height: 297mm;
    padding: 25mm;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
    overflow: hidden;
    position: relative;
    
    // 添加微妙的背景纹理
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: 
        radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.03) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.03) 0%, transparent 50%);
      pointer-events: none;
    }
    
    // 响应式设计
    @media (max-width: 1200px) {
      width: 100%;
      height: auto;
      min-height: 297mm;
      padding: 20mm;
      border-radius: 0;
    }
    
    @media (max-width: 768px) {
      padding: 15mm;
      box-shadow: none;
    }
  }

  // 头部区域
  .header-section {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 40px;
    padding-bottom: 30px;
    border-bottom: 3px solid #667eea;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -3px;
      left: 0;
      width: 60px;
      height: 3px;
      background: linear-gradient(90deg, #667eea, #764ba2);
    }
    
    .name-title {
      flex: 1;
      
      .name {
        font-size: 32px;
        font-weight: 700;
        margin: 0 0 8px 0;
        color: #2d3748;
        letter-spacing: -0.5px;
      }
      
      .position {
        font-size: 18px;
        color: #667eea;
        margin: 0;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
    }
    
    .contact-info {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: flex-end;
      
      .contact-item {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .contact-label {
          font-size: 12px;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          font-weight: 600;
          min-width: 40px;
          text-align: right;
        }
        
        .contact-value {
          font-size: 14px;
          color: #2d3748;
          font-weight: 500;
        }
      }
    }
  }

  // 章节样式
  .section {
    margin-bottom: 35px;
    
    .section-title {
      font-size: 20px;
      font-weight: 600;
      color: #2d3748;
      margin: 0 0 20px 0;
      padding-left: 15px;
      position: relative;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      
      &::before {
        content: '';
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-50%);
        width: 4px;
        height: 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 2px;
      }
    }
    
    .section-content {
      padding-left: 15px;
    }
  }

  // 工作经历样式
  .experience-item {
    margin-bottom: 25px;
    padding: 20px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 12px;
    border-left: 4px solid #667eea;
    transition: all 0.3s ease;
    
    &:hover {
      transform: translateX(5px);
      box-shadow: 0 4px 20px rgba(102, 126, 234, 0.1);
    }
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 12px;
      
      .item-title {
        flex: 1;
        
        .company {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: #2d3748;
        }
        
        .role {
          font-size: 14px;
          color: #667eea;
          font-weight: 500;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      }
      
      .item-time {
        flex-shrink: 0;
        margin-left: 20px;
        
        span {
          font-size: 13px;
          color: #718096;
          background: rgba(102, 126, 234, 0.1);
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 500;
        }
      }
    }
    
    .item-description {
      font-size: 14px;
      line-height: 1.7;
      color: #4a5568;
      margin: 0;
    }
  }

  // 教育经历样式
  .education-item {
    margin-bottom: 20px;
    padding: 18px;
    background: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    border-left: 3px solid #764ba2;
    
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      
      .item-title {
        flex: 1;
        
        .school {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 4px 0;
          color: #2d3748;
        }
        
        .major {
          font-size: 14px;
          color: #764ba2;
          font-weight: 500;
        }
      }
      
      .item-time {
        flex-shrink: 0;
        margin-left: 20px;
        
        span {
          font-size: 13px;
          color: #718096;
          background: rgba(118, 75, 162, 0.1);
          padding: 4px 12px;
          border-radius: 20px;
          font-weight: 500;
        }
      }
    }
  }

  // 个人简介和技能样式
  .introduction,
  .skills-content {
    font-size: 15px;
    line-height: 1.8;
    color: #4a5568;
    margin: 0;
    padding: 20px;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 12px;
    border: 1px solid rgba(102, 126, 234, 0.1);
  }
}
</style>