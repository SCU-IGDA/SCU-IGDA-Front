<!-- components/Content/SearchBar.vue -->
<!-- 内容库搜索栏 -->

<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  loading?: boolean
}>()

const emit = defineEmits(['update:modelValue', 'search'])

// 触发搜索
const handleSearch = () => {
  emit('search')
}

// 清除输入内容
const handleClear = () => {
  emit('update:modelValue', '')
}
</script>

<template>
  <div class="flex items-center gap-2 w-full max-w-2xl mx-auto">
    <div class="flex-grow relative">
      <!-- 复用 BaseInput，监听回车键 -->
      <BaseInput
        :modelValue="modelValue"
        @update:modelValue="$emit('update:modelValue', $event)"
        placeholder="搜索感兴趣的内容..."
        @keyup.enter="handleSearch"
        class="w-full"
      />

      <!-- 清除按钮 -->
      <button
        v-if="modelValue"
        @click="handleClear"
        type="button"
        class="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors focus:outline-none"
        aria-label="清除搜索内容"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    <div class="flex-shrink-0">
      <BaseButton
        variant="primary"
        :loading="loading"
        @click="handleSearch"
      >
        <span class="mr-2">搜索</span>
        <!-- Search Icon -->
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
      </BaseButton>
    </div>
  </div>
</template>
