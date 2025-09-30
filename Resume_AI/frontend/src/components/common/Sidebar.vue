<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <h2>RESUME AI</h2>
      </div>
    </div>
    
    <!-- 未登录状态的菜单 -->
    <template v-if="!authStore.isAuthenticated">
      <div class="sidebar-menu">
        <el-menu
          :default-active="activeMenu"
          class="menu-container"
          router
          background-color="transparent"
          text-color="rgba(255, 255, 255, 0.7)"
          active-text-color="#fff"
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
      </div>
      
      <div class="login-prompt">
        <p>登录后可使用更多功能</p>
        <el-button type="primary" size="small" @click="goToLogin">
          立即登录
        </el-button>
      </div>
    </template>
    
    <!-- 已登录状态的菜单 -->
    <template v-else>
      <div class="sidebar-menu">
        <el-menu
          :default-active="activeMenu"
          class="menu-container"
          router
          background-color="transparent"
          text-color="rgba(255, 255, 255, 0.7)"
          active-text-color="#fff"
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
        
        <el-menu-item index="/resume-templates">
          <el-icon><Collection /></el-icon>
          <span>模板样式</span>
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
      </div>
      
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
  SwitchButton,
  Collection
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
  width: 280px;
  height: 100vh;
  background: var(--gradient-primary);
  color: var(--color-text-light);
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: var(--shadow-lg);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    z-index: 0;
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
  
  .sidebar-header {
    padding: var(--spacing-lg);
    border-bottom: 1px solid var(--glass-border);
    background: var(--glass-subtle);
    backdrop-filter: blur(10px);
    margin: var(--spacing-md);
    border-radius: var(--radius-lg);
    
    .logo {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      color: var(--color-text-light);
      text-decoration: none;
      transition: var(--transition-base);
      
      &:hover {
        transform: scale(1.02);
      }
      
      .logo-icon {
        width: 36px;
        height: 36px;
        background: var(--gradient-accent);
        border-radius: var(--radius-md);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: var(--font-bold);
        font-size: var(--text-lg);
        box-shadow: var(--shadow-sm);
      }
      
      .logo-text {
        font-size: var(--text-xl);
        font-weight: var(--font-bold);
        background: var(--gradient-accent);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        letter-spacing: -0.5px;
      }
    }
  }
  
  .sidebar-menu {
    flex: 1;
    padding: var(--spacing-lg) 0;
    
    .menu-container {
      background: transparent !important;
      border: none !important;
      
      :deep(.el-menu-item) {
        display: flex;
        align-items: center;
        padding: 0 var(--spacing-xl);
        color: var(--color-text-light-secondary) !important;
        text-decoration: none;
        transition: var(--transition-base);
        height: 48px;
        line-height: 48px;
        margin: var(--spacing-xs) var(--spacing-md);
        border-radius: var(--radius-lg);
        font-weight: var(--font-medium);
        position: relative;
        background: transparent !important;
        font-size: var(--text-md);
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: var(--gradient-accent);
          border-radius: 0 var(--radius-xs) var(--radius-xs) 0;
          opacity: 0;
          transition: var(--transition-base);
        }
        
        &:hover {
          background: var(--glass-hover) !important;
          color: var(--color-text-light) !important;
          transform: translateX(6px);
          box-shadow: var(--shadow-sm);
          
          &::before {
            opacity: 1;
          }
        }
        
        &.is-active {
          background: var(--glass-active) !important;
          color: var(--color-text-light) !important;
          transform: translateX(6px);
          box-shadow: var(--shadow-md);
          
          &::before {
            opacity: 1;
          }
        }
        
        .el-icon {
          margin-right: var(--spacing-sm);
          font-size: var(--text-lg);
          opacity: 0.9;
          width: 20px;
          display: flex;
          justify-content: center;
        }
        
        span {
          font-size: var(--text-md);
          font-weight: var(--font-medium);
        }
      }
    }
    

  }
  
  // 登录提示区域
  .login-prompt {
    padding: var(--spacing-lg);
    text-align: center;
    border-top: 1px solid var(--glass-border);
    margin: var(--spacing-md);
    margin-top: auto;
    background: var(--glass-subtle);
    border-radius: var(--radius-lg);
    backdrop-filter: blur(10px);
    
    p {
      color: var(--color-text-light-secondary);
      font-size: var(--text-sm);
      margin: 0 0 var(--spacing-md) 0;
      line-height: 1.5;
      font-weight: var(--font-medium);
    }
    
    .el-button {
      width: 100%;
      background: var(--glass-hover);
      border: 1px solid var(--glass-border);
      color: var(--color-text-light);
      font-weight: var(--font-semibold);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-md);
      backdrop-filter: blur(10px);
      transition: var(--transition-base);
      font-size: var(--text-sm);
      
      &:hover {
        background: var(--glass-active);
        border-color: var(--color-accent);
        transform: translateY(-1px);
        box-shadow: var(--shadow-sm);
      }
    }
  }
  
  // 用户信息区域
  .user-section {
    padding: var(--spacing-lg);
    border-top: 1px solid var(--glass-border);
    margin: var(--spacing-md);
    margin-top: auto;
    background: var(--glass-subtle);
    border-radius: var(--radius-lg);
    backdrop-filter: blur(10px);
    
    .user-info {
      display: flex;
      align-items: center;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-md);
      
      .user-avatar {
        background: var(--gradient-accent);
        color: white;
        font-weight: var(--font-semibold);
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: var(--text-md);
        flex-shrink: 0;
        box-shadow: var(--shadow-sm);
      }
      
      .user-details {
        flex: 1;
        min-width: 0;
        
        .username {
          color: var(--color-text-light);
          font-size: var(--text-md);
          font-weight: var(--font-semibold);
          margin-bottom: 2px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .user-email {
          color: var(--color-text-light-secondary);
          font-size: var(--text-sm);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    
    .logout-btn {
      width: 100%;
      color: var(--color-text-light-secondary);
      border: 1px solid var(--glass-border);
      background: var(--glass-hover);
      font-weight: var(--font-medium);
      padding: var(--spacing-sm) var(--spacing-md);
      border-radius: var(--radius-md);
      backdrop-filter: blur(10px);
      transition: var(--transition-base);
      font-size: var(--text-sm);
      
      &:hover {
        color: var(--color-text-light);
        border-color: var(--color-accent);
        background: var(--glass-active);
        transform: translateY(-1px);
        box-shadow: var(--shadow-sm);
      }
      
      .el-icon {
        margin-right: var(--spacing-xs);
        font-size: var(--text-md);
      }
    }
  }
}

// 响应式设计
@media (max-width: 1024px) {
  .sidebar {
    width: 260px;
    
    .sidebar-header {
      padding: var(--spacing-lg) var(--spacing-md);
      
      .logo {
        font-size: var(--text-lg);
      }
    }
    
    .sidebar-menu {
      padding: var(--spacing-xl) 0;
      
      :deep(.el-menu) .el-menu-item,
      .menu-item {
        height: 48px;
        line-height: 48px;
        margin: var(--spacing-xs) var(--spacing-sm);
        padding: 0 var(--spacing-lg);
        
        .el-icon {
          font-size: var(--text-md);
          margin-right: var(--spacing-sm);
        }
      }
    }
    
    .login-prompt,
    .user-section {
      padding: var(--spacing-lg) var(--spacing-md);
    }
  }
}

@media (max-width: 768px) {
  .sidebar {
    width: 240px;
    
    .sidebar-header .logo {
      font-size: var(--text-md);
    }
    
    .sidebar-menu {
      :deep(.el-menu) .el-menu-item,
      .menu-item {
        height: 44px;
        line-height: 44px;
        font-size: var(--text-sm);
      }
    }
    
    .user-section .user-info .user-avatar {
      width: 36px;
      height: 36px;
      font-size: var(--text-sm);
    }
  }
}
</style>