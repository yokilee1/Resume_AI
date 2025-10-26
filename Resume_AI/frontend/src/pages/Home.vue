<template>
  <div class="home-page">
    <!-- 英雄区域 -->
    <section class="hero-section">
      <div class="hero-background">
        <div class="wisdom-pattern"></div>
        <div class="floating-elements">
          <div class="element element-1">智</div>
          <div class="element element-2">慧</div>
          <div class="element element-3">简</div>
          <div class="element element-4">历</div>
        </div>
      </div>
      
      <div class="hero-content">
        <div class="hero-text">
          <div class="wisdom-badge">
            <span class="badge-icon">智</span>
            <span class="badge-text">AI 智慧简历</span>
          </div>
          
          <h1 class="hero-title">
            <span class="title-main">Resume AI</span>
            <span class="title-sub">智能简历助手</span>
          </h1>
          
          <p class="hero-subtitle">
            融合东方智慧与现代科技，为您打造独一无二的职业名片
            <br>
            让每一份简历都成为通往成功的金钥匙
          </p>
          
          <div class="hero-actions">
            <el-button type="primary" size="large" @click="navigateToCreate" class="primary-btn">
              <el-icon><Star /></el-icon>
              开始智能创建
            </el-button>
            <el-button size="large" @click="navigateToResumes" class="secondary-btn">
              <el-icon><Document /></el-icon>
              查看我的简历
            </el-button>
          </div>
          
          <div class="hero-stats">
            <div class="stat-item">
              <span class="stat-number">10,000+</span>
              <span class="stat-label">成功案例</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">98%</span>
              <span class="stat-label">满意度</span>
            </div>
            <div class="stat-divider"></div>
            <div class="stat-item">
              <span class="stat-number">24/7</span>
              <span class="stat-label">智能服务</span>
            </div>
          </div>
        </div>
        
        <div class="hero-visual">
          <div class="wisdom-circle">
            <div class="inner-circle">
              <div class="center-symbol">履</div>
            </div>
            <div class="orbit-elements">
              <div class="orbit-item orbit-1">
                <el-icon><User /></el-icon>
                <span>个人信息</span>
              </div>
              <div class="orbit-item orbit-2">
                <el-icon><Edit /></el-icon>
                <span>AI润色</span>
              </div>
              <div class="orbit-item orbit-3">
                <el-icon><TrendCharts /></el-icon>
                <span>竞争力分析</span>
              </div>
              <div class="orbit-item orbit-4">
                <el-icon><Star /></el-icon>
                <span>AI 优化</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 功能特色区域 -->
    <div class="features-section">
      <div class="section-header">
        <h2>核心功能</h2>
        <p>全方位提升您的简历质量</p>
      </div>
      <div class="features-grid">
        <div class="feature-card">
          <div class="feature-icon">
            <el-icon><Edit /></el-icon>
          </div>
          <h3>AI智能润色</h3>
          <p>基于大数据分析，智能优化简历内容表达，提升专业度和吸引力</p>
          <div class="feature-tags">
            <el-tag size="small">内容优化</el-tag>
            <el-tag size="small">语言润色</el-tag>
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <el-icon><PieChart /></el-icon>
          </div>
          <h3>智能评估分析</h3>
          <p>深度分析简历优缺点，提供针对性改进建议，让您的简历脱颖而出</p>
          <div class="feature-tags">
            <el-tag size="small">优势分析</el-tag>
            <el-tag size="small">改进建议</el-tag>
          </div>
        </div>
        <div class="feature-card">
          <div class="feature-icon">
            <el-icon><TrendCharts /></el-icon>
          </div>
          <h3>竞争力匹配</h3>
          <p>精准评估简历与目标职位的匹配度，提高面试邀请率</p>
          <div class="feature-tags">
            <el-tag size="small">职位匹配</el-tag>
            <el-tag size="small">竞争分析</el-tag>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 首页组件
 * 展示应用主要功能并提供导航入口
 */
import { useRouter } from 'vue-router';
import {
  ElButton,
  ElCard,
  ElIcon,
  ElTag
} from 'element-plus';
import {
  DocumentAdd,
  Document,
  User,
  Edit,
  TrendCharts,
  PieChart,
  Star
} from '@element-plus/icons-vue';

const router = useRouter();

/**
 * 导航到创建简历页面
 */
const navigateToCreate = () => {
  router.push('/create-resume');
};

/**
 * 导航到简历列表页面
 */
const navigateToResumes = () => {
  router.push('/resumes');
};
</script>

<style lang="scss" scoped>
.home-page {
  min-height: calc(100vh - 80px);
  background: #212529;
  position: relative;
  overflow: hidden;

  // 英雄区域
  .hero-section {
    padding: 80px 40px;
    position: relative;
    
    .hero-background {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 1;
    }

    .wisdom-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: #212529;
      animation: none;
    }

    .floating-elements {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;

      .element {
        position: absolute;
        font-size: 4rem;
        font-weight: 300;
        color: #343a40;
        animation: floatWisdom 12s ease-in-out infinite;
        font-family: 'PingFang SC', 'Hiragino Sans GB', sans-serif;

        &.element-1 {
          top: 15%;
          left: 10%;
          animation-delay: 0s;
        }

        &.element-2 {
          top: 25%;
          right: 15%;
          animation-delay: 3s;
        }

        &.element-3 {
          bottom: 30%;
          left: 15%;
          animation-delay: 6s;
        }

        &.element-4 {
          bottom: 20%;
          right: 10%;
          animation-delay: 9s;
        }
      }
    }

    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
      position: relative;
      z-index: 2;
    }

    .hero-text {
      .wisdom-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: #dee2e6;
        color: #212529;
        padding: 0.5rem 1rem;
        border-radius: 50px;
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 2rem;
        box-shadow: none;

        .badge-icon {
          font-size: 1.2rem;
          font-weight: 700;
        }
      }

      .hero-title {
        margin-bottom: 24px;
        line-height: 1.2;

        .title-main {
          display: block;
          font-size: 3.5rem;
          font-weight: 700;
          color: #e9ecef;
          margin-bottom: 0.5rem;
          text-shadow: none;
        }

        .title-sub {
          display: block;
          font-size: 1.5rem;
          font-weight: 400;
          color: #adb5bd;
          margin-left: 0.5rem;
        }
      }

      .hero-subtitle {
        font-size: 1.25rem;
        line-height: 1.6;
        color: #ced4da;
        margin-bottom: 40px;
        max-width: 500px;
      }

      .hero-actions {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;
        margin-bottom: 3rem;

        .primary-btn {
          background: #e9ecef;
          border: 1px solid #dee2e6;
          color: #212529;
          padding: 16px 32px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 12px;
          box-shadow: none;
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;

          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: none;
            transition: left 0.5s;
          }

          &:hover::before {
            left: 100%;
          }

          &:hover {
            transform: translateY(-2px);
            box-shadow: none;
          }
        }

        .secondary-btn {
          background: #343a40;
          border: 2px solid #495057;
          color: #f8f9fa;
          padding: 14px 30px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 12px;
          backdrop-filter: none;
          transition: all 0.3s ease;

          &:hover {
            background: #495057;
            border-color: #495057;
            transform: translateY(-2px);
          }
        }
      }

      .hero-stats {
        display: flex;
        align-items: center;
        gap: 2rem;

        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.25rem;

          .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: #e9ecef;
          }

          .stat-label {
            font-size: 0.875rem;
            color: #6c757d;
            font-weight: 500;
          }
        }

        .stat-divider {
          width: 1px;
          height: 3rem;
          background: #495057;
        }
      }
    }

    .hero-visual {
      display: flex;
      justify-content: center;
      align-items: center;

      .wisdom-circle {
        position: relative;
        width: 400px;
        height: 400px;
        display: flex;
        align-items: center;
        justify-content: center;

        .inner-circle {
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: #343a40;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: none;
          position: relative;
          z-index: 2;
          animation: wisdomRotate 20s linear infinite;

          .center-symbol {
            font-size: 4rem;
            font-weight: 300;
            color: #ced4da;
            font-family: 'PingFang SC', 'Hiragino Sans GB', sans-serif;
            text-shadow: none;
          }
        }

        .orbit-elements {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;

          .orbit-item {
              position: absolute;
              background: #343a40;
              backdrop-filter: none;
              border: 1px solid #495057;
              border-radius: 20px;
              padding: 1.5rem;
              display: flex;
              flex-direction: column;
              align-items: center;
              gap: 0.5rem;
              color: #f8f9fa;
              font-weight: 600;
              font-size: 0.875rem;
              animation: orbitFloat 8s ease-in-out infinite;
              transition: all 0.3s ease;
              min-width: 100px;

              &:hover {
                transform: scale(1.1);
                background: #495057;
                box-shadow: none;
              }

              .el-icon {
                font-size: 1.5rem;
                color: #adb5bd;
              }

            &.orbit-1 {
              top: 0;
              left: 50%;
              transform: translateX(-50%);
              animation-delay: 0s;
            }

            &.orbit-2 {
              top: 50%;
              right: 0;
              transform: translateY(-50%);
              animation-delay: 2s;
            }

            &.orbit-3 {
              bottom: 0;
              left: 50%;
              transform: translateX(-50%);
              animation-delay: 4s;
            }

            &.orbit-4 {
              top: 50%;
              left: 0;
              transform: translateY(-50%);
              animation-delay: 6s;
            }
          }
        }
      }
    }
  }

  // 功能特色区域
  .features-section {
    background: #f8f9fa;
    padding: 120px 40px;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: none;
      z-index: 1;
    }

    .section-header {
      text-align: center;
      margin-bottom: 80px;
      position: relative;
      z-index: 2;

      h2 {
        font-size: 3rem;
        font-weight: 700;
        color: #343a40;
        margin-bottom: 24px;
        text-shadow: none;
      }

      p {
        font-size: 1.25rem;
        color: #6c757d;
        max-width: 700px;
        margin: 0 auto;
        line-height: 1.8;
      }
    }

    .features-grid {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
      gap: 50px;
      position: relative;
      z-index: 2;
    }

    .feature-card {
      background: #f8f9fa;
      backdrop-filter: none;
      border-radius: 24px;
      padding: 50px 40px;
      text-align: center;
      box-shadow: none;
      border: 1px solid #dee2e6;
      transition: all 0.4s ease;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: none;
        opacity: 0;
        transition: opacity 0.4s ease;
        z-index: -1;
      }

      &:hover {
        transform: translateY(-12px);
        box-shadow: none;
        border-color: #dee2e6;
      }

      &:hover::before {
        opacity: 1;
      }

      .feature-icon {
        width: 90px;
        height: 90px;
        margin: 0 auto 30px;
        background: #dee2e6;
        border-radius: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #343a40;
        box-shadow: none;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          top: -3px;
          left: -3px;
          right: -3px;
          bottom: -3px;
          background: none;
          border-radius: 25px;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .el-icon {
          font-size: 36px;
        }
      }

      &:hover .feature-icon::after {
        opacity: 1;
      }

      h3 {
        font-size: 1.6rem;
        font-weight: 700;
        color: #343a40;
        margin-bottom: 20px;
        position: relative;

        &::after {
          content: '';
          position: absolute;
          bottom: -8px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 3px;
          background: #dee2e6;
          transition: width 0.4s ease;
        }
      }

      &:hover h3::after {
        width: 60px;
      }

      p {
        font-size: 1.1rem;
        line-height: 1.7;
        color: #6c757d;
        margin-bottom: 30px;
      }

      .feature-tags {
        display: flex;
        gap: 12px;
        justify-content: center;
        flex-wrap: wrap;

        .el-tag {
          background: #e9ecef;
          border: 1px solid #dee2e6;
          color: #343a40;
          font-weight: 600;
          padding: 8px 16px;
          border-radius: 20px;
          transition: all 0.3s ease;

          &:hover {
            background: #dee2e6;
            transform: translateY(-2px);
          }
        }
      }
    }
  }

}

// 动画效果
@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes wisdomPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes floatWisdom {
  0%, 100% {
    transform: translateY(0px) rotate(0deg);
    opacity: 0.1;
  }
  25% {
    transform: translateY(-20px) rotate(5deg);
    opacity: 0.2;
  }
  50% {
    transform: translateY(-10px) rotate(-5deg);
    opacity: 0.15;
  }
  75% {
    transform: translateY(-30px) rotate(3deg);
    opacity: 0.25;
  }
}

@keyframes wisdomRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes orbitFloat {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px);
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .home-page {
    .hero-section {
      padding: 60px 30px;

      .hero-content {
        grid-template-columns: 1fr;
        gap: 40px;
        text-align: center;
      }

      .hero-text .hero-title {
        font-size: 2.8rem;
      }
    }

    .features-section {
      padding: 80px 30px;

      .features-grid {
        grid-template-columns: 1fr;
        gap: 30px;
      }
    }

    // CTA区域样式
    .cta-section {
      padding: 8rem 0;
      background: #f8f9fa;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: none;
        z-index: 1;
      }

      .cta-container {
        max-width: 900px;
        margin: 0 auto;
        padding: 0 3rem;
        text-align: center;
        position: relative;
        z-index: 2;
      }

      .cta-badge {
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        background: #dee2e6;
        color: #212529;
        padding: 0.75rem 1.5rem;
        border-radius: 50px;
        font-size: 0.875rem;
        font-weight: 600;
        margin-bottom: 2rem;
        box-shadow: none;
      }

      .cta-title {
        font-size: 3.5rem;
        font-weight: 700;
        margin-bottom: 1.5rem;
        color: #343a40;
        line-height: 1.2;
      }

      .cta-subtitle {
        font-size: 1.25rem;
        color: #6c757d;
        margin-bottom: 3rem;
        line-height: 1.8;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
      }

      .cta-actions {
        display: flex;
        gap: 2rem;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        margin-bottom: 3rem;
      }

      .cta-button {
        background: #e9ecef !important;
        border: 1px solid #dee2e6 !important;
        color: #212529 !important;
        font-size: 1.25rem !important;
        font-weight: 600 !important;
        padding: 1.25rem 3rem !important;
        border-radius: 50px !important;
        box-shadow: none !important;
        transition: all 0.4s ease !important;
        position: relative !important;
        overflow: hidden !important;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: none;
          transition: left 0.6s;
        }

        &:hover::before {
          left: 100%;
        }

        &:hover {
          transform: translateY(-5px) !important;
          box-shadow: none !important;
        }
      }

      .cta-secondary {
        background: #343a40 !important;
        border: 2px solid #495057 !important;
        color: #f8f9fa !important;
        font-size: 1.125rem !important;
        font-weight: 600 !important;
        padding: 1rem 2.5rem !important;
        border-radius: 50px !important;
        backdrop-filter: none !important;
        transition: all 0.4s ease !important;

        &:hover {
          background: #495057 !important;
          border-color: #495057 !important;
          transform: translateY(-3px) !important;
          box-shadow: none !important;
        }
      }

      .cta-features {
        display: flex;
        justify-content: center;
        gap: 3rem;
        flex-wrap: wrap;
        margin-top: 2rem;
      }

      .cta-feature {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        color: #6c757d;
        font-size: 0.875rem;
        font-weight: 500;

        .el-icon {
          color: #adb5bd;
          font-size: 1.25rem;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .home-page {
    .hero-section {
      padding: 40px 20px;

      .hero-text {
        .hero-title {
          font-size: 2.2rem;
        }

        .hero-subtitle {
          font-size: 1.1rem;
        }

        .hero-actions {
          flex-direction: column;
          align-items: center;

          .primary-btn,
          .secondary-btn {
            width: 100%;
            max-width: 300px;
          }
        }
      }

      .hero-visual .floating-cards {
        width: 250px;
        height: 250px;

        .card {
          padding: 16px;
          font-size: 14px;
        }
      }
    }

    .features-section {
      padding: 60px 20px;

      .section-header h2 {
        font-size: 2rem;
      }

      .feature-card {
        padding: 30px 20px;
      }
    }

    .stats-section {
      padding: 50px 20px;

      .stats-container {
        grid-template-columns: 1fr;
        gap: 20px;
      }

      .stat-item .stat-number {
        font-size: 2.5rem;
      }
    }
  }
}
</style>