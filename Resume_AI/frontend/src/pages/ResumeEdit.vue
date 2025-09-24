<template>
  <div class="resume-edit-page">
    <ResumeForm 
      mode="edit"
      :resume-id="route.params.id"
      @save-success="handleSaveSuccess"
      @back="handleBack"
    />
  </div>
</template>

<script setup>
/**
 * 简历编辑页面
 * 使用通用ResumeForm组件进行编辑
 */
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import ResumeForm from '@/components/resume/ResumeForm.vue'

const route = useRoute()
const router = useRouter()

/**
 * 保存成功回调
 */
const handleSaveSuccess = (resume) => {
  console.log('简历保存成功:', resume)
}

/**
 * 返回回调
 */
const handleBack = () => {
  router.push('/resume-management')
}
</script>

<style lang="scss" scoped>
.resume-edit-page {
  height: 100vh;
}
</style>