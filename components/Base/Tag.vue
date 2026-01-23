<!-- components/Base/Tag.vue -->
<!-- 基础标签 -->

<script setup lang="ts">
interface Props {
  active?: boolean // 是否处于激活/选中状态
  clickable?: boolean // 是否看起来可点击
}

withDefaults(defineProps<Props>(), {
  active: false,
  clickable: false
})
</script>

<template>
  <span
    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200"
    :class="[
      clickable ? 'cursor-pointer' : 'cursor-default',
      active
        ? 'bg-blue-100 text-blue-800'
        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    ]"
  >
    <slot />
  </span>
</template>
