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
}

.app-container {
  height: 100vh;
  width: 100vw;
  overflow: hidden;
}

.main-container {
  height: 100%;
}

.el-header {
  padding: 0;
  height: auto;
  border-bottom: 1px solid #e6e6e6;
}

.el-main {
  padding: 20px;
  background-color: #f5f7fa;
}
</style>