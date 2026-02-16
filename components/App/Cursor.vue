<!-- components/App/Cursor.vue -->
<!-- 鼠标指针 -->

<script setup lang="ts">
const cursorX = ref(0)
const cursorY = ref(0)
const trailerX = ref(0)
const trailerY = ref(0)
const isHovering = ref(false)
const isDesktop = ref(false)

let animationFrameId: number | null = null

// 简单的线性插值算法 (Lerp) 实现平滑跟随
const lerp = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor
}

// 检测是否为桌面环境 (宽屏)
const checkScreenSize = () => {
  if (import.meta.client) {
    // 匹配 Tailwind md 断点 (768px)
    isDesktop.value = window.matchMedia('(min-width: 768px)').matches

    if (isDesktop.value) {
      document.documentElement.classList.add('custom-cursor-active')
    } else {
      document.documentElement.classList.remove('custom-cursor-active')
    }
  }
}

const onMouseMove = (e: MouseEvent) => {
  if (!isDesktop.value) return

  cursorX.value = e.clientX
  cursorY.value = e.clientY

  // 检测鼠标下方是否是可交互元素 (a标签, button, 或 .cursor-pointer)
  const target = e.target as HTMLElement

  // 快速检查
  if (target.tagName === 'A' || target.tagName === 'BUTTON') {
    isHovering.value = true
    return
  }

  // 深度检查
  isHovering.value =
    target.closest('a') !== null ||
    target.closest('button') !== null ||
    window.getComputedStyle(target).cursor === 'pointer'
}

const animate = () => {
  if (isDesktop.value) {
    trailerX.value = lerp(trailerX.value, cursorX.value, 0.15) // 0.15 是延迟系数，越小越慢
    trailerY.value = lerp(trailerY.value, cursorY.value, 0.15)
  }
  animationFrameId = requestAnimationFrame(animate)
}

onMounted(() => {
  checkScreenSize()

  // 监听窗口大小变化
  window.addEventListener('resize', checkScreenSize)

  // 1. 监听鼠标移动
  window.addEventListener('mousemove', onMouseMove)

  // 2. 启动动画循环 (每一帧更新跟随圆圈的位置)
  animate()
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('resize', checkScreenSize)
    window.removeEventListener('mousemove', onMouseMove)
    document.documentElement.classList.remove('custom-cursor-active')

    if (animationFrameId !== null) {
      cancelAnimationFrame(animationFrameId)
    }
  }
})
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-[9999] overflow-hidden hidden md:block">
    <!-- 主光标点 (跟随鼠标，无延迟) -->
    <div
      class="absolute w-2 h-2 bg-black dark:bg-white rounded-full -translate-x-1/2 -translate-y-1/2"
      :style="{ left: `${cursorX}px`, top: `${cursorY}px` }"
    ></div>

    <!-- 跟随圆环 (有延迟动画) -->
    <div
      class="absolute rounded-full border border-gray-400 dark:border-gray-700 -translate-x-1/2 -translate-y-1/2 transition-all duration-200 ease-out will-change-transform"
      :class="[
        isHovering ? 'w-12 h-12 bg-black/10 border-transparent' : 'w-8 h-8'
      ]"
      :style="{ left: `${trailerX}px`, top: `${trailerY}px` }"
    ></div>
  </div>
</template>
