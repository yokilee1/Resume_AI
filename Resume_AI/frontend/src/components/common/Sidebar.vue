<template>
  <div class="sidebar">
    <div class="sidebar-header">
      <div class="logo">
        <div class="logo-icon">
          <div class="wisdom-symbol">智</div>
        </div>
        <div class="logo-text">
          <h2>Resume AI</h2>
          <span class="logo-subtitle">智能简历助手</span>
        </div>
      </div>
    </div>
    
    <!-- 未登录状态的菜单 -->
    <div v-if="!authStore.isAuthenticated">
      <div class="sidebar-menu">
        <el-menu
          :default-active="activeMenu"
          class="menu-container"
          router
          background-color="transparent"
          text-color="#6c757d"
          active-text-color="#f8f9fa"
        >
        <el-menu-item index="/home">
          <el-icon><House></House></el-icon>
          <span>首页</span>
        </el-menu-item>
        
        <el-menu-item index="/login">
          <el-icon><User></User></el-icon>
          <span>登录</span>
        </el-menu-item>
        
        <el-menu-item index="/register">
          <el-icon><UserFilled></UserFilled></el-icon>
          <span>注册</span>
        </el-menu-item>
        </el-menu>
      </div>
      
    </div>
    
    <!-- 已登录状态的菜单 -->
    <div v-else>
      <div class="sidebar-menu">
        <el-menu
          :default-active="activeMenu"
          class="menu-container"
          router
          background-color="transparent"
          text-color="#6c757d"
          active-text-color="#f8f9fa"
        >
        <el-menu-item index="/home">
          <el-icon><House></House></el-icon>
          <span>首页</span>
        </el-menu-item>
        
        <el-menu-item index="/resume-management">
          <el-icon><Document></Document></el-icon>
          <span>简历管理</span>
        </el-menu-item>
        
        <el-menu-item index="/create-resume">
          <el-icon><Plus></Plus></el-icon>
          <span>创建简历</span>
        </el-menu-item>
        
        <el-menu-item index="/resume-templates">
          <el-icon><Collection></Collection></el-icon>
          <span>模板样式</span>
        </el-menu-item>
        
        <el-menu-item index="/competitive-match">
          <el-icon><TrendCharts></TrendCharts></el-icon>
          <span>竞争力匹配</span>
        </el-menu-item>
        
        <el-menu-item index="/user-profile">
          <el-icon><User></User></el-icon>
          <span>个人资料</span>
        </el-menu-item>

        <el-menu-item @click="handleLogout">
          <el-icon><SwitchButton></SwitchButton></el-icon>
          <span>退出登录</span>
        </el-menu-item>
        </el-menu>
      </div>
      
    
    </div>
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
/**
 * 侧边栏样式 - FateMaster 风格
 * 采用深色主题和东方美学设计
 */

.sidebar {
  width: 280px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #dee2e6;
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  box-shadow: none;
  backdrop-filter: none;
}

.sidebar .sidebar-header {
  padding: 24px 20px;
  border-bottom: 1px solid #dee2e6;
  background: #f8f9fa;
  margin: 16px;
  border-radius: 12px;
  backdrop-filter: none;
}

.sidebar .sidebar-header .logo .logo-icon {
  width: 48px;
  height: 48px;
  background: #dee2e6;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: none;
}

.sidebar .sidebar-header .logo .logo-icon .wisdom-symbol {
  color: #343a40;
  font-weight: 700;
  font-size: 20px;
  text-shadow: none;
}

.sidebar .sidebar-header .logo .logo-text h2 {
  color: #343a40;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
  letter-spacing: 0.5px;
}

.sidebar .sidebar-header .logo .logo-text .logo-subtitle {
  color: #6c757d;
  font-size: 12px;
  font-weight: 400;
  opacity: 0.8;
  display: block;
  margin-top: 2px;
}

.sidebar .sidebar-menu .menu-container :deep(.el-menu-item) {
  display: flex;
  align-items: center;
  padding: 0 24px;
  color: #000000;
  text-decoration: none;
  transition: all 0.3s ease;
  height: 48px;
  line-height: 48px;
  margin: 4px 16px;
  border-radius: 12px;
  font-weight: 500;
  position: relative;
  background: transparent !important;
  font-size: 14px;
}

.sidebar .sidebar-menu .menu-container :deep(.el-menu-item:hover) {
  background: var(--ui-hover-bg) !important;
  color: #000000;
  transform: none;
  box-shadow: none;
}

.sidebar .sidebar-menu .menu-container :deep(.el-menu-item.is-active) {
  background: var(--ui-accent) !important;
  color: #000000;
}

/* 图标配色统一 */
.sidebar .sidebar-menu .menu-container :deep(.el-menu-item .el-icon) {
  color: var(--ui-text-secondary);
}

.sidebar .sidebar-menu .menu-container :deep(.el-menu-item:hover .el-icon) {
  color: var(--ui-text-primary);
}

.sidebar .sidebar-menu .menu-container :deep(.el-menu-item.is-active .el-icon) {
  color: var(--white);
}

/* 可访问性：键盘焦点 */
.sidebar .sidebar-menu .menu-container :deep(.el-menu-item:focus-visible) {
  outline: 2px solid var(--ui-focus-outline);
  outline-offset: 2px;
}

.sidebar .user-section .logout-btn {
  width: 100%;
  color: var(--ui-text-secondary);
  border: 1px solid var(--ui-border);
  background: var(--ui-bg);
  font-weight: 500;
  padding: 12px 16px;
  border-radius: 8px;
  backdrop-filter: none;
  transition: all 0.3s ease;
  font-size: 14px;
}

.sidebar .user-section .logout-btn:hover {
  color: var(--ui-text-primary);
  border-color: var(--ui-focus-outline);
  background: var(--ui-hover-bg);
  transform: translateY(-1px);
  box-shadow: none;
}
</style>