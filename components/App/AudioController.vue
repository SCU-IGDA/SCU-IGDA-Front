<script setup lang="ts">
import { useGlobalAudio } from '~/composables/useGlobalAudio'

const { isMuted, toggleMute } = useGlobalAudio()
const buttonRef = ref<HTMLElement | null>(null)

// 拖拽状态
const isDragging = ref(false)
const position = ref({ x: 20, y: window.innerHeight - 100 }) // 默认位置：左下角
const offset = ref({ x: 0, y: 0 })
const startTime = ref(0) // 用于判断是点击还是拖拽

// --- 拖拽逻辑 ---

const startDrag = (e: MouseEvent | TouchEvent) => {
  if (!buttonRef.value) return
  isDragging.value = true
  startTime.value = Date.now()

  let clientX = 0
  let clientY = 0

  if (e instanceof MouseEvent) {
    clientX = e.clientX
    clientY = e.clientY
  } else if (e.touches && e.touches[0]) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else {
    return // 如果没有触控点，直接返回
  }

  // 计算鼠标在按钮内的偏移量
  const rect = buttonRef.value.getBoundingClientRect()
  offset.value = {
    x: clientX - rect.left,
    y: clientY - rect.top
  }

  // 添加全局事件监听
  window.addEventListener('mousemove', onDrag)
  window.addEventListener('mouseup', stopDrag)
  window.addEventListener('touchmove', onDrag)
  window.addEventListener('touchend', stopDrag)
}

const onDrag = (e: MouseEvent | TouchEvent) => {
  if (!isDragging.value) return
  e.preventDefault() // 防止手机端滚动屏幕

  let clientX = 0
  let clientY = 0

  if (e instanceof MouseEvent) {
    clientX = e.clientX
    clientY = e.clientY
  } else if (e.touches && e.touches[0]) {
    clientX = e.touches[0].clientX
    clientY = e.touches[0].clientY
  } else {
    return
  }

  // 计算新位置
  let newX = clientX - offset.value.x
  let newY = clientY - offset.value.y

  // 边界检查：不让按钮拖出屏幕
  const maxX = window.innerWidth - 60 // 60是按钮大概宽度
  const maxY = window.innerHeight - 60

  newX = Math.max(10, Math.min(newX, maxX - 10))
  newY = Math.max(10, Math.min(newY, maxY - 10))

  position.value = { x: newX, y: newY }
}

const stopDrag = () => {
  isDragging.value = false

  // 移除监听
  window.removeEventListener('mousemove', onDrag)
  window.removeEventListener('mouseup', stopDrag)
  window.removeEventListener('touchmove', onDrag)
  window.removeEventListener('touchend', stopDrag)
}

// --- 点击处理 ---
const handleClick = () => {
  const dragDuration = Date.now() - startTime.value
  // 如果按下松开的时间很短（小于200ms），则视为点击，否则视为拖拽结束
  if (dragDuration < 200) {
    toggleMute()
  }
}

// 初始位置设置 (Client Only)
onMounted(() => {
  // 可以从 localStorage 读取上次的位置
  const savedPos = localStorage.getItem('audio-btn-pos')
  if (savedPos) {
    position.value = JSON.parse(savedPos)
  }
})

// 保存位置
watch(position, (newPos) => {
  localStorage.setItem('audio-btn-pos', JSON.stringify(newPos))
}, { deep: true })
</script>

<template>
  <div
    ref="buttonRef"
    class="fixed z-[100] cursor-grab active:cursor-grabbing touch-none select-none transition-transform duration-100 hover:scale-110 active:scale-95"
    :style="{
      left: `${position.x}px`,
      top: `${position.y}px`
    }"
    @mousedown="startDrag"
    @touchstart.passive="startDrag"
    @click="handleClick"
  >
    <!-- 按钮主体 -->
    <div
      class="w-12 h-12 rounded-full shadow-2xl flex items-center justify-center border-2 backdrop-blur-sm transition-colors duration-300"
      :class="[
        isMuted
          ? 'bg-gray-200/80 border-gray-300 dark:bg-gray-800/80 dark:border-gray-600'
          : 'bg-blue-600/90 border-blue-400 animate-pulse-slow' // 播放时有微弱呼吸灯效果
      ]"
    >
      <!-- Icon: Muted -->
      <svg v-if="isMuted" class="w-6 h-6 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
      </svg>

      <!-- Icon: Playing -->
      <svg v-else class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
    </div>

    <!-- 提示文本 (仅静音且首次加载时显示，几秒后消失) -->
    <span v-if="isMuted" class="absolute left-14 top-2 bg-black/70 text-white text-xs px-2 py-1 rounded whitespace-nowrap pointer-events-none opacity-0 hover:opacity-100 transition-opacity">
      点击播放音乐
    </span>
  </div>
</template>

<style scoped>
.animate-pulse-slow {
  animation: pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: .8; }
}
</style>
