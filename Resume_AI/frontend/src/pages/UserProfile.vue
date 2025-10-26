<template>
  <div class="user-profile">
    <div class="profile-container">
      <!-- 页面标题 -->
      <div class="page-header">
        <h1>个人中心</h1>
        <p>管理您的个人信息和账号设置</p>
      </div>

      <!-- 主要内容区域 -->
      <div class="profile-content">
        <!-- 左侧：卡片列（个人概览 + 账号安全） -->
        <div class="left-section">
          <!-- 用户概览卡片 -->
          <el-card class="user-overview-card" shadow="never">
            <div class="user-overview">
              <div class="avatar-section">
                <el-avatar :size="120" :src="userForm.avatar" class="user-avatar">
                  <el-icon size="60"><user-filled /></el-icon>
                </el-avatar>
                <el-upload
                  class="avatar-uploader"
                  action="#"
                  :show-file-list="false"
                  :auto-upload="false"
                  :on-change="handleAvatarChange"
                  accept="image/*"
                >
                  <el-button size="small" class="upload-btn">
                    <el-icon><camera /></el-icon>
                    更换头像
                  </el-button>
                </el-upload>
              </div>
              <div class="user-info">
                <h2>{{ userForm.username }}</h2>
                <p class="profession">{{ userForm.profession || '未设置职业' }}</p>
                <p class="location">
                  <el-icon><location /></el-icon>
                  {{ formatLocation(userForm.location) }}
                </p>
              </div>
            </div>
          </el-card>

          <!-- 账号安全卡片（移动至左侧以填充空白） -->
          <el-card class="security-card" shadow="never">
            <div class="card-header">
              <h3>账号安全</h3>
            </div>
            
            <div class="security-items">
              <div class="security-item">
                <div class="security-info">
                  <el-icon class="security-icon"><lock /></el-icon>
                  <div class="security-text">
                    <h4>登录密码</h4>
                    <p>定期更换密码，保护账号安全</p>
                  </div>
                </div>
                <el-button size="small" @click="showPasswordDialog = true" class="security-btn">
                  修改密码
                </el-button>
              </div>
              
              <div class="security-item">
                <div class="security-info">
                  <el-icon class="security-icon"><iphone /></el-icon>
                  <div class="security-text">
                    <h4>手机绑定</h4>
                    <p>{{ userForm.phone || '未绑定手机号' }}</p>
                  </div>
                </div>
                <el-tag :type="userForm.phone ? 'success' : 'info'" class="security-tag">
                  {{ userForm.phone ? '已绑定' : '未绑定' }}
                </el-tag>
              </div>
              
              <div class="security-item">
                <div class="security-info">
                  <el-icon class="security-icon"><message /></el-icon>
                  <div class="security-text">
                    <h4>邮箱绑定</h4>
                    <p>{{ userForm.email || '未绑定邮箱' }}</p>
                  </div>
                </div>
                <el-tag :type="userForm.email ? 'success' : 'info'" class="security-tag">
                  {{ userForm.email ? '已绑定' : '未绑定' }}
                </el-tag>
              </div>
            </div>
          </el-card>
        </div>

        <!-- 右侧：详细信息表单 -->
        <div class="right-section">
          <!-- 基本信息卡片 -->
          <el-card class="profile-form-card" shadow="never">
            <div class="card-header">
              <h3>基本信息</h3>
            </div>
            <el-form :model="userForm" label-width="120px" :rules="rules" ref="userFormRef">
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="用户名" prop="username">
                    <el-input v-model="userForm.username" placeholder="请输入用户名" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="真实姓名" prop="realName">
                    <el-input v-model="userForm.realName" placeholder="请输入真实姓名" />
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="userForm.email" placeholder="请输入邮箱地址" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="手机号" prop="phone">
                    <el-input v-model="userForm.phone" placeholder="请输入手机号" />
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-row :gutter="20">
                <el-col :span="12">
                  <el-form-item label="职业" prop="profession">
                    <el-input v-model="userForm.profession" placeholder="请输入职业" />
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="工作年限" prop="experience">
                    <el-select v-model="userForm.experience" placeholder="请选择工作年限" style="width: 100%">
                      <el-option label="应届毕业生" value="0" />
                      <el-option label="1年以下" value="1" />
                      <el-option label="1-3年" value="2" />
                      <el-option label="3-5年" value="3" />
                      <el-option label="5-10年" value="4" />
                      <el-option label="10年以上" value="5" />
                    </el-select>
                  </el-form-item>
                </el-col>
              </el-row>
              
              <el-form-item label="所在城市" prop="location">
                <el-cascader
                  v-model="userForm.location"
                  :options="locationOptions"
                  placeholder="请选择所在城市"
                  style="width: 100%"
                />
              </el-form-item>
              
              <el-form-item label="个人简介" prop="bio">
                <el-input
                  type="textarea"
                  v-model="userForm.bio"
                  :rows="4"
                  placeholder="请输入个人简介"
                  maxlength="200"
                  show-word-limit
                />
              </el-form-item>
              
              <el-form-item>
                <el-button type="primary" @click="saveProfile" :loading="saving" class="save-btn">
                  <el-icon><check /></el-icon>
                  保存修改
                </el-button>
                <el-button @click="resetForm" class="reset-btn">
                  <el-icon><refresh /></el-icon>
                  重置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 账号安全模块已移动到左侧列 -->
        </div>
      </div>
    </div>

    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="showPasswordDialog"
      title="修改密码"
      width="500px"
      :before-close="handlePasswordDialogClose"
    >
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input
            v-model="passwordForm.currentPassword"
            type="password"
            placeholder="请输入当前密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="请输入新密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="请再次输入新密码"
            show-password
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handlePasswordDialogClose" class="cancel-btn">取消</el-button>
          <el-button type="primary" @click="changePassword" :loading="changingPassword" class="confirm-btn">
            确认修改
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
/**
 * 用户个人资料页面
 * 提供用户信息管理和账号安全设置功能
 */
import { ref, reactive, computed } from 'vue';
import { 
  UserFilled, 
  Iphone, 
  Message, 
  Camera, 
  Location, 
  Check, 
  Refresh, 
  Lock 
} from '@element-plus/icons-vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import Navigation from '../components/common/Navigation.vue';
import BlackButton from '../components/ui/BlackButton.vue';

// 用户表单数据
const userFormRef = ref(null);
const userForm = reactive({
  username: 'user123',
  realName: '',
  email: 'user@example.com',
  phone: '13800138000',
  avatar: '',
  profession: '前端开发工程师',
  experience: '2',
  location: ['北京市', '北京市', '海淀区'],
  bio: ''
});

// 用户统计数据
const userStats = reactive({
  resumeCount: 3,
  matchCount: 15,
  loginDays: 28
});

// 密码表单数据
const passwordFormRef = ref(null);
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
});

// 状态管理
const showPasswordDialog = ref(false);
const saving = ref(false);
const changingPassword = ref(false);

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  realName: [
    { min: 2, max: 10, message: '真实姓名长度在 2 到 10 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ],
  profession: [
    { required: true, message: '请输入职业', trigger: 'blur' }
  ],
  bio: [
    { max: 200, message: '个人简介不能超过200个字符', trigger: 'blur' }
  ]
};

// 城市选项
const locationOptions = [
  {
    value: '北京市',
    label: '北京市',
    children: [
      {
        value: '北京市',
        label: '北京市',
        children: [
          { value: '海淀区', label: '海淀区' },
          { value: '朝阳区', label: '朝阳区' },
          { value: '东城区', label: '东城区' },
          { value: '西城区', label: '西城区' },
          { value: '丰台区', label: '丰台区' },
          { value: '石景山区', label: '石景山区' }
        ]
      }
    ]
  },
  {
    value: '上海市',
    label: '上海市',
    children: [
      {
        value: '上海市',
        label: '上海市',
        children: [
          { value: '浦东新区', label: '浦东新区' },
          { value: '黄浦区', label: '黄浦区' },
          { value: '徐汇区', label: '徐汇区' },
          { value: '长宁区', label: '长宁区' },
          { value: '静安区', label: '静安区' },
          { value: '普陀区', label: '普陀区' }
        ]
      }
    ]
  },
  {
    value: '广州市',
    label: '广州市',
    children: [
      {
        value: '广州市',
        label: '广州市',
        children: [
          { value: '天河区', label: '天河区' },
          { value: '越秀区', label: '越秀区' },
          { value: '海珠区', label: '海珠区' },
          { value: '荔湾区', label: '荔湾区' },
          { value: '白云区', label: '白云区' },
          { value: '番禺区', label: '番禺区' }
        ]
      }
    ]
  },
  {
    value: '深圳市',
    label: '深圳市',
    children: [
      {
        value: '深圳市',
        label: '深圳市',
        children: [
          { value: '南山区', label: '南山区' },
          { value: '福田区', label: '福田区' },
          { value: '罗湖区', label: '罗湖区' },
          { value: '宝安区', label: '宝安区' },
          { value: '龙岗区', label: '龙岗区' },
          { value: '盐田区', label: '盐田区' }
        ]
      }
    ]
  }
];

// 密码验证规则
const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' },
    { 
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/, 
      message: '密码必须包含大小写字母和数字', 
      trigger: 'blur' 
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
};

/**
 * 格式化位置信息显示
 * @param {Array} location - 位置数组
 * @returns {String} 格式化后的位置字符串
 */
const formatLocation = (location) => {
  if (!location || location.length === 0) {
    return '未设置位置';
  }
  return location.join(' ');
};

// 头像上传
const handleAvatarChange = (file) => {
  // 验证文件类型
  const isImage = file.raw.type.startsWith('image/');
  if (!isImage) {
    ElMessage.error('只能上传图片文件');
    return;
  }

  // 验证文件大小（限制为2MB）
  const isLt2M = file.raw.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    userForm.avatar = e.target.result;
    ElMessage.success('头像上传成功');
  };
  reader.readAsDataURL(file.raw);
};

// 保存个人资料
const saveProfile = async () => {
  try {
    saving.value = true;
    await userFormRef.value.validate();
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    ElMessage.success('个人资料保存成功');
  } catch (error) {
    ElMessage.error('请检查表单填写是否正确');
  } finally {
    saving.value = false;
  }
};

// 重置表单
const resetForm = () => {
  ElMessageBox.confirm('确定要重置表单吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    userFormRef.value.resetFields();
    ElMessage.success('表单已重置');
  }).catch(() => {
    // 用户取消操作
  });
};

// 修改密码
const changePassword = async () => {
  try {
    changingPassword.value = true;
    await passwordFormRef.value.validate();
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    ElMessage.success('密码修改成功');
    showPasswordDialog.value = false;
    resetPasswordForm();
  } catch (error) {
    ElMessage.error('请检查密码信息');
  } finally {
    changingPassword.value = false;
  }
};

/**
 * 处理密码对话框关闭
 */
const handlePasswordDialogClose = () => {
  resetPasswordForm();
  showPasswordDialog.value = false;
};

/**
 * 重置密码表单
 */
const resetPasswordForm = () => {
  passwordForm.currentPassword = '';
  passwordForm.newPassword = '';
  passwordForm.confirmPassword = '';
  if (passwordFormRef.value) {
    passwordFormRef.value.clearValidate();
  }
};
</script>

<style scoped lang="scss">

/**
 * 主容器布局优化
 * 采用现代化的网格布局，提升视觉层次
 */
.user-profile {
  min-height: 100vh;
  padding: var(--profile-spacing-xl);
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  /* 局部CSS变量：颜色与间距体系 */
  --profile-primary: #2c3e50;
  --profile-secondary: #4b79a1;
  --profile-accent: #3498db;
  --profile-success: #27ae60;
  --profile-muted: #6b7280;
  --profile-border: #e5e7eb;
  --profile-light: #f9fafb;
  --profile-shadow: rgba(0,0,0,0.08);
  --profile-radius: 12px;
  --profile-radius-lg: 16px;
  --profile-spacing-xs: 4px;
  --profile-spacing-sm: 8px;
  --profile-spacing: 12px;
  --profile-spacing-md: 16px;
  --profile-spacing-lg: 24px;
  --profile-spacing-xl: 32px;
}

.profile-container {
  max-width: 1400px;
  margin: 0 auto;
}

/**
 * 页面标题区域重新设计
 * 增强视觉冲击力和层次感
 */
.page-header {
  text-align: center;
  margin-bottom: var(--profile-spacing-xl);
  padding: var(--profile-spacing-xl) 0;
  background: #343a40;
}
.page-header h1, .page-header p {
  color: #ffffff;
}

/* 主内容两列间距微调，收敛整体视觉空隙 */
.profile-content {
  gap: var(--profile-spacing-lg);
}

/* 账号安全模块的文字与间距优化 */
.security-items {
  display: flex;
  flex-direction: column;
  gap: var(--profile-spacing-md);
}
.security-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--profile-spacing-md) var(--profile-spacing-lg);
  background: #ffffff;
  border: 1px solid var(--profile-border);
  border-radius: var(--profile-radius);
}
.security-icon {
  color: var(--profile-primary);
}
.security-text h4 {
  margin: 0 0 var(--profile-spacing-xs);
  color: var(--profile-primary);
  font-weight: 600;
}
.security-text p {
  margin: 0;
  color: var(--profile-muted);
}

/* 卡片主体内边距统一，避免文本贴边影响可读性 */
.profile-form-card :deep(.el-card__body),
.security-card :deep(.el-card__body) {
  padding: var(--profile-spacing-xl);
}

/* 表单标签与输入框的对比度补强 */
.profile-form-card :deep(.el-form-item__label) { color: var(--profile-primary); }
.profile-form-card :deep(.el-input__inner),
.profile-form-card :deep(.el-textarea__inner) { color: var(--profile-primary); }
.profile-form-card :deep(.el-input__inner::placeholder),
.profile-form-card :deep(.el-textarea__inner::placeholder) { color: var(--profile-muted); }

/**
 * 主内容区域优化
 * 采用更合理的网格分配和间距
 */
.profile-content {
  display: grid;
  grid-template-columns: 400px 1fr;
  gap: var(--profile-spacing-lg);
  align-items: start;
}

/**
 * 左侧个人信息卡片优化
 * 增强视觉吸引力和信息层次
 */
.user-overview-card {
  border-radius: var(--profile-radius-lg);
  box-shadow: 0 12px 48px var(--profile-shadow);
  border: none;
  overflow: hidden;
  background: #fff;
}

.user-overview {
  padding: var(--profile-spacing-xl);
  text-align: center;
  background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
  position: relative;
}

.user-overview::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--profile-accent), var(--profile-success));
}

/**
 * 头像区域优化
 * 增加视觉焦点和交互反馈
 */
.avatar-section {
  margin-bottom: var(--profile-spacing-lg);
  position: relative;
}

.user-avatar {
  border: 4px solid white;
  box-shadow: 0 8px 24px var(--profile-shadow);
  transition: all 0.3s ease;
}

.user-avatar:hover {
  transform: scale(1.05);
  box-shadow: 0 12px 32px rgba(52, 152, 219, 0.3);
}

.avatar-uploader {
  margin-top: var(--profile-spacing);
}

.upload-btn {
  background: var(--profile-accent);
  border: none;
  border-radius: var(--profile-radius);
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
}

.upload-btn:hover {
  background: #2980b9;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.4);
}

/**
 * 用户信息区域优化
 * 提升信息可读性和视觉层次
 */
.user-info h2 {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--profile-primary);
  margin-bottom: 0.5rem;
}

.profession {
  font-size: 1.1rem;
  color: var(--profile-accent);
  font-weight: 500;
  margin-bottom: 0.5rem;
}

.location {
  color: var(--profile-muted);
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: var(--profile-spacing-lg);
}

/**
 * 统计数据模块重新设计
 * 采用现代化卡片布局，增强数据可视化
 */
/**
 * 统计数据模块优化
 * 增强数据可视化效果
 */
.user-stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--profile-spacing-lg);
  margin-top: var(--profile-spacing-xl);
  padding: var(--profile-spacing-lg);
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(248, 250, 252, 0.9) 100%);
  border-radius: var(--profile-radius-lg);
  border: 1px solid rgba(226, 232, 240, 0.8);
  backdrop-filter: blur(10px);
}

.stat-item {
  text-align: center;
  padding: var(--profile-spacing-lg);
  background: white;
  border-radius: var(--profile-radius);
  border: 1px solid var(--profile-border);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, var(--profile-accent) 0%, var(--profile-success) 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.stat-item:hover::before {
  transform: scaleX(1);
}

.stat-item:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  border-color: var(--profile-accent);
}

.stat-item:nth-child(1)::before {
  background: linear-gradient(90deg, #3498db 0%, #2980b9 100%);
}

.stat-item:nth-child(2)::before {
  background: linear-gradient(90deg, #27ae60 0%, #229954 100%);
}

.stat-item:nth-child(3)::before {
  background: linear-gradient(90deg, #e74c3c 0%, #c0392b 100%);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--profile-primary);
  margin-bottom: var(--profile-spacing-sm);
  background: linear-gradient(135deg, var(--profile-primary) 0%, var(--profile-accent) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--profile-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/**
 * 统计数据动画效果
 */
@keyframes countUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stat-item {
  animation: countUp 0.6s ease-out;
}

.stat-item:nth-child(1) {
  animation-delay: 0.1s;
}

.stat-item:nth-child(2) {
  animation-delay: 0.2s;
}

.stat-item:nth-child(3) {
  animation-delay: 0.3s;
}

/**
 * 统计数据响应式设计
 */
@media (max-width: 768px) {
  .user-stats {
    grid-template-columns: 1fr;
    gap: var(--profile-spacing-md);
    padding: var(--profile-spacing-md);
  }
  
  .stat-number {
    font-size: 2rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .user-stats {
    margin-top: var(--profile-spacing-lg);
    padding: var(--profile-spacing-sm);
  }
  
  .stat-item {
    padding: var(--profile-spacing-md);
  }
  
  .stat-number {
    font-size: 1.8rem;
  }
}

/**
 * 右侧卡片区域优化
 * 统一卡片样式和间距
 */
.left-section,
.right-section {
  display: flex;
  flex-direction: column;
  gap: var(--profile-spacing-lg);
}

.profile-form-card,
.security-card {
  border-radius: var(--profile-radius-lg);
  box-shadow: 0 8px 32px var(--profile-shadow);
  border: none;
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative; /* 建立局部层叠上下文 */
  z-index: 1; /* 低于sticky的user-overview-card */
}

.profile-form-card:hover,
.security-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.15);
}

/**
 * 卡片标题优化
 * 增强视觉层次和品牌一致性
 */
.card-header {
  background: #343a40;
  color: white;
  padding: var(--profile-spacing-lg);
  position: relative;
}

.card-header::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
}

.card-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: white;
}

/**
 * 表单样式优化
 * 提升用户输入体验
 */
.profile-form-card :deep(.el-card__body) {
  padding: var(--profile-spacing-xl);
}

.profile-form-card :deep(.el-form-item__label) {
  font-weight: 600;
  color: var(--profile-primary);
  font-size: 0.95rem;
}

.profile-form-card :deep(.el-input__wrapper) {
  border-radius: var(--profile-radius);
  box-shadow: none;
  border: 2px solid var(--profile-border);
  transition: all 0.3s ease;
}

.profile-form-card :deep(.el-input__wrapper:hover) {
  border-color: var(--profile-accent);
}

.profile-form-card :deep(.el-input__wrapper.is-focus) {
  border-color: var(--profile-accent);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.profile-form-card :deep(.el-textarea__inner) {
  border-radius: var(--profile-radius);
  box-shadow: none;
  border: 2px solid var(--profile-border);
  transition: all 0.3s ease;
}

.profile-form-card :deep(.el-textarea__inner:hover) {
  border-color: var(--profile-accent);
}

.profile-form-card :deep(.el-textarea__inner:focus) {
  border-color: var(--profile-accent);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

/**
 * 表单项间距优化
 */
.profile-form-card :deep(.el-form-item) {
  margin-bottom: var(--profile-spacing-lg);
}

.profile-form-card :deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

/**
 * 对话框表单样式
 */
:deep(.el-dialog .el-form-item) {
  margin-bottom: var(--profile-spacing-lg);
}

:deep(.el-dialog .el-input__wrapper) {
  border-radius: var(--profile-radius);
  border: 2px solid var(--profile-border);
  transition: all 0.3s ease;
}

:deep(.el-dialog .el-input__wrapper:hover) {
  border-color: var(--profile-accent);
}

:deep(.el-dialog .el-input__wrapper.is-focus) {
  border-color: var(--profile-accent);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

/**
 * 表单字段统一样式优化
 * 提升表单交互体验和视觉一致性
 */
.profile-form-card :deep(.el-form) {
  display: grid;
  gap: var(--profile-spacing-lg);
}

.profile-form-card :deep(.el-form-item) {
  margin-bottom: 0;
  display: flex;
  flex-direction: column;
  gap: var(--profile-spacing-sm);
}

.profile-form-card :deep(.el-form-item__label) {
  font-weight: 600;
  color: var(--profile-primary);
  font-size: 0.875rem;
  line-height: 1.5;
  margin-bottom: 0;
  padding: 0;
  text-align: left;
  position: relative;
}

.profile-form-card :deep(.el-form-item__label::after) {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, var(--profile-accent) 0%, var(--profile-success) 100%);
  transition: width 0.3s ease;
}

.profile-form-card :deep(.el-form-item.is-focus .el-form-item__label::after) {
  width: 100%;
}

.profile-form-card :deep(.el-form-item__content) {
  margin-left: 0 !important;
  flex: 1;
}

/**
 * 输入框统一样式
 */
.profile-form-card :deep(.el-input__wrapper) {
  border-radius: var(--profile-radius);
  border: 2px solid var(--profile-border);
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  padding: 12px 16px;
  min-height: 48px;
}

.profile-form-card :deep(.el-input__wrapper:hover) {
  border-color: var(--profile-accent);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.1);
}

.profile-form-card :deep(.el-input__wrapper.is-focus) {
  border-color: var(--profile-accent);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  transform: translateY(-1px);
}

.profile-form-card :deep(.el-input__inner) {
  font-size: 0.875rem;
  color: var(--profile-primary);
  font-weight: 500;
  border: none;
  padding: 0;
  height: auto;
}

.profile-form-card :deep(.el-input__inner::placeholder) {
  color: var(--profile-muted);
  font-weight: 400;
}

/**
 * 文本域样式
 */
.profile-form-card :deep(.el-textarea__inner) {
  border-radius: var(--profile-radius);
  border: 2px solid var(--profile-border);
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.02);
  padding: 16px;
  font-size: 0.875rem;
  color: var(--profile-primary);
  font-weight: 500;
  resize: vertical;
  min-height: 120px;
}

.profile-form-card :deep(.el-textarea__inner:hover) {
  border-color: var(--profile-accent);
  box-shadow: 0 4px 8px rgba(52, 152, 219, 0.1);
}

.profile-form-card :deep(.el-textarea__inner:focus) {
  border-color: var(--profile-accent);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  transform: translateY(-1px);
}

.profile-form-card :deep(.el-textarea__inner::placeholder) {
  color: var(--profile-muted);
  font-weight: 400;
}

/**
 * 选择器样式统一
 */
.profile-form-card :deep(.el-select) {
  width: 100%;
}

.profile-form-card :deep(.el-select .el-input__wrapper) {
  cursor: pointer;
}

.profile-form-card :deep(.el-select .el-input__suffix) {
  color: var(--profile-muted);
}

.profile-form-card :deep(.el-cascader) {
  width: 100%;
}

.profile-form-card :deep(.el-cascader .el-input__wrapper) {
  cursor: pointer;
}

/**
 * 表单按钮区域优化
 */
.profile-form-card :deep(.el-form-item:last-child) {
  margin-top: var(--profile-spacing-xl);
  padding-top: var(--profile-spacing-lg);
  border-top: 1px solid var(--profile-border);
}

.profile-form-card :deep(.el-form-item:last-child .el-form-item__content) {
  display: flex;
  gap: var(--profile-spacing-md);
  justify-content: flex-end;
}

/**
 * 表单验证样式
 */
.profile-form-card :deep(.el-form-item.is-error .el-input__wrapper) {
  border-color: var(--profile-danger);
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.profile-form-card :deep(.el-form-item.is-error .el-textarea__inner) {
  border-color: var(--profile-danger);
  box-shadow: 0 0 0 3px rgba(231, 76, 60, 0.1);
}

.profile-form-card :deep(.el-form-item__error) {
  color: var(--profile-danger);
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: var(--profile-spacing-xs);
  padding-left: var(--profile-spacing-sm);
}

/**
 * 表单成功状态
 */
.profile-form-card :deep(.el-form-item.is-success .el-input__wrapper) {
  border-color: var(--profile-success);
  box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
}

.profile-form-card :deep(.el-form-item.is-success .el-textarea__inner) {
  border-color: var(--profile-success);
  box-shadow: 0 0 0 3px rgba(39, 174, 96, 0.1);
}

/**
 * 表单响应式设计
 */
@media (max-width: 768px) {
  .profile-form-card :deep(.el-form) {
    gap: var(--profile-spacing-md);
  }
  
  .profile-form-card :deep(.el-input__wrapper) {
    padding: 10px 14px;
    min-height: 44px;
  }
  
  .profile-form-card :deep(.el-textarea__inner) {
    padding: 14px;
    min-height: 100px;
  }
  
  .profile-form-card :deep(.el-form-item:last-child .el-form-item__content) {
    flex-direction: column;
  }
}

@media (max-width: 480px) {
  .profile-form-card :deep(.el-form) {
    gap: var(--profile-spacing-sm);
  }
  
  .profile-form-card :deep(.el-input__wrapper) {
    padding: 8px 12px;
    min-height: 40px;
  }
  
  .profile-form-card :deep(.el-textarea__inner) {
    padding: 12px;
    min-height: 80px;
  }
}

/**
 * 响应式布局全面优化
 * 确保在各种设备上的最佳体验
 */

/* 大屏幕设备 (1200px+) */
@media (min-width: 1200px) {
  .profile-container {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .main-content {
    gap: var(--profile-spacing-xxl);
  }
  
  .left-panel {
    min-width: 350px;
  }
  
  .right-panel {
    flex: 1;
    max-width: 800px;
  }
}

/* 中等屏幕设备 (768px - 1199px) */
@media (max-width: 1199px) and (min-width: 769px) {
  .profile-container {
    padding: var(--profile-spacing-lg);
  }
  
  .main-content {
    gap: var(--profile-spacing-lg);
  }
  
  .left-panel {
    min-width: 300px;
  }
  
  .user-avatar {
    width: 100px;
    height: 100px;
  }
  
  .user-name {
    font-size: 1.4rem;
  }
  
  .user-title {
    font-size: 0.9rem;
  }
}

/* 平板设备 (768px) */
@media (max-width: 768px) {
  .user-profile {
    padding: var(--profile-spacing-md);
  }
  
  .profile-container {
    padding: 0;
  }
  
  .page-header {
    padding: var(--profile-spacing-lg) 0;
    text-align: center;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .page-subtitle {
    font-size: 0.9rem;
  }
  
  .main-content {
    flex-direction: column;
    gap: var(--profile-spacing-lg);
  }
  
  .left-panel,
  .right-panel {
    width: 100%;
    min-width: unset;
  }
  
  .user-info-card {
    text-align: center;
  }
  
  .user-avatar {
    width: 120px;
    height: 120px;
    margin: 0 auto var(--profile-spacing-lg);
  }
  
  .user-details {
    align-items: center;
  }
  
  .user-name {
    font-size: 1.6rem;
  }
  
  .user-title {
    font-size: 1rem;
  }
  
  .user-stats {
    grid-template-columns: repeat(3, 1fr);
    gap: var(--profile-spacing-sm);
    margin-top: var(--profile-spacing-lg);
  }
  
  .stat-item {
    padding: var(--profile-spacing-md);
  }
  
  .stat-number {
    font-size: 1.8rem;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
  
  .profile-form-card,
  .security-card {
    margin-bottom: var(--profile-spacing-lg);
  }
  
  .card-header {
    padding: var(--profile-spacing-lg);
  }
  
  .card-title {
    font-size: 1.2rem;
  }
}

/* 小屏幕设备 (480px - 767px) */
@media (max-width: 767px) and (min-width: 481px) {
  .user-stats {
    grid-template-columns: 1fr;
    gap: var(--profile-spacing-sm);
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    padding: var(--profile-spacing-md) var(--profile-spacing-lg);
  }
  
  .stat-number {
    font-size: 1.5rem;
    margin-bottom: 0;
  }
  
  .stat-label {
    font-size: 0.8rem;
  }
}

/* 超小屏幕设备 (480px以下) */
@media (max-width: 480px) {
  .user-profile {
    padding: var(--profile-spacing-sm);
  }
  
  .page-header {
    padding: var(--profile-spacing-md) 0;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
  
  .page-subtitle {
    font-size: 0.8rem;
  }
  
  .main-content {
    gap: var(--profile-spacing-md);
  }
  
  .user-info-card,
  .profile-form-card,
  .security-card {
    margin-bottom: var(--profile-spacing-md);
    border-radius: var(--profile-radius);
  }
  
  .user-avatar {
    width: 100px;
    height: 100px;
  }
  
  .user-name {
    font-size: 1.4rem;
  }
  
  .user-title {
    font-size: 0.9rem;
  }
  
  .user-stats {
    grid-template-columns: 1fr;
    gap: var(--profile-spacing-xs);
    margin-top: var(--profile-spacing-md);
    padding: var(--profile-spacing-md);
  }
  
  .stat-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    text-align: left;
    padding: var(--profile-spacing-sm) var(--profile-spacing-md);
  }
  
  .stat-number {
    font-size: 1.3rem;
    margin-bottom: 0;
  }
  
  .stat-label {
    font-size: 0.75rem;
  }
  
  .card-header {
    padding: var(--profile-spacing-md);
  }
  
  .card-title {
    font-size: 1.1rem;
  }
  
  .profile-form-card :deep(.el-card__body),
  .security-card :deep(.el-card__body) {
    padding: var(--profile-spacing-md);
  }
  
  .save-btn,
  .reset-btn,
  .security-btn,
  .confirm-btn,
  .cancel-btn {
    width: 100%;
    margin-bottom: var(--profile-spacing-xs);
  }
  
  .profile-form-card :deep(.el-form-item:last-child .el-form-item__content) {
    flex-direction: column;
    gap: var(--profile-spacing-xs);
  }
}

/* 超宽屏幕设备 (1400px+) */
@media (min-width: 1400px) {
  .profile-container {
    max-width: 1400px;
  }
  
  .main-content {
    gap: 3rem;
  }
  
  .left-panel {
    min-width: 400px;
  }
  
  .user-avatar {
    width: 140px;
    height: 140px;
  }
  
  .user-name {
    font-size: 2rem;
  }
  
  .user-title {
    font-size: 1.1rem;
  }
  
  .stat-number {
    font-size: 3rem;
  }
  
  .stat-label {
    font-size: 1rem;
  }
}

/* 横屏模式优化 */
@media (orientation: landscape) and (max-height: 600px) {
  .user-profile {
    padding: var(--profile-spacing-sm);
  }
  
  .page-header {
    padding: var(--profile-spacing-sm) 0;
  }
  
  .main-content {
    gap: var(--profile-spacing-md);
  }
  
  .user-info-card,
  .profile-form-card,
  .security-card {
    margin-bottom: var(--profile-spacing-sm);
  }
  
  .user-avatar {
    width: 80px;
    height: 80px;
  }
  
  .user-stats {
    margin-top: var(--profile-spacing-sm);
  }
  
  .stat-item {
    padding: var(--profile-spacing-sm);
  }
}

/* 高分辨率屏幕优化 */
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .user-avatar {
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
  }
  
  .stat-item::before {
    height: 3px;
  }
}

/* 打印样式 */
@media print {
  .user-profile {
    background: white;
    color: black;
    padding: 0;
  }
  
  .page-header {
    border-bottom: 2px solid #000;
    margin-bottom: 20px;
  }
  
  .main-content {
    flex-direction: column;
    gap: 20px;
  }
  
  .user-info-card,
  .profile-form-card,
  .security-card {
    border: 1px solid #000;
    box-shadow: none;
    page-break-inside: avoid;
  }
  
  .save-btn,
  .reset-btn,
  .security-btn {
    display: none;
  }
}

/* 减少动画的用户偏好 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* 高对比度模式 */
@media (prefers-contrast: high) {
  .user-info-card,
  .profile-form-card,
  .security-card {
    border: 2px solid #000;
  }
  
  .profile-form-card :deep(.el-input__wrapper),
  .profile-form-card :deep(.el-textarea__inner) {
    border: 2px solid #000;
  }
  
  .save-btn,
  .confirm-btn {
    background: #000;
    color: #fff;
    border: 2px solid #000;
  }
  
  .reset-btn,
  .cancel-btn {
    background: #fff;
    color: #000;
    border: 2px solid #000;
  }
}

.stat-item,
.security-item {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/**
 * 加载状态优化
 * 提供清晰的视觉反馈
 */
:deep(.el-button.is-loading) {
  pointer-events: none;
  opacity: 0.7;
}

/**
 * 焦点状态优化
 * 提升可访问性
 */
.upload-btn:focus,
:deep(.el-button:focus) {
  outline: 2px solid var(--profile-accent);
  outline-offset: 2px;
}

/**
 * 滚动条样式优化
 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--profile-light);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: var(--profile-border);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--profile-muted);
}

/**
 * 按钮样式优化
 * 统一按钮设计语言
 */
.save-btn,
.confirm-btn {
  background: linear-gradient(135deg, var(--profile-accent) 0%, #2980b9 100%);
  border: none;
  border-radius: var(--profile-radius);
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(52, 152, 219, 0.3);
}

.save-btn:hover,
.confirm-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(52, 152, 219, 0.4);
}

.reset-btn,
.cancel-btn {
  background: var(--profile-light);
  border: 2px solid var(--profile-border);
  border-radius: var(--profile-radius);
  color: var(--profile-primary);
  font-weight: 500;
  transition: all 0.3s ease;
}

.reset-btn:hover,
.cancel-btn:hover {
  background: white;
  border-color: var(--profile-accent);
  color: var(--profile-accent);
  transform: translateY(-1px);
}

.security-btn {
  background: linear-gradient(135deg, var(--profile-success) 0%, #229954 100%);
  border: none;
  border-radius: var(--profile-radius);
  color: white;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(39, 174, 96, 0.3);
}

.security-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(39, 174, 96, 0.4);
}

/**
 * 标签样式优化
 * 增强视觉识别度
 */
.security-tag {
  border-radius: var(--profile-radius);
  font-weight: 500;
  padding: 6px 12px;
  border: none;
}

.security-tag.el-tag--success {
  background: linear-gradient(135deg, var(--profile-success) 0%, #229954 100%);
  color: white;
}

.security-tag.el-tag--info {
  background: linear-gradient(135deg, var(--profile-muted) 0%, #6c757d 100%);
  color: white;
}

/**
 * 表单元素样式增强
 * 提升输入体验
 */
.profile-form-card :deep(.el-select .el-input__wrapper) {
  border-radius: var(--profile-radius);
  border: 2px solid var(--profile-border);
  transition: all 0.3s ease;
}

.profile-form-card :deep(.el-select .el-input__wrapper:hover) {
  border-color: var(--profile-accent);
}

.profile-form-card :deep(.el-select .el-input__wrapper.is-focus) {
  border-color: var(--profile-accent);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.profile-form-card :deep(.el-cascader .el-input__wrapper) {
  border-radius: var(--profile-radius);
  border: 2px solid var(--profile-border);
  transition: all 0.3s ease;
}

.profile-form-card :deep(.el-cascader .el-input__wrapper:hover) {
  border-color: var(--profile-accent);
}

.profile-form-card :deep(.el-cascader .el-input__wrapper.is-focus) {
  border-color: var(--profile-accent);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

/**
 * 表单项间距优化
 */
.profile-form-card :deep(.el-form-item) {
  margin-bottom: var(--profile-spacing-lg);
}

.profile-form-card :deep(.el-form-item:last-child) {
  margin-bottom: 0;
}

/**
 * 对话框表单样式
 */
:deep(.el-dialog .el-form-item) {
  margin-bottom: var(--profile-spacing-lg);
}

:deep(.el-dialog .el-input__wrapper) {
  border-radius: var(--profile-radius);
  border: 2px solid var(--profile-border);
  transition: all 0.3s ease;
}

:deep(.el-dialog .el-input__wrapper:hover) {
  border-color: var(--profile-accent);
}

:deep(.el-dialog .el-input__wrapper.is-focus) {
  border-color: var(--profile-accent);
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}
</style>