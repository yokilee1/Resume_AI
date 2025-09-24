<template>
  <div class="create-resume-page">
    <ResumeForm 
      mode="create"
      @save-success="handleSaveSuccess"
      @back="handleBack"
    />
  </div>
</template>

<script setup>
/**
 * 创建简历页面
 * 使用通用ResumeForm组件进行创建
 */
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ResumeForm from '@/components/resume/ResumeForm.vue'

const router = useRouter()

/**
 * 保存成功回调
 */
const handleSaveSuccess = (resume) => {
  console.log('简历创建成功:', resume)
  ElMessage.success('简历创建成功！')
}

/**
 * 返回回调
 */
const handleBack = () => {
  router.push('/resume-management')
}
</script>

<style lang="scss" scoped>
.create-resume-page {
  height: 100vh;
}
</style>