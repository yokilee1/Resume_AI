<template>
  <div class="navigation">
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
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
  
  .auth-buttons {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .login-btn {
      color: #666;
      font-size: 14px;
      
      &:hover {
        color: #409EFF;
      }
    }
    
    .register-btn {
      font-size: 14px;
      padding: 8px 16px;
    }
  }
  
  .user-info {
    .user-dropdown {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 4px 8px;
      border-radius: 6px;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: rgba(0, 0, 0, 0.04);
      }
      
      .avatar {
        margin-right: 8px;
        background-color: #409EFF;
        color: #fff;
        font-weight: 500;
      }
      
      .username {
        margin-right: 8px;
        font-size: 14px;
        color: #333;
        max-width: 120px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .dropdown-icon {
        color: #999;
        font-size: 12px;
        transition: transform 0.3s;
      }
      
      &:hover .dropdown-icon {
        color: #666;
      }
    }
  }
}

// 下拉菜单项样式
:deep(.el-dropdown-menu__item) {
  display: flex;
  align-items: center;
  
  .el-icon {
    margin-right: 8px;
    font-size: 16px;
  }
}
</style>