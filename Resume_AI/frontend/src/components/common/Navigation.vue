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
/**
 * 顶部导航样式 - FateMaster 风格
 * 采用深色主题和东方美学设计
 */
.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32px;
  height: 70px;
  background: #ffffff;
  border-bottom: 1px solid #dee2e6;
  box-shadow: none;
  position: relative;
  backdrop-filter: none;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: none;
    backdrop-filter: none;
    z-index: -1;
  }
  
  .nav-left {
    display: flex;
    align-items: center;
    flex: 1;
    
    .logo {
      font-size: var(--text-2xl);
      font-weight: var(--font-extrabold);
      color: #343a40;
      text-decoration: none;
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
      color: #6c757d;
      font-size: 15px;
      font-weight: 500;
      padding: 8px 16px;
      border-radius: 8px;
      transition: all 0.3s ease;
      text-decoration: none;
      
      &:hover {
        color: #343a40;
        background: #e9ecef;
        transform: translateY(-1px);
      }
    }
    
    .register-btn {
      font-size: 15px;
      font-weight: 600;
      padding: 10px 20px;
      background: #343a40;
      border: 1px solid #343a40;
      color: #f8f9fa;
      border-radius: 10px;
      backdrop-filter: none;
      transition: all 0.3s ease;
      box-shadow: none;
      
      &:hover {
        background: #495057;
        border-color: #495057;
        transform: translateY(-2px);
        box-shadow: none;
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
      background: #ffffff;
      backdrop-filter: none;
      border: 1px solid #dee2e6;
      transition: all 0.3s ease;
      
      &:hover {
        background: #e9ecef;
        border-color: #495057;
        transform: translateY(-1px);
        box-shadow: none;
      }
      
      .avatar {
        margin-right: 10px;
        background: #e9ecef;
        color: #343a40;
        font-weight: 600;
        width: 36px;
        height: 36px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        font-size: 14px;
        box-shadow: none;
      }
      
      .username {
        margin-right: 8px;
        font-size: 15px;
        font-weight: 500;
        color: #343a40;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .dropdown-icon {
        color: #6c757d;
        font-size: 14px;
        transition: all 0.3s ease;
      }
      
      &:hover .dropdown-icon {
        color: #343a40;
        transform: rotate(180deg);
      }
    }
  }
}

// 下拉菜单黑白灰样式
:deep(.el-dropdown-menu) {
  background: #ffffff;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  box-shadow: none;
  padding: 8px;
  margin-top: 8px;
}

:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  margin-bottom: 4px;
  font-weight: 500;
  transition: all 0.3s ease;
  color: #6c757d;
}

:deep(.el-dropdown-menu__item:hover) {
  background: #e9ecef;
  color: #343a40;
  transform: translateX(4px);
  box-shadow: none;
}

:deep(.el-dropdown-menu__item .el-icon) {
  margin-right: 10px;
  font-size: 16px;
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