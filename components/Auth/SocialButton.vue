<!-- components/Auth/SocialButton.vue -->
<!-- 社交登录按钮（暂时未使用） -->

<script setup lang="ts">
// 这是一个纯 UI 组件，用于包裹 QQ/微信 图标
</script>

<template>
  <button
    type="button"
    class="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-lg shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
  >
    <slot />
  </button>
</template>
