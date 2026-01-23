<!-- components/Base/Card.vue -->
<!-- 基础卡片 -->

<script setup lang="ts">
interface Props {
  hover?: boolean // 是否开启悬停浮起效果
  padding?: string // 自定义内边距 class
}

withDefaults(defineProps<Props>(), {
  hover: false,
  padding: 'p-4 sm:p-5'
})
</script>

<template>
  <div
    class="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-600 shadow-sm overflow-hidden transition-all duration-300"
    :class="[
      padding,
      hover ? 'hover:shadow-md hover:-translate-y-1' : ''
    ]"
  >
    <slot />
  </div>
</template>
