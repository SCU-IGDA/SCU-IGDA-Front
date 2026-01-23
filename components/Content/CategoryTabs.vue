<!-- components/Content/CategoryTabs.vue -->
<!-- 内容库分类标签 -->

<script setup lang="ts">
interface Props {
  categories: string[] // 例如 ['程序', '美术', '策划']
  modelValue: string   // 当前选中的分类，空字符串代表'全部'
}

defineProps<Props>()
defineEmits(['update:modelValue'])
</script>

<template>
  <div class="w-full overflow-x-auto no-scrollbar py-2">
    <div class="flex items-center space-x-2 min-w-max px-1">
      <!-- '全部' 按钮 -->
      <button
        @click="$emit('update:modelValue', '')"
        class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border"
        :class="[
          modelValue === ''
            ? 'bg-black text-white border-black shadow-md'
            : 'bg-white dark:bg-gray-800 text-gray-600 border-gray-200 hover:bg-gray-50'
        ]"
      >
        全部
      </button>

      <!-- 动态分类按钮 -->
      <button
        v-for="category in categories"
        :key="category"
        @click="$emit('update:modelValue', category)"
        class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border"
        :class="[
          modelValue === category
            ? 'bg-black text-white border-black shadow-md'
            : 'bg-white dark:bg-gray-800 text-gray-600 border-gray-200 hover:bg-gray-50'
        ]"
      >
        {{ category }}
      </button>
    </div>
  </div>
</template>

<style scoped>
/* 隐藏滚动条但保留滚动功能 */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
