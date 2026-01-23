<!-- components/Auth/Divider.vue -->
<!-- 登录按钮分割线 -->

<script setup lang="ts">
defineProps<{ label?: string }>()
</script>

<template>
  <div class="relative my-6 select-none">
    <div class="absolute inset-0 flex items-center">
      <div class="w-full border-t border-gray-200"></div>
    </div>
    <div class="relative flex justify-center text-sm">
      <span class="px-2 bg-white dark:bg-gray-800 text-gray-500">{{ label || '或者' }}</span>
    </div>
  </div>
</template>
