<template>
  <div class="register-page">
    <div class="register-container">
      <!-- 左侧装饰区域 -->
      <div class="register-decoration">
        <div class="decoration-content">
          <h1 class="brand-title">Resume AI</h1>
          <p class="brand-subtitle">开启您的职业新篇章</p>
          <div class="benefit-list">
            <div class="benefit-item">
              <el-icon><Star /></el-icon>
              <div>
                <h4>免费使用</h4>
                <p>基础功能完全免费</p>
              </div>
            </div>
            <div class="benefit-item">
              <el-icon><Lightning /></el-icon>
              <div>
                <h4>快速生成</h4>
                <p>3分钟生成专业简历</p>
              </div>
            </div>
            <div class="benefit-item">
              <el-icon><Trophy /></el-icon>
              <div>
                <h4>提升竞争力</h4>
                <p>AI助力职场成功</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧注册表单 -->
      <div class="register-form-section">
        <div class="form-container">
          <div class="form-header">
            <h2>创建账户</h2>
            <p>加入我们，开始您的智能简历之旅</p>
          </div>

          <el-form
            ref="registerFormRef"
            :model="registerForm"
            :rules="registerRules"
            class="register-form"
            size="large"
          >
            <el-form-item prop="username">
              <el-input
                v-model="registerForm.username"
                placeholder="请输入用户名"
                prefix-icon="User"
                clearable
              />
            </el-form-item>

            <el-form-item prop="email">
              <el-input
                v-model="registerForm.email"
                placeholder="请输入邮箱"
                prefix-icon="Message"
                clearable
              />
            </el-form-item>

            <el-form-item prop="password">
              <el-input
                v-model="registerForm.password"
                type="password"
                placeholder="请输入密码"
                prefix-icon="Lock"
                show-password
                clearable
              />
            </el-form-item>

            <el-form-item prop="confirmPassword">
              <el-input
                v-model="registerForm.confirmPassword"
                type="password"
                placeholder="请确认密码"
                prefix-icon="Lock"
                show-password
                clearable
                @keyup.enter="handleRegister"
              />
            </el-form-item>

            <el-form-item prop="agreement">
              <el-checkbox v-model="registerForm.agreement">
                我已阅读并同意
                <el-link type="primary" :underline="false">《用户协议》</el-link>
                和
                <el-link type="primary" :underline="false">《隐私政策》</el-link>
              </el-checkbox>
            </el-form-item>

            <el-button
              type="primary"
              class="register-button"
              :loading="authStore.isLoading"
              @click="handleRegister"
            >
              {{ authStore.isLoading ? '注册中...' : '注册' }}
            </el-button>
          </el-form>

          <div class="form-footer">
            <span>已有账户？</span>
            <el-link type="primary" :underline="false" @click="goToLogin">
              立即登录
            </el-link>
          </div>

          <!-- 第三方注册 -->
          <div class="social-register">
            <div class="divider">
              <span>或者</span>
            </div>
            <div class="social-buttons">
              <el-button class="social-button" @click="handleSocialRegister('github')">
                <el-icon><Platform /></el-icon>
                GitHub
              </el-button>
              <el-button class="social-button" @click="handleSocialRegister('google')">
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
 * 注册页面组件
 * 提供用户注册功能，包括表单验证、协议确认、第三方注册等
 */
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/authStore'
import { 
  Star, 
  Lightning, 
  Trophy, 
  Platform, 
  ChromeFilled 
} from '@element-plus/icons-vue'

const router = useRouter()
const authStore = useAuthStore()

// 表单引用
const registerFormRef = ref(null)

// 注册表单数据
const registerForm = reactive({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agreement: false
})

// 自定义验证函数
const validateConfirmPassword = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请确认密码'))
  } else if (value !== registerForm.password) {
    callback(new Error('两次输入的密码不一致'))
  } else {
    callback()
  }
}

const validateAgreement = (rule, value, callback) => {
  if (!value) {
    callback(new Error('请阅读并同意用户协议和隐私政策'))
  } else {
    callback()
  }
}

// 表单验证规则
const registerRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' },
    { pattern: /^[a-zA-Z0-9_\u4e00-\u9fa5]+$/, message: '用户名只能包含字母、数字、下划线和中文', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    { pattern: /^(?=.*[a-zA-Z])(?=.*\d)/, message: '密码必须包含字母和数字', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, validator: validateConfirmPassword, trigger: 'blur' }
  ],
  agreement: [
    { validator: validateAgreement, trigger: 'change' }
  ]
}

/**
 * 处理注册
 */
const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    // 表单验证
    await registerFormRef.value.validate()
    
    // 使用模拟注册进行测试
    await authStore.simulateRegister(registerForm)

    ElMessage.success('注册成功，已自动登录')
    
    // 跳转到首页
    router.push('/')
    
  } catch (error) {
    if (error !== false) { // 不是表单验证错误
      console.error('注册失败:', error)
      ElMessage.error(error.message || '注册失败，请稍后重试')
    }
  }
}



/**
 * 跳转到登录页面
 */
const goToLogin = () => {
  router.push('/login')
}

/**
 * 处理第三方注册
 * @param {string} provider - 注册提供商 (github, google)
 */
const handleSocialRegister = (provider) => {
  ElMessage.info(`${provider} 注册功能开发中...`)
}
</script>

<style scoped>
.register-page {
  min-height: 100vh;
  background: #f8f9fa;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.register-container {
  width: 100%;
  max-width: 1000px;
  background: #ffffff;
  border-radius: 20px;
  box-shadow: none;
  border: 1px solid #dee2e6;
  overflow: hidden;
  display: flex;
  min-height: 700px;
}

/* 左侧装饰区域 */
.register-decoration {
  flex: 1;
  background: #343a40;
  color: #f8f9fa;
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
  color: #e9ecef;
}

.brand-subtitle {
  font-size: 1.2rem;
  margin-bottom: 40px;
  color: #adb5bd;
}

.benefit-list {
  display: flex;
  flex-direction: column;
  gap: 24px;
  text-align: left;
}

.benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
}

.benefit-item .el-icon {
  font-size: 1.8rem;
  margin-top: 4px;
  color: #ffd700;
}

.benefit-item h4 {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  font-weight: 600;
}

.benefit-item p {
  margin: 0;
  opacity: 0.8;
  font-size: 0.9rem;
}

/* 右侧表单区域 */
.register-form-section {
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

.register-form {
  margin-bottom: 30px;
}

.register-form .el-form-item {
  margin-bottom: 20px;
}

.register-form .el-form-item:last-of-type {
  margin-bottom: 30px;
}

.register-button {
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

/* 第三方注册 */
.social-register {
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
  background: #ffffff;
  padding: 0 20px;
  color: #adb5bd;
  font-size: 0.9rem;
}

.social-buttons {
  display: flex;
  gap: 12px;
}

.social-button {
  flex: 1;
  height: 44px;
  border: 1px solid #dee2e6;
  background: #ffffff;
  color: #6c757d;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border-radius: 8px;
  transition: all 0.3s;
}

.social-button:hover {
  border-color: #495057;
  color: #495057;
}

/* 协议链接样式 */
.register-form .el-checkbox .el-link {
  margin: 0 4px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .register-container {
    flex-direction: column;
    max-width: 400px;
    margin: 20px;
  }

  .register-decoration {
    padding: 40px 20px;
  }

  .brand-title {
    font-size: 2rem;
  }

  .benefit-list {
    gap: 16px;
  }

  .benefit-item {
    flex-direction: column;
    text-align: center;
    gap: 8px;
  }

  .register-form-section {
    padding: 40px 20px;
  }
}
</style>