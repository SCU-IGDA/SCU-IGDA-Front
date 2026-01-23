<!-- components/App/Cursor.vue -->
<!-- 鼠标指针 -->

<script setup lang="ts">
const cursorX = ref(0)
const cursorY = ref(0)
const trailerX = ref(0)
const trailerY = ref(0)
const isHovering = ref(false)

// 简单的线性插值算法 (Lerp) 实现平滑跟随
const lerp = (start: number, end: number, factor: number) => {
  return start + (end - start) * factor
}

onMounted(() => {
  // 1. 监听鼠标移动
  window.addEventListener('mousemove', (e) => {
    cursorX.value = e.clientX
    cursorY.value = e.clientY

    // 检测鼠标下方是否是可交互元素 (a标签, button, 或 .cursor-pointer)
    const target = e.target as HTMLElement
    isHovering.value =
      target.tagName === 'A' ||
      target.tagName === 'BUTTON' ||
      target.closest('a') !== null ||
      target.closest('button') !== null ||
      window.getComputedStyle(target).cursor === 'pointer'
  })

  // 2. 启动动画循环 (每一帧更新跟随圆圈的位置)
  const animate = () => {
    trailerX.value = lerp(trailerX.value, cursorX.value, 0.15) // 0.15 是延迟系数，越小越慢
    trailerY.value = lerp(trailerY.value, cursorY.value, 0.15)
    requestAnimationFrame(animate)
  }
  animate()
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
