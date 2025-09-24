<template>
  <div class="login-page">
    <div class="login-container">
      <!-- 左侧装饰区域 -->
      <div class="login-decoration">
        <div class="decoration-content">
          <h1 class="brand-title">Resume AI</h1>
          <p class="brand-subtitle">智能简历生成平台</p>
          <div class="feature-list">
            <div class="feature-item">
              <el-icon><DocumentAdd /></el-icon>
              <span>智能简历生成</span>
            </div>
            <div class="feature-item">
              <el-icon><EditPen /></el-icon>
              <span>AI 润色优化</span>
            </div>
            <div class="feature-item">
              <el-icon><TrendCharts /></el-icon>
              <span>竞争力分析</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-form-section">
        <div class="form-container">
          <div class="form-header">
            <h2>欢迎回来</h2>
            <p>登录您的账户继续使用</p>
          </div>

          <el-form
            ref="loginFormRef"
            :model="loginForm"
            :rules="loginRules"
            class="login-form"
            size="large"
          >
            <el-form-item prop="email">
              <el-input
                v-model="loginForm.email"
                placeholder="请输入邮箱"
                prefix-icon="Message"
                clearable
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="loginForm.password"
                type="password"
                placeholder="请输入密码"
                prefix-icon="Lock"
                show-password
                clearable
                @keyup.enter="handleLogin"
              />
            </el-form-item>

            <div class="form-options">
              <el-checkbox v-model="loginForm.rememberMe">记住我</el-checkbox>
              <el-link type="primary" :underline="false">忘记密码？</el-link>
            </div>

            <el-button
              type="primary"
              class="login-button"
              :loading="authStore.isLoading"
              @click="handleLogin"
            >
              {{ authStore.isLoading ? '登录中...' : '登录' }}
            </el-button>
          </el-form>

          <div class="form-footer">
            <span>还没有账户？</span>
            <el-link type="primary" :underline="false" @click="goToRegister">
              立即注册
            </el-link>
          </div>

          <!-- 第三方登录 -->
          <div class="social-login">
            <div class="divider">
              <span>或者</span>
            </div>
            <div class="social-buttons">
              <el-button class="social-button" @click="handleSocialLogin('github')">
                <el-icon><Platform /></el-icon>
                GitHub
              </el-button>
              <el-button class="social-button" @click="handleSocialLogin('google')">
                <el-icon><ChromeFilled /></el-icon>
                Google
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * 登录页面组件
 * 提供用户登录功能，包括表单验证、记住我、第三方登录等
 */
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  DocumentAdd, 
  EditPen, 
  TrendCharts, 
  Platform, 
  ChromeFilled 
} from '@element-plus/icons-vue'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

// 表单引用
const loginFormRef = ref(null)

// 登录表单数据
const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false
})

// 表单验证规则
const loginRules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6位', trigger: 'blur' }
  ]
}

/**
 * 处理登录
 */
const handleLogin = async () => {
  if (!loginFormRef.value) return

  try {
    // 表单验证
    await loginFormRef.value.validate()
    
    // 使用store进行登录
    await authStore.simulateLogin(loginForm)

    ElMessage.success('登录成功！')
    
    // 跳转到首页或之前访问的页面
    router.push('/')
    
  } catch (error) {
    if (error !== false) { // 不是表单验证错误
      console.error('登录失败:', error)
      ElMessage.error(error.message || '登录失败，请检查用户名和密码')
    }
  }
}

/**
 * 跳转到注册页面
 */
const goToRegister = () => {
  router.push('/register')
}

/**
 * 处理第三方登录
 * @param {string} provider - 登录提供商 (github, google)
 */
const handleSocialLogin = (provider) => {
  ElMessage.info(`${provider} 登录功能开发中...`)
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-container {
  width: 100%;
  max-width: 1000px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  min-height: 600px;
}

/* 左侧装饰区域 */
.login-decoration {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.decoration-content {
  text-align: center;
}

.brand-title {
  font-size: 3rem;
  font-weight: bold;
  margin-bottom: 10px;
  background: linear-gradient(45deg, #fff, #e0e7ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.brand-subtitle {
  font-size: 1.2rem;
  margin-bottom: 40px;
  opacity: 0.9;
}

.feature-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 1.1rem;
  opacity: 0.9;
}

.feature-item .el-icon {
  font-size: 1.5rem;
}

/* 右侧表单区域 */
.login-form-section {
  flex: 1;
  padding: 60px 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.form-container {
  width: 100%;
  max-width: 400px;
}

.form-header {
  text-align: center;
  margin-bottom: 40px;
}

.form-header h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 8px;
}

.form-header p {
  color: #666;
  font-size: 1rem;
}

.login-form {
  margin-bottom: 30px;
}

.login-form .el-form-item {
  margin-bottom: 24px;
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
}

.login-button {
  width: 100%;
  height: 48px;
  font-size: 1.1rem;
  border-radius: 8px;
}

.form-footer {
  text-align: center;
  color: #666;
  margin-bottom: 30px;
}

.form-footer .el-link {
  margin-left: 8px;
  font-weight: 500;
}

/* 第三方登录 */
.social-login {
  margin-top: 30px;
}

.divider {
  text-align: center;
  margin-bottom: 20px;
  position: relative;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: #e0e0e0;
}

.divider span {
  background: white;
  padding: 0 20px;
  color: #999;
  font-size: 0.9rem;
}

.social-buttons {
  display: flex;
  gap: 12px;
}

.social-button {
  flex: 1;
  height: 44px;
  border: 1px solid #e0e0e0;
  background: white;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  transition: all 0.3s;
}

.social-button:hover {
  border-color: #409eff;
  color: #409eff;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .login-container {
    flex-direction: column;
    max-width: 400px;
    margin: 20px;
  }

  .login-decoration {
    padding: 40px 20px;
  }

  .brand-title {
    font-size: 2rem;
  }

  .feature-list {
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
  }

  .login-form-section {
    padding: 40px 20px;
  }
}
</style>