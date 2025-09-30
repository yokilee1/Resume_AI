<template>
  <div class="base-resume-template">
    <slot 
      :basicInfo="resumeBasicInfo"
      :experiences="resumeExperiences" 
      :education="resumeEducation"
      :skills="resumeSkills"
      :formatDate="formatDate"
    />
  </div>
</template>

<script setup>
/**
 * 基础简历模板组件
 * 提供通用的数据处理逻辑，通过插槽让子组件自定义样式
 */
import { computed } from 'vue';

const props = defineProps({
  // 支持传入完整的简历对象
  resume: {
    type: Object,
    default: () => ({})
  },
  // 兼容原有的分别传入方式
  basicInfo: {
    type: Object,
    default: () => ({})
  },
  experiences: {
    type: Array,
    default: () => []
  },
  education: {
    type: Array,
    default: () => []
  },
  skills: {
    type: String,
    default: ''
  }
});

/**
 * 计算属性，优先使用resume对象中的数据
 */
const resumeBasicInfo = computed(() => {
  return props.resume?.content?.basicInfo || props.basicInfo || {}
});

const resumeExperiences = computed(() => {
  return props.resume?.content?.experiences || props.experiences || []
});

const resumeEducation = computed(() => {
  return props.resume?.content?.education || props.education || []
});

const resumeSkills = computed(() => {
  return props.resume?.content?.skills || props.skills || ''
});

/**
 * 格式化日期函数
 * @param {string} dateStr - 日期字符串
 * @returns {string} 格式化后的日期
 */
const formatDate = (dateStr) => {
  if (!dateStr) return '';
  
  // 处理 YYYY-MM 格式
  if (dateStr.includes('-') && dateStr.length === 7) {
    return dateStr.replace('-', '.');
  }
  
  // 处理完整日期格式
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  
  return `${date.getFullYear()}.${(date.getMonth() + 1).toString().padStart(2, '0')}`;
};
</script>

<style lang="scss" scoped>
.base-resume-template {
  width: 100%;
  height: 100%;
}
</style>