<template>
  <div class="home-page">
    <h1>欢迎使用 Resume AI</h1>
    <div class="content-container">
      <div class="main-content">
        <div class="welcome-section">
          <h2>智能简历助手</h2>
          <p>使用AI技术优化您的简历，提高求职成功率</p>
          <BlackButton @click="navigateToCreate">开始创建简历</BlackButton>
        </div>
        <div class="features-section">
          <div class="feature-card">
            <h3>AI润色</h3>
            <p>智能优化简历内容，提升专业度</p>
          </div>
          <div class="feature-card">
            <h3>AI评估</h3>
            <p>分析简历优缺点，给出改进建议</p>
          </div>
          <div class="feature-card">
            <h3>竞争力匹配</h3>
            <p>评估简历与目标职位的匹配度</p>
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
import Navigation from '../components/common/Navigation.vue';
import BlackButton from '../components/ui/BlackButton.vue';

const router = useRouter();

// 导航到创建简历页面
const navigateToCreate = () => {
  router.push('/create-resume');
};
</script>

<style lang="scss" scoped>
.home-page {
  h1 {
    margin-bottom: 20px;
    text-align: center;
    padding: 20px 0;
  }
  
  .content-container {
    display: flex;
    
    .main-content {
      flex: 1;
      padding: 20px;
      
      .welcome-section {
        text-align: center;
        margin-bottom: 40px;
        padding: 40px 20px;
        background-color: #f9f9f9;
        border-radius: 8px;
        
        h2 {
          margin-bottom: 15px;
          font-size: 28px;
        }
        
        p {
          margin-bottom: 20px;
          color: #666;
        }
      }
      
      .features-section {
        display: flex;
        gap: 20px;
        justify-content: center;
        
        .feature-card {
          flex: 1;
          max-width: 300px;
          padding: 20px;
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
          text-align: center;
          
          h3 {
            margin-bottom: 10px;
          }
          
          p {
            color: #666;
          }
        }
      }
    }
  }
}
</style>