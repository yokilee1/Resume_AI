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
        <!-- 左侧：个人信息卡片 -->
        <div class="left-section">
          <!-- 用户概览卡片 -->
          <el-card class="user-overview-card" shadow="hover">
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
                  <BlackButton size="small" class="upload-btn">
                    <el-icon><camera /></el-icon>
                    更换头像
                  </BlackButton>
                </el-upload>
              </div>
              <div class="user-info">
                <h2>{{ userForm.username }}</h2>
                <p class="profession">{{ userForm.profession || '未设置职业' }}</p>
                <p class="location">
                  <el-icon><location /></el-icon>
                  {{ formatLocation(userForm.location) }}
                </p>
                <div class="user-stats">
                  <div class="stat-item">
                    <span class="stat-number">{{ userStats.resumeCount }}</span>
                    <span class="stat-label">简历数量</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ userStats.matchCount }}</span>
                    <span class="stat-label">匹配次数</span>
                  </div>
                  <div class="stat-item">
                    <span class="stat-number">{{ userStats.loginDays }}</span>
                    <span class="stat-label">登录天数</span>
                  </div>
                </div>
              </div>
            </div>
          </el-card>


        </div>

        <!-- 右侧：详细信息表单 -->
        <div class="right-section">
          <!-- 基本信息卡片 -->
          <el-card class="profile-form-card" shadow="hover">
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
                    <el-select v-model="userForm.experience" placeholder="请选择工作年限">
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
                <BlackButton @click="saveProfile" :loading="saving">
                  <el-icon><check /></el-icon>
                  保存修改
                </BlackButton>
                <el-button @click="resetForm">
                  <el-icon><refresh /></el-icon>
                  重置
                </el-button>
              </el-form-item>
            </el-form>
          </el-card>

          <!-- 账号安全卡片 -->
          <el-card class="security-card" shadow="hover">
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
                <BlackButton size="small" @click="showPasswordDialog = true">
                  修改密码
                </BlackButton>
              </div>
              
              <div class="security-item">
                <div class="security-info">
                  <el-icon class="security-icon"><iphone /></el-icon>
                  <div class="security-text">
                    <h4>手机绑定</h4>
                    <p>{{ userForm.phone || '未绑定手机号' }}</p>
                  </div>
                </div>
                <el-tag :type="userForm.phone ? 'success' : 'info'">
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
                <el-tag :type="userForm.email ? 'success' : 'info'">
                  {{ userForm.email ? '已绑定' : '未绑定' }}
                </el-tag>
              </div>
            </div>
          </el-card>
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
          <el-button @click="handlePasswordDialogClose">取消</el-button>
          <BlackButton @click="changePassword" :loading="changingPassword">
            确认修改
          </BlackButton>
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

<style scoped>
.user-profile {
  min-height: 100vh;
  background: #f8fafc;
  padding: 20px;
}

.profile-container {
  max-width: 1200px;
  margin: 0 auto;
}

/* 页面标题 */
.page-header {
  text-align: center;
  margin-bottom: 40px;
  color: #2c3e50;
}

.page-header h1 {
  font-size: 2.5rem;
  font-weight: 300;
  margin: 0 0 10px 0;
}

.page-header p {
  font-size: 1.1rem;
  opacity: 0.9;
  margin: 0;
}

/* 主要内容区域 */
.profile-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 30px;
  align-items: start;
}

/* 左侧区域 */
.left-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  height: 100%;
}

/* 用户概览卡片 */
.user-overview-card {
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: none;
  height: 100%;
}

.user-overview {
  padding: 30px;
  text-align: center;
}

.avatar-section {
  margin-bottom: 20px;
}

.user-avatar {
  margin-bottom: 15px;
  border: 4px solid #f0f0f0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.avatar-uploader {
  display: block;
}

.upload-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 auto;
}

.user-info h2 {
  margin: 0 0 8px 0;
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
}

.profession {
  color: #7f8c8d;
  font-size: 1rem;
  margin: 0 0 8px 0;
}

.location {
  color: #95a5a6;
  font-size: 0.9rem;
  margin: 0 0 20px 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.user-stats {
  display: flex;
  justify-content: space-around;
  padding-top: 20px;
  border-top: 1px solid #ecf0f1;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: #3498db;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 0.8rem;
  color: #7f8c8d;
}



/* 右侧区域 */
.right-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 表单卡片 */
.profile-form-card,
.security-card {
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border: none;
}

.card-header {
  padding: 25px 25px 0 25px;
  border: none;
  margin-bottom: 20px;
}

.card-header h3 {
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2c3e50;
}

.profile-form-card :deep(.el-card__body) {
  padding: 0 25px 25px 25px;
}

.security-card :deep(.el-card__body) {
  padding: 0 25px 25px 25px;
}

/* 表单样式 */
.profile-form-card :deep(.el-form-item) {
  margin-bottom: 20px;
}

.profile-form-card :deep(.el-form-item__label) {
  font-weight: 500;
  color: #2c3e50;
}

.profile-form-card :deep(.el-input__wrapper) {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.profile-form-card :deep(.el-select) {
  width: 100%;
}

.profile-form-card :deep(.el-textarea__inner) {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

/* 安全设置 */
.security-items {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.security-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  transition: all 0.3s ease;
}

.security-item:hover {
  background: #f1f3f4;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.security-info {
  display: flex;
  align-items: center;
  gap: 15px;
  flex: 1;
}

.security-icon {
  font-size: 24px;
  color: #6c757d;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.security-text h4 {
  margin: 0 0 4px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #2c3e50;
}

.security-text p {
  margin: 0;
  font-size: 0.9rem;
  color: #6c757d;
}

/* 对话框样式 */
:deep(.el-dialog) {
  border-radius: 20px;
  overflow: hidden;
}

:deep(.el-dialog__header) {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px 25px;
}

:deep(.el-dialog__title) {
  font-weight: 600;
  font-size: 1.2rem;
}

:deep(.el-dialog__body) {
  padding: 25px;
}

:deep(.el-dialog__footer) {
  padding: 0 25px 25px 25px;
  text-align: right;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .profile-content {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .left-section {
    order: 2;
  }
  
  .right-section {
    order: 1;
  }
}

@media (max-width: 768px) {
  .user-profile {
    padding: 15px;
  }
  
  .page-header h1 {
    font-size: 2rem;
  }
  
  .page-header p {
    font-size: 1rem;
  }
  
  .user-overview {
    padding: 20px;
  }
  
  .user-avatar {
    width: 100px !important;
    height: 100px !important;
  }
  
  .user-stats {
    flex-direction: column;
    gap: 15px;
    padding-top: 15px;
  }
  
  .stat-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: left;
  }
  
  .stat-number {
    font-size: 1.2rem;
    margin-bottom: 0;
  }
  

  
  .security-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
    padding: 15px;
  }
  
  .security-info {
    width: 100%;
  }
  
  .card-header {
    padding: 20px 20px 0 20px;
  }
  
  .profile-form-card :deep(.el-card__body),
  .security-card :deep(.el-card__body) {
    padding: 0 20px 20px 20px;
  }
}

@media (max-width: 480px) {
  .user-profile {
    padding: 10px;
  }
  
  .page-header {
    margin-bottom: 30px;
  }
  
  .page-header h1 {
    font-size: 1.8rem;
  }
  
  .user-overview {
    padding: 15px;
  }
  
  .user-avatar {
    width: 80px !important;
    height: 80px !important;
  }
  
  .upload-btn {
    font-size: 0.8rem;
    padding: 6px 12px;
  }
}

/* 动画效果 */
.user-overview-card,
.profile-form-card,
.security-card {
  transition: all 0.3s ease;
}

.user-overview-card:hover,
.profile-form-card:hover,
.security-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
}

/* 加载状态 */
:deep(.el-button.is-loading) {
  pointer-events: none;
}
</style>