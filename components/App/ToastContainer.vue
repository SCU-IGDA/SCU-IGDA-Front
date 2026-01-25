<!-- components/App/ToastContainer.vue -->
<!-- 全局提示容器组件 -->

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts, removeToast } = useToast()

// 获取提示类型对应的样式
const getToastStyles = (type: string) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 dark:bg-green-900/80 dark:backdrop-blur-sm border-green-200 dark:border-green-800 text-green-800 dark:text-green-200'
    case 'error':
      return 'bg-red-50 dark:bg-red-900/80 dark:backdrop-blur-sm border-red-200 dark:border-red-800 text-red-800 dark:text-red-200'
    case 'warning':
      return 'bg-yellow-50 dark:bg-yellow-900/80 dark:backdrop-blur-sm border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200'
    case 'info':
    default:
      return 'bg-blue-50 dark:bg-blue-900/80 dark:backdrop-blur-sm border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200'
  }
}

// 获取图标
const getToastIcon = (type: string) => {
  switch (type) {
    case 'success':
      return 'M5 13l4 4L19 7'
    case 'error':
      return 'M6 18L18 6M6 6l12 12'
    case 'warning':
      return 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.346 16.5c-.77.833.192 2.5 1.732 2.5z'
    case 'info':
    default:
      return 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  }
}
</script>

<template>
  <!-- 提示容器 - 固定在中央上方 -->
  <div class="fixed top-4 left-1/2 transform -translate-x-1/2 z-[9999] pointer-events-none">
    <div class="flex flex-col items-center space-y-3 max-w-md w-screen px-4">
      <transition-group
        name="toast"
        tag="div"
        class="w-full"
      >
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="[
            'pointer-events-auto w-full rounded-lg border p-4 shadow-lg transition-all duration-300',
            getToastStyles(toast.type)
          ]"
          @click="removeToast(toast.id)"
        >
          <div class="flex items-start">
            <!-- 图标 -->
            <div class="flex-shrink-0 mr-3">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="getToastIcon(toast.type)" />
              </svg>
            </div>

            <!-- 消息内容 -->
            <div class="flex-1">
              <p class="text-sm font-medium">{{ toast.message }}</p>
            </div>

            <!-- 关闭按钮 -->
            <button
              @click.stop="removeToast(toast.id)"
              class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<style scoped>
/* 提示动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.toast-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.toast-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

/* 移动端优化 */
@media (max-width: 640px) {
  .fixed {
    top: 2rem;
    padding: 0 1rem;
  }

  .max-w-md {
    max-width: 100%;
  }
}
</style>
