<template>
  <div class="navigation">
    <div class="nav-left">
      <!-- 可以在这里添加面包屑或其他左侧内容 -->
    </div>
    
    <div class="nav-right">
      <!-- 未登录状态 -->
      <div v-if="!authStore.isAuthenticated" class="auth-buttons">
        <el-button type="text" @click="goToLogin" class="login-btn">
          登录
        </el-button>
        <el-button type="primary" @click="goToRegister" class="register-btn">
          注册
        </el-button>
      </div>
      
      <!-- 已登录状态 -->
      <div v-else class="user-info">
        <el-dropdown @command="handleCommand" trigger="click">
          <div class="user-dropdown">
            <el-avatar 
              class="avatar" 
              :size="36"
              :src="authStore.userInfo?.avatar"
            >
              {{ getUserInitial() }}
            </el-avatar>
            <span class="username">{{ authStore.userInfo?.username || '用户' }}</span>
            <el-icon class="dropdown-icon"><ArrowDown /></el-icon>
          </div>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="profile">
                <el-icon><User /></el-icon>
                个人资料
              </el-dropdown-item>
              <el-dropdown-item command="settings">
                <el-icon><Setting /></el-icon>
                设置
              </el-dropdown-item>
              <el-dropdown-item divided command="logout">
                <el-icon><SwitchButton /></el-icon>
                登出
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 顶部导航组件
 * 根据用户登录状态显示不同的导航内容
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { 
  ArrowDown, 
  User, 
  Setting, 
  SwitchButton 
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

/**
 * 获取用户名首字母作为头像显示
 * @returns {string} 用户名首字母
 */
const getUserInitial = () => {
  const username = authStore.userInfo?.username || authStore.userInfo?.email || '用户'
  return username.charAt(0).toUpperCase()
}

/**
 * 跳转到登录页面
 */
const goToLogin = () => {
  router.push('/login')
}

/**
 * 跳转到注册页面
 */
const goToRegister = () => {
  router.push('/register')
}

/**
 * 处理下拉菜单命令
 * @param {string} command - 命令类型
 */
const handleCommand = async (command) => {
  switch (command) {
    case 'profile':
      router.push('/user-profile')
      break
    case 'settings':
      ElMessage.info('设置功能开发中...')
      break
    case 'logout':
      await handleLogout()
      break
  }
}

/**
 * 处理用户登出
 */
const handleLogout = async () => {
  try {
    await ElMessageBox.confirm(
      '确定要登出吗？',
      '确认登出',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    
    // 执行登出
    authStore.logout()
    ElMessage.success('已成功登出')
    
    // 跳转到首页
    router.push('/')
  } catch (error) {
    // 用户取消登出
    console.log('用户取消登出')
  }
}
</script>

<style lang="scss" scoped>
.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 var(--spacing-4xl);
  height: 70px;
  background: var(--primary-gradient);
  border-bottom: none;
  box-shadow: var(--shadow-primary-lg);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(10px);
    z-index: -1;
  }
  
  .nav-left {
    display: flex;
    align-items: center;
    flex: 1;
    
    .logo {
      font-size: var(--text-2xl);
      font-weight: var(--font-extrabold);
      background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      text-decoration: none;
      transition: var(--transition-normal);
      
      &:hover {
        transform: scale(1.05);
      }
    }
  }
  
  .nav-right {
    display: flex;
    align-items: center;
    gap: var(--spacing-xl);
    justify-content: flex-end;
  }
  
  .auth-buttons {
    display: flex;
    align-items: center;
    gap: 16px;
    
    .login-btn {
      color: rgba(255, 255, 255, 0.9);
      font-size: 15px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 0.3s ease;
      text-decoration: none;
      
      &:hover {
        color: white;
        background: rgba(255, 255, 255, 0.1);
        transform: translateY(-1px);
      }
    }
    
    .register-btn {
      font-size: 15px;
      font-weight: 600;
      padding: 10px 20px;
      background: rgba(255, 255, 255, 0.15);
      border: 2px solid rgba(255, 255, 255, 0.3);
      color: white;
      border-radius: 10px;
      backdrop-filter: blur(10px);
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.25);
        border-color: rgba(255, 255, 255, 0.5);
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
      }
    }
  }
  
  .user-info {
    .user-dropdown {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 8px 12px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.2);
      transition: all 0.3s ease;
      
      &:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.3);
        transform: translateY(-1px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      }
      
      .avatar {
        margin-right: 10px;
        background: linear-gradient(135deg, #ffd89b 0%, #19547b 100%);
        color: #fff;
        font-weight: 600;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 14px;
      }
      
      .username {
        margin-right: 8px;
        font-size: 15px;
        font-weight: 500;
        color: white;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .dropdown-icon {
        color: rgba(255, 255, 255, 0.8);
        font-size: 14px;
        transition: all 0.3s ease;
      }
      
      &:hover .dropdown-icon {
        color: white;
        transform: rotate(180deg);
      }
    }
  }
}

// 下拉菜单项样式
:deep(.el-dropdown-menu) {
  background: white;
  border: none;
  border-radius: 12px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
  padding: 8px;
  margin-top: 8px;
  
  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 4px;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    &:hover {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      transform: translateX(4px);
    }
    
    .el-icon {
      margin-right: 10px;
      font-size: 16px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .navigation {
    padding: 0 var(--spacing-xl);
    height: 60px;
    
    .nav-left .logo {
      font-size: var(--text-xl);
    }
    
    .nav-right {
      gap: var(--spacing-sm);
    }
    
    .auth-buttons {
      gap: var(--spacing-sm);
      
      .login-btn,
      .register-btn {
        font-size: var(--text-sm);
        padding: var(--spacing-xs) var(--spacing-sm);
      }
    }
    
    .user-info .user-dropdown {
      padding: var(--spacing-xs) var(--spacing-sm);
      
      .avatar {
        width: 32px;
        height: 32px;
        margin-right: var(--spacing-xs);
      }
      
      .username {
        font-size: var(--text-sm);
        max-width: 80px;
      }
    }
  }
}
</style>