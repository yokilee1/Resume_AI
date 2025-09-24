<template>
  <div class="home-page">
    <!-- 英雄区域 -->
    <div class="hero-section">
      <div class="hero-content">
        <div class="hero-text">
          <h1 class="hero-title">
            <span class="gradient-text">Resume AI</span>
            <br>智能简历助手
          </h1>
          <p class="hero-subtitle">
            使用先进的AI技术优化您的简历，提升求职竞争力，开启职业新篇章
          </p>
          <div class="hero-actions">
            <el-button type="primary" size="large" @click="navigateToCreate" class="primary-btn">
              <el-icon><DocumentAdd /></el-icon>
              开始创建简历
            </el-button>
            <el-button size="large" @click="navigateToResumes" class="secondary-btn">
              <el-icon><Document /></el-icon>
              查看我的简历
            </el-button>
          </div>
        </div>
        <div class="hero-visual">
          <div class="floating-cards">
            <div class="card card-1">
              <el-icon><User /></el-icon>
              <span>个人信息</span>
            </div>
            <div class="card card-2">
              <el-icon><Edit /></el-icon>
              <span>AI润色</span>
            </div>
            <div class="card card-3">
              <el-icon><TrendCharts /></el-icon>
              <span>竞争力分析</span>
            </div>
          </div>
        </div>
      </div>
    </div>

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
  PieChart
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;

  // 英雄区域
  .hero-section {
    padding: 80px 40px;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
      opacity: 0.3;
    }

    .hero-content {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 60px;
      align-items: center;
      position: relative;
      z-index: 1;
    }

    .hero-text {
      .hero-title {
        font-size: 3.5rem;
        font-weight: 700;
        line-height: 1.2;
        margin-bottom: 24px;
        color: white;

        .gradient-text {
          background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          font-weight: 800;
        }
      }

      .hero-subtitle {
        font-size: 1.25rem;
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 40px;
        max-width: 500px;
      }

      .hero-actions {
        display: flex;
        gap: 16px;
        flex-wrap: wrap;

        .primary-btn {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          padding: 16px 32px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 12px;
          box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
          transition: all 0.3s ease;

          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 35px rgba(102, 126, 234, 0.6);
          }
        }

        .secondary-btn {
          background: rgba(255, 255, 255, 0.1);
          border: 2px solid rgba(255, 255, 255, 0.3);
          color: white;
          padding: 14px 30px;
          font-size: 1.1rem;
          font-weight: 600;
          border-radius: 12px;
          backdrop-filter: blur(10px);
          transition: all 0.3s ease;

          &:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: rgba(255, 255, 255, 0.5);
            transform: translateY(-2px);
          }
        }
      }
    }

    .hero-visual {
      display: flex;
      justify-content: center;
      align-items: center;

      .floating-cards {
        position: relative;
        width: 300px;
        height: 300px;

        .card {
          position: absolute;
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 16px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          color: white;
          font-weight: 600;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
          animation: float 6s ease-in-out infinite;

          .el-icon {
            font-size: 24px;
          }

          &.card-1 {
            top: 20px;
            left: 20px;
            animation-delay: 0s;
          }

          &.card-2 {
            top: 80px;
            right: 20px;
            animation-delay: 2s;
          }

          &.card-3 {
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            animation-delay: 4s;
          }
        }
      }
    }
  }

  // 功能特色区域
  .features-section {
    background: white;
    padding: 100px 40px;

    .section-header {
      text-align: center;
      margin-bottom: 60px;

      h2 {
        font-size: 2.5rem;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 16px;
      }

      p {
        font-size: 1.2rem;
        color: #6c757d;
        max-width: 600px;
        margin: 0 auto;
      }
    }

    .features-grid {
      max-width: 1200px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
      gap: 40px;
    }

    .feature-card {
      background: white;
      border-radius: 20px;
      padding: 40px 30px;
      text-align: center;
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
      border: 1px solid #f0f0f0;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        height: 4px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      }

      &:hover {
        transform: translateY(-8px);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
      }

      .feature-icon {
        width: 80px;
        height: 80px;
        margin: 0 auto 24px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        border-radius: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;

        .el-icon {
          font-size: 32px;
        }
      }

      h3 {
        font-size: 1.5rem;
        font-weight: 700;
        color: #2c3e50;
        margin-bottom: 16px;
      }

      p {
        font-size: 1rem;
        line-height: 1.6;
        color: #6c757d;
        margin-bottom: 24px;
      }

      .feature-tags {
        display: flex;
        gap: 8px;
        justify-content: center;
        flex-wrap: wrap;

        .el-tag {
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          color: #495057;
          font-weight: 500;
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

    .stats-section {
      padding: 60px 30px;

      .stats-container {
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
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