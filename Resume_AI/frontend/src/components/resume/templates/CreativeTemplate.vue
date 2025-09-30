<template>
  <BaseResumeTemplate v-bind="$props">
    <template #default="{ basicInfo, experiences, education, skills, formatDate }">
      <div class="creative-template">
        <div class="a4-paper">
          <!-- 侧边栏 -->
          <div class="sidebar">
            <div class="profile-section">
              <div class="avatar-placeholder">
                <div class="avatar-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
              </div>
              <h1 class="name">{{ basicInfo.name || '姓名' }}</h1>
              <p class="position">{{ basicInfo.position || '职位' }}</p>
            </div>

            <!-- 联系信息 -->
            <div class="contact-section">
              <h3 class="sidebar-title">联系方式</h3>
              <div class="contact-list">
                <div class="contact-item" v-if="basicInfo.phone">
                  <div class="contact-icon">📞</div>
                  <span>{{ basicInfo.phone }}</span>
                </div>
                <div class="contact-item" v-if="basicInfo.email">
                  <div class="contact-icon">✉️</div>
                  <span>{{ basicInfo.email }}</span>
                </div>
              </div>
            </div>

            <!-- 技能 -->
            <div class="skills-section" v-if="skills">
              <h3 class="sidebar-title">专业技能</h3>
              <div class="skills-content">
                <p>{{ skills }}</p>
              </div>
            </div>
          </div>

          <!-- 主内容区 -->
          <div class="main-content">
            <!-- 个人简介 -->
            <div class="intro-section" v-if="basicInfo.introduction">
              <div class="section-header">
                <h2 class="section-title">关于我</h2>
                <div class="title-decoration"></div>
              </div>
              <p class="intro-text">{{ basicInfo.introduction }}</p>
            </div>

            <!-- 工作经历 -->
            <div class="experience-section" v-if="experiences && experiences.length > 0">
              <div class="section-header">
                <h2 class="section-title">工作经历</h2>
                <div class="title-decoration"></div>
              </div>
              <div class="timeline">
                <div v-for="(exp, index) in experiences" :key="index" class="timeline-item">
                  <div class="timeline-marker"></div>
                  <div class="timeline-content">
                    <div class="timeline-header">
                      <h3 class="company">{{ exp.company || '公司名称' }}</h3>
                      <span class="period" v-if="exp.startDate && exp.endDate">
                        {{ formatDate(exp.startDate) }} - {{ formatDate(exp.endDate) }}
                      </span>
                    </div>
                    <p class="role">{{ exp.position || '职位' }}</p>
                    <p class="description" v-if="exp.description">{{ exp.description }}</p>
                  </div>
                </div>
              </div>
            </div>

            <!-- 教育经历 -->
            <div class="education-section" v-if="education && education.length > 0">
              <div class="section-header">
                <h2 class="section-title">教育背景</h2>
                <div class="title-decoration"></div>
              </div>
              <div class="education-grid">
                <div v-for="(edu, index) in education" :key="index" class="education-card">
                  <div class="card-header">
                    <h3 class="school">{{ edu.school || '学校名称' }}</h3>
                    <span class="period" v-if="edu.startDate && edu.endDate">
                      {{ formatDate(edu.startDate) }} - {{ formatDate(edu.endDate) }}
                    </span>
                  </div>
                  <p class="major">{{ edu.major || '专业' }} {{ edu.degree ? '(' + edu.degree + ')' : '' }}</p>
                </div>
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
 * 创意设计师风格简历模板
 * 特点：色彩丰富、布局创新、视觉冲击力强
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
.creative-template {
  display: flex;
  justify-content: center;
  font-family: 'Helvetica Neue', Arial, sans-serif;
  
  .a4-paper {
    width: 210mm;
    height: 297mm;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    display: flex;
    overflow: hidden;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    border-radius: 12px;
    
    // 响应式设计
    @media (max-width: 1200px) {
      width: 100%;
      height: auto;
      min-height: 297mm;
      flex-direction: column;
      border-radius: 0;
    }
    
    @media (max-width: 768px) {
      box-shadow: none;
    }
  }

  // 侧边栏
  .sidebar {
    width: 35%;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    padding: 30px 25px;
    display: flex;
    flex-direction: column;
    gap: 30px;
    
    @media (max-width: 1200px) {
      width: 100%;
      padding: 25px;
    }
    
    .profile-section {
      text-align: center;
      
      .avatar-placeholder {
        width: 100px;
        height: 100px;
        margin: 0 auto 20px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        
        .avatar-icon {
          width: 50px;
          height: 50px;
          color: white;
          
          svg {
            width: 100%;
            height: 100%;
          }
        }
      }
      
      .name {
        font-size: 24px;
        font-weight: 700;
        color: #2d3748;
        margin: 0 0 8px 0;
        letter-spacing: -0.5px;
      }
      
      .position {
        font-size: 14px;
        color: #667eea;
        margin: 0;
        font-weight: 600;
        text-transform: uppercase;
        letter-spacing: 1px;
      }
    }
    
    .sidebar-title {
      font-size: 16px;
      font-weight: 700;
      color: #2d3748;
      margin: 0 0 15px 0;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      position: relative;
      padding-bottom: 8px;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 30px;
        height: 2px;
        background: linear-gradient(90deg, #667eea, #764ba2);
        border-radius: 1px;
      }
    }
    
    .contact-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      
      .contact-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 0;
        
        .contact-icon {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        
        span {
          font-size: 13px;
          color: #4a5568;
          font-weight: 500;
        }
      }
    }
    
    .skills-content {
      p {
        font-size: 13px;
        line-height: 1.6;
        color: #4a5568;
        margin: 0;
      }
    }
  }

  // 主内容区
  .main-content {
    flex: 1;
    padding: 30px;
    background: rgba(255, 255, 255, 0.98);
    backdrop-filter: blur(10px);
    display: flex;
    flex-direction: column;
    gap: 30px;
    
    @media (max-width: 1200px) {
      padding: 25px;
    }
    
    .section-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
      
      .section-title {
        font-size: 20px;
        font-weight: 700;
        color: #2d3748;
        margin: 0;
        white-space: nowrap;
      }
      
      .title-decoration {
        flex: 1;
        height: 3px;
        background: linear-gradient(90deg, #667eea, #764ba2, transparent);
        border-radius: 2px;
      }
    }
  }

  // 个人简介
  .intro-text {
    font-size: 15px;
    line-height: 1.7;
    color: #4a5568;
    margin: 0;
    padding: 20px;
    background: rgba(102, 126, 234, 0.05);
    border-radius: 12px;
    border-left: 4px solid #667eea;
  }

  // 时间线样式
  .timeline {
    position: relative;
    padding-left: 30px;
    
    &::before {
      content: '';
      position: absolute;
      left: 15px;
      top: 0;
      bottom: 0;
      width: 2px;
      background: linear-gradient(180deg, #667eea, #764ba2);
    }
    
    .timeline-item {
      position: relative;
      margin-bottom: 25px;
      
      .timeline-marker {
        position: absolute;
        left: -23px;
        top: 8px;
        width: 16px;
        height: 16px;
        background: linear-gradient(135deg, #667eea, #764ba2);
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255, 0.9);
        box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
      }
      
      .timeline-content {
        background: rgba(255, 255, 255, 0.8);
        padding: 20px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
        border: 1px solid rgba(102, 126, 234, 0.1);
        
        .timeline-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
          
          .company {
            font-size: 18px;
            font-weight: 700;
            color: #2d3748;
            margin: 0;
          }
          
          .period {
            font-size: 12px;
            color: #718096;
            background: rgba(102, 126, 234, 0.1);
            padding: 4px 10px;
            border-radius: 15px;
            font-weight: 600;
            white-space: nowrap;
          }
        }
        
        .role {
          font-size: 14px;
          color: #667eea;
          margin: 0 0 12px 0;
          font-weight: 600;
        }
        
        .description {
          font-size: 14px;
          line-height: 1.6;
          color: #4a5568;
          margin: 0;
        }
      }
    }
  }

  // 教育背景网格
  .education-grid {
    display: grid;
    gap: 15px;
    
    .education-card {
      background: rgba(255, 255, 255, 0.8);
      padding: 20px;
      border-radius: 12px;
      border: 1px solid rgba(118, 75, 162, 0.1);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
      
      .card-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
        
        .school {
          font-size: 16px;
          font-weight: 700;
          color: #2d3748;
          margin: 0;
          flex: 1;
        }
        
        .period {
          font-size: 12px;
          color: #718096;
          background: rgba(118, 75, 162, 0.1);
          padding: 4px 10px;
          border-radius: 15px;
          font-weight: 600;
          white-space: nowrap;
          margin-left: 15px;
        }
      }
      
      .major {
        font-size: 14px;
        color: #764ba2;
        margin: 0;
        font-weight: 600;
      }
    }
  }
}
</style>