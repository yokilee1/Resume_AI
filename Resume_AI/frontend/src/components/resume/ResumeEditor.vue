<template>
  <div class="resume-editor">
    <!-- 基本信息卡片 -->
    <div class="card-section" :class="{ expanded: expandedSections.basicInfo }">
      <div class="card-header" @click="toggleSection('basicInfo')">
        <span class="section-title">基本信息</span>
        <i class="expand-icon" :class="expandedSections.basicInfo ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
      </div>
      <div class="card-content" v-show="expandedSections.basicInfo">
        <el-form :model="basicInfo" label-position="left" label-width="60px">
          <el-form-item label="姓名">
            <el-input v-model="basicInfo.name" placeholder="请输入姓名"></el-input>
          </el-form-item>
          <el-form-item label="年龄">
            <el-input v-model="basicInfo.age" placeholder="请输入年龄"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input v-model="basicInfo.phone" placeholder="请输入手机号"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="basicInfo.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="个人简介">
            <el-input type="textarea" v-model="basicInfo.introduction" :rows="5" placeholder="请输入个人简介"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <!-- 实习经历卡片 -->
    <div class="card-section" :class="{ expanded: expandedSections.internship }">
      <div class="card-header" @click="toggleSection('internship')">
        <span class="section-title">实习经历</span>
        <i class="expand-icon" :class="expandedSections.internship ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
      </div>
      <div class="card-content" v-show="expandedSections.internship">
        <div v-for="(exp, index) in experiences" :key="index" class="experience-item">
          <el-form :model="exp" label-position="left" label-width="80px">
            <el-form-item label="公司名称">
              <el-input v-model="exp.company" placeholder="请输入公司名称"></el-input>
            </el-form-item>
            <el-form-item label="职位">
              <el-input v-model="exp.position" placeholder="请输入职位"></el-input>
            </el-form-item>
            <el-form-item label="时间段">
              <el-date-picker
                v-model="exp.timeRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="工作描述">
              <el-input
                type="textarea"
                v-model="exp.description"
                placeholder="请输入工作描述"
                :rows="4">
              </el-input>
            </el-form-item>
          </el-form>
          <div class="item-actions" v-if="experiences.length > 1">
            <el-button type="danger" size="small" @click="removeExperience(index)">删除</el-button>
          </div>
        </div>
        <div class="add-item">
          <el-button type="primary" @click="addExperience">+ 添加实习经历</el-button>
        </div>
      </div>
    </div>

    <!-- 校园经历卡片 -->
    <div class="card-section" :class="{ expanded: expandedSections.education }">
      <div class="card-header" @click="toggleSection('education')">
        <span class="section-title">校园经历</span>
        <i class="expand-icon" :class="expandedSections.education ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
      </div>
      <div class="card-content" v-show="expandedSections.education">
        <div v-for="(edu, index) in education" :key="index" class="education-item">
          <el-form :model="edu" label-position="left" label-width="80px">
            <el-form-item label="学校名称">
              <el-input v-model="edu.school" placeholder="请输入学校名称"></el-input>
            </el-form-item>
            <el-form-item label="专业">
              <el-input v-model="edu.major" placeholder="请输入专业"></el-input>
            </el-form-item>
            <el-form-item label="学历">
              <el-input v-model="edu.degree" placeholder="请输入学历"></el-input>
            </el-form-item>
            <el-form-item label="时间段">
              <el-date-picker
                v-model="edu.timeRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期">
              </el-date-picker>
            </el-form-item>
          </el-form>
          <div class="item-actions" v-if="education.length > 1">
            <el-button type="danger" size="small" @click="removeEducation(index)">删除</el-button>
          </div>
        </div>
        <div class="add-item">
          <el-button type="primary" @click="addEducation">+ 添加教育经历</el-button>
        </div>
      </div>
    </div>

    <!-- 专业技能卡片 -->
    <div class="card-section" :class="{ expanded: expandedSections.skills }">
      <div class="card-header" @click="toggleSection('skills')">
        <span class="section-title">专业技能</span>
        <i class="expand-icon" :class="expandedSections.skills ? 'el-icon-arrow-up' : 'el-icon-arrow-down'"></i>
      </div>
      <div class="card-content" v-show="expandedSections.skills">
        <el-form label-position="left" label-width="80px">
          <el-form-item>
            <el-input
              type="textarea"
              v-model="skills"
              placeholder="请输入专业技能，如：熟练掌握Java、Python等编程语言"
              :rows="4">
            </el-input>
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div class="ai-actions">
      <el-button class="ai-button" @click="handleAIPolish">AI润色</el-button>
      <el-button class="ai-button" @click="handleAIEvaluate">AI评估</el-button>
    </div>
  </div>
</template>

<script setup>
/**
 * 简历编辑器组件
 * 用于编辑简历的各个部分，包括基本信息、实习经历、校园经历和专业技能
 */
import { ref, watch, onMounted } from 'vue';

// 定义props
const props = defineProps({
  basicInfo: {
    type: Object,
    default: () => ({
      name: '',
      age: '',
      phone: '',
      email: '',
      introduction: ''
    })
  },
  experiences: {
    type: Array,
    default: () => ([{
      company: '',
      position: '',
      timeRange: '',
      description: ''
    }])
  },
  education: {
    type: Array,
    default: () => ([{
      school: '',
      major: '',
      degree: '',
      timeRange: ''
    }])
  },
  skills: {
    type: String,
    default: ''
  }
});

// 定义emits
const emit = defineEmits([
  'update:basicInfo',
  'update:experiences', 
  'update:education',
  'update:skills',
  'ai-polish',
  'ai-evaluate'
]);

// 折叠状态管理
const expandedSections = ref({
  basicInfo: true,    // 基本信息默认展开
  internship: false,  // 实习经历默认收起
  education: false,   // 校园经历默认收起
  skills: false       // 专业技能默认收起
});

/**
 * 切换卡片展开/收起状态
 * @param {string} section - 要切换的部分名称
 */
const toggleSection = (section) => {
  expandedSections.value[section] = !expandedSections.value[section];
};

// 使用本地响应式数据，并与props同步
const basicInfo = ref({});
const experiences = ref([]);
const education = ref([]);
const skills = ref('');

// 监听本地数据变化，发出更新事件
watch(basicInfo, (newValue) => {
  emit('update:basicInfo', { ...newValue });
}, { deep: true });

watch(experiences, (newValue) => {
  emit('update:experiences', [...newValue]);
}, { deep: true });

watch(education, (newValue) => {
  emit('update:education', [...newValue]);
}, { deep: true });

watch(skills, (newValue) => {
  emit('update:skills', newValue);
});

// 初始化数据
onMounted(() => {
  basicInfo.value = { ...props.basicInfo };
  experiences.value = [...props.experiences];
  education.value = [...props.education];
  skills.value = props.skills;
});

// 监听props变化，更新本地数据
watch(() => props.basicInfo, (newValue) => {
  if (JSON.stringify(basicInfo.value) !== JSON.stringify(newValue)) {
    basicInfo.value = { ...newValue };
  }
}, { deep: true });

watch(() => props.experiences, (newValue) => {
  if (JSON.stringify(experiences.value) !== JSON.stringify(newValue)) {
    experiences.value = [...newValue];
  }
}, { deep: true });

watch(() => props.education, (newValue) => {
  if (JSON.stringify(education.value) !== JSON.stringify(newValue)) {
    education.value = [...newValue];
  }
}, { deep: true });

watch(() => props.skills, (newValue) => {
  if (skills.value !== newValue) {
    skills.value = newValue;
  }
});

// 添加新的实习经历
const addExperience = () => {
  experiences.value.push({
    company: '',
    position: '',
    timeRange: '',
    description: ''
  });
};

// 删除实习经历
const removeExperience = (index) => {
  experiences.value.splice(index, 1);
};

// 添加新的教育经历
const addEducation = () => {
  education.value.push({
    school: '',
    major: '',
    degree: '',
    timeRange: ''
  });
};

// 删除教育经历
const removeEducation = (index) => {
  education.value.splice(index, 1);
};

// AI润色功能
const handleAIPolish = () => {
  console.log('AI润色功能');
  emit('ai-polish');
};

// AI评估功能
const handleAIEvaluate = () => {
  console.log('AI评估功能');
  emit('ai-evaluate');
};

// 暴露组件数据和方法
defineExpose({
  basicInfo,
  experiences,
  education,
  skills
});
</script>

<style scoped lang="scss">
.resume-editor {
  max-width: 800px;
  margin: 0 auto;
  background-color: #f8f9fa;
  padding: 20px;
  display: flex;
  flex-direction: column;
  height: auto;
  width: 100%;
  
  // 响应式设计
  @media (max-width: 1200px) {
    max-width: 100%;
    margin: 0;
  }
  
  @media (max-width: 768px) {
    padding: 15px;
    background-color: transparent;
  }

  .card-section {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-bottom: 16px;
    overflow: hidden;
    transition: box-shadow 0.3s ease;
    width: 100%;
    min-width: 0; // 防止内容溢出
    box-sizing: border-box;

    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    }

    &.expanded {
      .expand-icon {
        transform: rotate(180deg);
      }
    }

    .card-header {
      background-color: #f8f9fa;
      padding: 16px 20px;
      cursor: pointer;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #e9ecef;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #e9ecef;
      }

      .section-title {
        font-weight: 600;
        font-size: 16px;
        color: #333;
      }

      .expand-icon {
        font-size: 14px;
        color: #666;
        transition: transform 0.3s ease;
      }
    }

    .card-content {
      padding: 20px;
      background-color: #fff;
      animation: slideDown 0.3s ease;
      width: 100%;
      box-sizing: border-box;
      overflow: hidden; // 防止内容溢出影响宽度
    }
  }

  .experience-item,
  .education-item {
    margin-bottom: 20px;
    padding: 15px;
    border: 1px solid #e9ecef;
    border-radius: 6px;
    background-color: #fafbfc;
    position: relative;

    &:last-child {
      margin-bottom: 0;
    }
  }

  // 动画关键帧
  @keyframes slideDown {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .ai-actions {
    display: flex;
    justify-content: center;
    gap: 20px;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    margin-top: 16px;
    width: 100%;
    box-sizing: border-box;

    .ai-button {
      min-width: 100px;
      height: 40px;
      background-color: #000;
      color: #fff;
      border: none;
      border-radius: 4px;
      font-size: 14px;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background-color: #333;
        transform: translateY(-1px);
      }

      &:active {
        background-color: #1a1a1a;
        transform: translateY(0);
      }

      &:focus {
        outline: none;
        box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.2);
      }
    }
  }

  // Element Plus 组件样式优化
  :deep(.el-form-item) {
    margin-bottom: 16px;
    width: 100%;
    box-sizing: border-box;

    .el-form-item__label {
      font-weight: 500;
      color: #333;
      line-height: 40px;
    }

    .el-input__wrapper {
      border-radius: 4px;
      box-shadow: 0 0 0 1px #dcdfe6 inset;
      transition: box-shadow 0.2s ease;
      width: 100%;
      box-sizing: border-box;

      &:hover {
        box-shadow: 0 0 0 1px #c0c4cc inset;
      }

      &.is-focus {
        box-shadow: 0 0 0 1px #409eff inset;
      }
    }

    .el-input__inner {
      height: 40px;
      line-height: 40px;
      font-size: 14px;
    }

    .el-textarea__inner {
      min-height: 80px;
      border-radius: 4px;
      font-size: 14px;
      line-height: 1.5;
      resize: vertical;
    }

    .el-date-editor {
      width: 100%;

      .el-input__wrapper {
        width: 100%;
      }
    }
  }

  // 个人简介文本框特殊样式
  .basic-info .el-form-item:last-child {
    .el-textarea__inner {
      min-height: 100px;
    }
  }

  // 工作描述文本框样式
  .experience-item .el-form-item:last-child,
  .education-item .el-form-item:last-child {
    .el-textarea__inner {
      min-height: 80px;
    }
  }

  // 专业技能文本框样式
  .skills .el-textarea__inner {
    min-height: 120px;
  }

  // 添加项目按钮样式
  .add-item {
    text-align: center;
    margin-top: 15px;
    padding-top: 15px;
    border-top: 1px dashed #e9ecef;

    .el-button {
      background-color: #f8f9fa;
      border: 1px dashed #6c757d;
      color: #6c757d;
      font-weight: 500;
      transition: all 0.2s ease;

      &:hover {
        background-color: #e9ecef;
        border-color: #495057;
        color: #495057;
      }
    }
  }

  // 项目操作按钮样式
  .item-actions {
    text-align: right;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #e9ecef;

    .el-button {
      font-size: 12px;
      padding: 5px 10px;
      height: auto;
      line-height: 1.2;

      &:hover {
        background-color: #e9ecef;
        border-color: #495057;
        color: #495057;
      }
    }
  }

  // 项目操作按钮样式
  .item-actions {
    text-align: right;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #e9ecef;

    .el-button {
      font-size: 12px;
      padding: 4px 8px;
    }
  }
}
</style>