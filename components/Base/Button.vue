<!-- components/Base/Button.vue -->
<!-- 基础按钮 -->

<script setup lang="ts">
interface Props {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  disabled?: boolean
  to?: string // 如果传入 to，渲染为 NuxtLink
  type?: 'button' | 'submit' | 'reset'
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
  size: 'md',
  loading: false,
  disabled: false,
  type: 'button'
})

// 样式映射
const variants = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm border-transparent',
  secondary: 'bg-gray-100 text-gray-900 dark:text-white hover:bg-gray-200 border-transparent',
  outline: 'bg-white dark:bg-gray-800 text-gray-700 border-gray-300 hover:bg-gray-50',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-white border-transparent',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm border-transparent'
}

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base'
}
</script>

<template>
  <component
    :is="to ? 'NuxtLink' : 'button'"
    :to="to"
    :type="!to ? type : undefined"
    :disabled="disabled || loading"
    class="inline-flex items-center justify-center rounded-lg border font-medium transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
    :class="[variants[variant], sizes[size]]"
  >
    <!-- Loading Spinner -->
    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>

    <!-- Button Content -->
    <slot />
  </component>
</template>
