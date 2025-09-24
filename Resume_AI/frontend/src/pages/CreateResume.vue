<template>
  <div class="create-resume-page">
    <div class="resume-container">
      <ResumePreview :basicInfo="resumeData.basicInfo" 
                    :experiences="resumeData.experiences"
                    :education="resumeData.education"
                    :skills="resumeData.skills" />
      <ResumeEditor v-model:basicInfo="resumeData.basicInfo"
                   v-model:experiences="resumeData.experiences"
                   v-model:education="resumeData.education"
                   v-model:skills="resumeData.skills"
                   @ai-polish="handleAIPolish"
                   @ai-evaluate="handleAIEvaluate" />
    </div>
  </div>
</template>

<script setup>
/**
 * 创建简历页面
 * 使用ResumeEditor和ResumePreview组件来实现简历的编辑和预览功能
 */
import { ref } from 'vue';
import ResumeEditor from '../components/resume/ResumeEditor.vue';
import ResumePreview from '../components/resume/ResumePreview.vue';

// 简历数据
const resumeData = ref({
  basicInfo: {
    name: '',
    age: '',
    phone: '',
    email: '',
    introduction: ''
  },
  experiences: [{
    company: '',
    position: '',
    timeRange: '',
    description: ''
  }],
  education: [{
    school: '',
    major: '',
    degree: '',
    timeRange: ''
  }],
  skills: ''
});

// AI功能处理方法
const handleAIPolish = () => {
  console.log('AI润色功能');
  // 实现AI润色功能
};

const handleAIEvaluate = () => {
  console.log('AI评估功能');
  // 实现AI评估功能
};
</script>

<style lang="scss" scoped>
.create-resume-page {
  padding: 20px;
  
  .resume-container {
    display: flex;
    gap: 20px;
    
    @media (max-width: 1200px) {
      flex-direction: column;
    }
  }
}
</style>