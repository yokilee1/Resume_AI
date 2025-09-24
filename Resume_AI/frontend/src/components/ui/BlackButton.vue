<template>
  <el-button
    :type="type"
    :size="size"
    :disabled="disabled"
    :loading="loading"
    :icon="icon"
    class="black-button"
    @click="$emit('click')"
  >
    <slot></slot>
  </el-button>
</template>

<script setup>
/**
 * 黑色主题按钮组件
 * 统一应用中的按钮样式，符合原型设计的黑色主题
 */
defineProps({
  type: {
    type: String,
    default: 'default'
  },
  size: {
    type: String,
    default: 'default'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String,
    default: ''
  }
});

defineEmits(['click']);
</script>

<style lang="scss" scoped>
.black-button {
  background-color: #000;
  color: #fff;
  border: none;
  border-radius: 4px;
  transition: all 0.3s;
  
  &:hover, &:focus {
    background-color: #333;
    color: #fff;
  }
  
  &:active {
    background-color: #000;
    color: #fff;
  }
  
  &.is-disabled {
    background-color: #ccc;
    color: #999;
  }
  
  &.el-button--primary {
    background-color: #000;
    
    &:hover, &:focus {
      background-color: #333;
    }
    
    &:active {
      background-color: #000;
    }
  }
}
</style>