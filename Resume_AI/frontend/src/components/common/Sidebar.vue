<template>
  <div class="sidebar">
    <div class="logo">
      <h2>RESUME AI</h2>
    </div>
    
    <!-- 未登录状态的菜单 -->
    <template v-if="!authStore.isAuthenticated">
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        router
        background-color="#001529"
        text-color="#fff"
        active-text-color="#1890ff"
      >
        <el-menu-item index="/home">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-menu-item>
        
        <el-menu-item index="/login">
          <el-icon><User /></el-icon>
          <span>登录</span>
        </el-menu-item>
        
        <el-menu-item index="/register">
          <el-icon><UserFilled /></el-icon>
          <span>注册</span>
        </el-menu-item>
      </el-menu>
      
      <div class="login-prompt">
        <p>登录后可使用更多功能</p>
        <el-button type="primary" size="small" @click="goToLogin">
          立即登录
        </el-button>
      </div>
    </template>
    
    <!-- 已登录状态的菜单 -->
    <template v-else>
      <el-menu
        :default-active="activeMenu"
        class="sidebar-menu"
        router
        background-color="#001529"
        text-color="#fff"
        active-text-color="#1890ff"
      >
        <el-menu-item index="/home">
          <el-icon><House /></el-icon>
          <span>首页</span>
        </el-menu-item>
        
        <el-menu-item index="/resume-management">
          <el-icon><Document /></el-icon>
          <span>简历管理</span>
        </el-menu-item>
        
        <el-menu-item index="/create-resume">
          <el-icon><Plus /></el-icon>
          <span>创建简历</span>
        </el-menu-item>
        
        <el-menu-item index="/competitive-match">
          <el-icon><TrendCharts /></el-icon>
          <span>竞争力匹配</span>
        </el-menu-item>
        
        <el-menu-item index="/user-profile">
          <el-icon><User /></el-icon>
          <span>个人资料</span>
        </el-menu-item>
      </el-menu>
      
      <!-- 用户信息区域 -->
      <div class="user-section">
        <div class="user-info">
          <el-avatar 
            :size="40" 
            :src="authStore.user?.avatar"
            class="user-avatar"
          >
            {{ getUserInitial() }}
          </el-avatar>
          <div class="user-details">
            <div class="username">{{ authStore.user?.username || '用户' }}</div>
            <div class="user-email">{{ authStore.user?.email || '' }}</div>
          </div>
        </div>
        <el-button 
          type="text" 
          size="small" 
          class="logout-btn"
          @click="handleLogout"
        >
          <el-icon><SwitchButton /></el-icon>
          退出登录
        </el-button>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/authStore'
import { 
  House,
  Plus, 
  TrendCharts, 
  Document, 
  User,
  UserFilled,
  SwitchButton 
} from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

// 当前激活的菜单项
const activeMenu = computed(() => route.path)

/**
 * 获取用户名首字母
 * @returns {string} 用户名首字母
 */
const getUserInitial = () => {
  const username = authStore.user?.username || '用户'
  return username.charAt(0).toUpperCase()
}

/**
 * 跳转到登录页面
 */
const goToLogin = () => {
  router.push('/login')
}

/**
 * 处理登出操作
 */
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要退出登录吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    
    // 执行登出
    await authStore.logout()
    ElMessage.success('已退出登录')
    
    // 跳转到首页
    router.push('/home')
  } catch (error) {
    // 用户取消登出
    console.log('用户取消登出')
  }
}
</script>

<style lang="scss" scoped>
.sidebar {
  height: 100vh;
  background-color: #001529;
  display: flex;
  flex-direction: column;
  
  .logo {
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-bottom: 1px solid #1f1f1f;
    flex-shrink: 0;
    
    h2 {
      color: #fff;
      font-size: 20px;
      font-weight: bold;
      margin: 0;
    }
  }
  
  .sidebar-menu {
    border: none;
    flex: 1;
    
    .el-menu-item {
      height: 48px;
      line-height: 48px;
      
      &:hover {
        background-color: #1890ff !important;
      }
      
      &.is-active {
        background-color: #1890ff !important;
        border-right: 3px solid #409EFF;
      }
      
      .el-icon {
        margin-right: 8px;
        font-size: 16px;
      }
    }
  }
  
  // 登录提示区域
  .login-prompt {
    padding: 20px;
    text-align: center;
    border-top: 1px solid #1f1f1f;
    margin-top: auto;
    
    p {
      color: #8c8c8c;
      font-size: 12px;
      margin: 0 0 12px 0;
    }
    
    .el-button {
      width: 100%;
    }
  }
  
  // 用户信息区域
  .user-section {
    padding: 16px;
    border-top: 1px solid #1f1f1f;
    margin-top: auto;
    
    .user-info {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      
      .user-avatar {
        background-color: #409EFF;
        color: #fff;
        font-weight: 500;
        margin-right: 12px;
      }
      
      .user-details {
        flex: 1;
        min-width: 0;
        
        .username {
          color: #fff;
          font-size: 14px;
          font-weight: 500;
          margin-bottom: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .user-email {
          color: #8c8c8c;
          font-size: 12px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    
    .logout-btn {
      width: 100%;
      color: #8c8c8c;
      border: 1px solid #1f1f1f;
      background-color: transparent;
      
      &:hover {
        color: #fff;
        border-color: #409EFF;
        background-color: rgba(64, 158, 255, 0.1);
      }
      
      .el-icon {
        margin-right: 4px;
      }
    }
  }
}
</style>