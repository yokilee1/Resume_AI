<template>
  <div class="app-container">
    <el-container class="main-container">
      <Sidebar />
      <el-container>
        <el-header>
          <Navigation />
        </el-header>
        <el-main>
          <router-view />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script setup>
import { ElContainer, ElHeader, ElMain } from 'element-plus';
import Sidebar from './components/common/Sidebar.vue';
import Navigation from './components/common/Navigation.vue';
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
  background: #f8f9fa;
}

.app-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  background: #f8f9fa;
  position: relative;
  
  // 添加微妙的背景纹理
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: none;
    pointer-events: none;
    z-index: 0;
  }
}

.main-container {
  height: 100%;
  position: relative;
  z-index: 1;
}

.el-header {
  padding: 0;
  height: auto;
  border-bottom: 1px solid #dee2e6;
  background: #ffffff;
  backdrop-filter: none;
  box-shadow: none;
}

.el-main {
  padding: var(--spacing-xl);
  background: transparent;
  overflow-y: auto;
  
  // 自定义滚动条样式
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f3f5;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: #ced4da;
    border-radius: 3px;
    
    &:hover {
      background: #adb5bd;
    }
  }
}
</style>