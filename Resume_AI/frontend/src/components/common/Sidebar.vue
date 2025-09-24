<template>
  <el-aside width="240px" class="sidebar">
    <div class="logo">
      <h1>Resume AI</h1>
    </div>
    <el-menu
      :default-active="activeIndex"
      class="sidebar-menu"
      background-color="#001529"
      text-color="#fff"
      active-text-color="#409EFF"
      @select="handleMenuSelect"
    >
      <div class="menu-section">
        <div class="section-title">发现</div>
        <el-menu-item index="/">
          <el-icon><HomeFilled /></el-icon>
          <span>主页</span>
        </el-menu-item>
        <el-menu-item index="/create-resume">
          <el-icon><Plus /></el-icon>
          <span>新建简历</span>
        </el-menu-item>
        <el-menu-item index="/competitive-match">
          <el-icon><Connection /></el-icon>
          <span>竞争力匹配</span>
        </el-menu-item>
      </div>
      
      <div class="menu-section">
        <div class="section-title">我的</div>
        <el-menu-item index="/resume-management">
          <el-icon><Document /></el-icon>
          <span>简历管理</span>
        </el-menu-item>
        <el-menu-item index="/user-profile">
          <el-icon><User /></el-icon>
          <span>用户信息</span>
        </el-menu-item>
        <el-menu-item index="logout">
          <el-icon><SwitchButton /></el-icon>
          <span>登出</span>
        </el-menu-item>
      </div>
    </el-menu>
  </el-aside>
</template>

<script setup>
/**
 * 侧边栏导航组件
 * 提供应用主要功能的导航入口
 */
import { ref, computed, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { 
  HomeFilled, 
  Plus, 
  Connection, 
  Document, 
  User, 
  SwitchButton 
} from '@element-plus/icons-vue';

const router = useRouter();
const route = useRoute();

// 当前激活的菜单项
const activeIndex = computed(() => {
  return route.path;
});

/**
 * 处理菜单选择事件
 * @param {string} index - 菜单项索引（路由路径）
 */
const handleMenuSelect = (index) => {
  if (index === 'logout') {
    handleLogout();
  } else {
    // 导航到对应路由
    router.push(index);
  }
};

/**
 * 处理登出功能
 */
const handleLogout = () => {
  // 这里可以添加登出逻辑，比如清除用户信息、token等
  console.log('用户登出');
  // 可以添加确认对话框
  // ElMessageBox.confirm('确定要登出吗？', '提示', {
  //   confirmButtonText: '确定',
  //   cancelButtonText: '取消',
  //   type: 'warning'
  // }).then(() => {
  //   // 清除用户数据
  //   // 跳转到登录页
  //   router.push('/login');
  // });
};
</script>

<style lang="scss" scoped>
.sidebar {
  background-color: #001529;
  height: 100%;
  color: #fff;
  overflow-y: auto;
  
  .logo {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    
    h1 {
      color: #fff;
      font-size: 20px;
      margin: 0;
    }
  }
  
  .sidebar-menu {
    border-right: none;
  }
  
  .menu-section {
    margin-top: 20px;
    
    .section-title {
      padding: 0 20px;
      margin-bottom: 10px;
      color: rgba(255, 255, 255, 0.65);
      font-size: 14px;
    }
  }
}
</style>