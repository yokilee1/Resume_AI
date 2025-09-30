<template>
  <BaseResumeTemplate v-bind="$props">
    <template #default="{ basicInfo, experiences, education, skills, formatDate }">
      <div class="business-template">
        <div class="a4-paper">
          <!-- 头部区域 -->
          <div class="header-section">
            <div class="header-content">
              <div class="personal-info">
                <h1 class="name">{{ basicInfo.name || '姓名' }}</h1>
                <h2 class="position">{{ basicInfo.position || '职位' }}</h2>
              </div>
              <div class="contact-details">
                <div class="contact-row" v-if="basicInfo.phone">
                  <span class="label">电话：</span>
                  <span class="value">{{ basicInfo.phone }}</span>
                </div>
                <div class="contact-row" v-if="basicInfo.email">
                  <span class="label">邮箱：</span>
                  <span class="value">{{ basicInfo.email }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 个人简介 -->
          <div class="content-section" v-if="basicInfo.introduction">
            <div class="section-header">
              <h3 class="section-title">PROFESSIONAL SUMMARY</h3>
              <div class="section-line"></div>
            </div>
            <div class="section-body">
              <p class="summary-text">{{ basicInfo.introduction }}</p>
            </div>
          </div>

          <!-- 工作经历 -->
          <div class="content-section" v-if="experiences && experiences.length > 0">
            <div class="section-header">
              <h3 class="section-title">PROFESSIONAL EXPERIENCE</h3>
              <div class="section-line"></div>
            </div>
            <div class="section-body">
              <div v-for="(exp, index) in experiences" :key="index" class="experience-entry">
                <div class="entry-header">
                  <div class="entry-main">
                    <h4 class="company-name">{{ exp.company || '公司名称' }}</h4>
                    <p class="job-title">{{ exp.position || '职位' }}</p>
                  </div>
                  <div class="entry-date">
                    <span v-if="exp.startDate && exp.endDate">
                      {{ formatDate(exp.startDate) }} - {{ formatDate(exp.endDate) }}
                    </span>
                  </div>
                </div>
                <div class="entry-description" v-if="exp.description">
                  <p>{{ exp.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 教育经历 -->
          <div class="content-section" v-if="education && education.length > 0">
            <div class="section-header">
              <h3 class="section-title">EDUCATION</h3>
              <div class="section-line"></div>
            </div>
            <div class="section-body">
              <div v-for="(edu, index) in education" :key="index" class="education-entry">
                <div class="entry-header">
                  <div class="entry-main">
                    <h4 class="school-name">{{ edu.school || '学校名称' }}</h4>
                    <p class="degree-info">{{ edu.major || '专业' }} {{ edu.degree ? '- ' + edu.degree : '' }}</p>
                  </div>
                  <div class="entry-date">
                    <span v-if="edu.startDate && edu.endDate">
                      {{ formatDate(edu.startDate) }} - {{ formatDate(edu.endDate) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 专业技能 -->
          <div class="content-section" v-if="skills">
            <div class="section-header">
              <h3 class="section-title">CORE COMPETENCIES</h3>
              <div class="section-line"></div>
            </div>
            <div class="section-body">
              <div class="skills-content">
                <p>{{ skills }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
  </BaseResumeTemplate>
</template>

<script setup>
/**
 * 专业商务风格简历模板
 * 特点：正式严谨、层次分明、商务感强
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
.business-template {
  display: flex;
  justify-content: center;
  font-family: 'Times New Roman', Times, serif;
  
  .a4-paper {
    width: 210mm;
    height: 297mm;
    padding: 20mm;
    background: #ffffff;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    border: 1px solid #e2e8f0;
    overflow: hidden;
    
    // 响应式设计
    @media (max-width: 1200px) {
      width: 100%;
      height: auto;
      min-height: 297mm;
      padding: 18mm;
    }
    
    @media (max-width: 768px) {
      padding: 15mm;
      box-shadow: none;
      border: 1px solid #e2e8f0;
    }
  }

  // 头部区域
  .header-section {
    margin-bottom: 30px;
    padding-bottom: 25px;
    border-bottom: 2px solid #1a202c;
    
    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      
      .personal-info {
        flex: 1;
        
        .name {
          font-size: 28px;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 8px 0;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        
        .position {
          font-size: 16px;
          color: #4a5568;
          margin: 0;
          font-weight: 400;
          text-transform: uppercase;
          letter-spacing: 2px;
        }
      }
      
      .contact-details {
        display: flex;
        flex-direction: column;
        gap: 6px;
        align-items: flex-end;
        
        .contact-row {
          display: flex;
          align-items: center;
          
          .label {
            font-size: 12px;
            color: #718096;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            margin-right: 8px;
            min-width: 40px;
          }
          
          .value {
            font-size: 14px;
            color: #1a202c;
            font-weight: 500;
          }
        }
      }
    }
  }

  // 内容章节
  .content-section {
    margin-bottom: 28px;
    
    .section-header {
      margin-bottom: 18px;
      display: flex;
      align-items: center;
      gap: 15px;
      
      .section-title {
        font-size: 14px;
        font-weight: 700;
        color: #1a202c;
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        white-space: nowrap;
      }
      
      .section-line {
        flex: 1;
        height: 1px;
        background: #cbd5e0;
      }
    }
    
    .section-body {
      padding-left: 0;
    }
  }

  // 工作经历样式
  .experience-entry {
    margin-bottom: 22px;
    padding-bottom: 18px;
    border-bottom: 1px solid #e2e8f0;
    
    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
    
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 10px;
      
      .entry-main {
        flex: 1;
        
        .company-name {
          font-size: 16px;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 4px 0;
        }
        
        .job-title {
          font-size: 14px;
          color: #4a5568;
          margin: 0;
          font-style: italic;
          font-weight: 500;
        }
      }
      
      .entry-date {
        flex-shrink: 0;
        margin-left: 20px;
        
        span {
          font-size: 12px;
          color: #718096;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      }
    }
    
    .entry-description {
      p {
        font-size: 13px;
        line-height: 1.6;
        color: #2d3748;
        margin: 0;
        text-align: justify;
      }
    }
  }

  // 教育经历样式
  .education-entry {
    margin-bottom: 18px;
    padding-bottom: 15px;
    border-bottom: 1px solid #f7fafc;
    
    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
    }
    
    .entry-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      
      .entry-main {
        flex: 1;
        
        .school-name {
          font-size: 15px;
          font-weight: 700;
          color: #1a202c;
          margin: 0 0 4px 0;
        }
        
        .degree-info {
          font-size: 13px;
          color: #4a5568;
          margin: 0;
          font-weight: 500;
        }
      }
      
      .entry-date {
        flex-shrink: 0;
        margin-left: 20px;
        
        span {
          font-size: 12px;
          color: #718096;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      }
    }
  }

  // 个人简介和技能样式
  .summary-text,
  .skills-content p {
    font-size: 13px;
    line-height: 1.7;
    color: #2d3748;
    margin: 0;
    text-align: justify;
    text-indent: 2em;
  }
  
  .skills-content p {
    text-indent: 0;
  }
}
</style>