<!-- components/App/Layout.vue -->
<!-- 全局默认布局 -->

<script setup lang="ts">
import { useGlobalAudio } from '~/composables/useGlobalAudio'
import ToastContainer from '~/components/App/ToastContainer.vue'

const { initAudio } = useGlobalAudio()

// 监听全局点击
onMounted(() => {
  // 预初始化（解决部分浏览器需要用户交互才能构建 AudioContext 的问题）
  window.addEventListener('click', () => {
    initAudio()
  })
})
</script>

<template>
  <div class="flex flex-col min-h-screen transition-colors duration-300 bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-100">

    <!-- 全局音频控制器 -->
    <ClientOnly>
      <AppAudioController />
    </ClientOnly>

    <!-- 全局提示容器 -->
    <ClientOnly>
      <ToastContainer />
    </ClientOnly>

    <!-- 顶部导航 -->
    <AppHeader />

    <main class="flex-grow">
      <slot />
    </main>

    <AppFooter />
  </div>
</template>
