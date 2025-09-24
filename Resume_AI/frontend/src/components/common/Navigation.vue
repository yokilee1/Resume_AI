<template>
  <div class="navigation">
    <div class="user-info">
      <el-avatar class="avatar" :size="36"></el-avatar>
      <el-icon><ArrowDown /></el-icon>
    </div>
  </div>
</template>

<script setup>
import { ArrowDown } from '@element-plus/icons-vue';
</script>

<style lang="scss" scoped>
.navigation {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 0 20px;
  
  .user-info {
    display: flex;
    align-items: center;
    cursor: pointer;
    
    .avatar {
      margin-right: 8px;
      background-color: #1890ff;
    }
  }
}
</style>