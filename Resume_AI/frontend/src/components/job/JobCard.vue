<template>
  <div class="job-card">
    <div class="job-header">
      <h3 class="job-title">{{ job.title }}</h3>
      <div class="job-salary">{{ job.salary }}</div>
    </div>
    <div class="job-company">
      <span>{{ job.company }}</span>
      <span class="job-location">{{ job.location }}</span>
    </div>
    <div class="job-tags">
      <el-tag v-for="(tag, index) in job.tags" :key="index" size="small">{{ tag }}</el-tag>
    </div>
    <div class="job-actions">
      <el-button type="primary" size="small" @click="handleApply">申请职位</el-button>
      <el-button size="small" @click="handleSave">收藏</el-button>
    </div>
  </div>
</template>

<script setup>
/**
 * 职位卡片组件
 * 用于展示职位信息
 */
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  job: {
    type: Object,
    required: true,
    default: () => ({
      title: '',
      company: '',
      location: '',
      salary: '',
      tags: []
    })
  }
});

const emit = defineEmits(['apply', 'save']);

const handleApply = () => {
  emit('apply', props.job);
};

const handleSave = () => {
  emit('save', props.job);
};
</script>

<style lang="scss" scoped>
.job-card {
  padding: 16px;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
  transition: transform 0.3s;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  .job-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    
    .job-title {
      font-size: 18px;
      font-weight: 500;
      margin: 0;
    }
    
    .job-salary {
      color: #f56c6c;
      font-weight: 500;
    }
  }
  
  .job-company {
    display: flex;
    justify-content: space-between;
    margin-bottom: 12px;
    color: #606266;
    
    .job-location {
      font-size: 14px;
    }
  }
  
  .job-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 16px;
  }
  
  .job-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}
</style>