<!-- components/App/ClickSpark.vue -->
<!-- 点击爆炸效果 -->

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 定义粒子接口
interface Particle {
  id: number
  x: number
  y: number
  angle: number
  speed: number
  size: number
  color: string
}

const particles = ref<Particle[]>([])
let nextId = 0

const colors = ['#2563eb', '#000000', '#9333ea', '#60a5fa'] as const

const createParticles = (e: MouseEvent) => {
  const count = 8 // 每次点击产生的粒子数

  for (let i = 0; i < count; i++) {
    const id = nextId++
    const angle = Math.random() * Math.PI * 2
    const velocity = 2 + Math.random() * 2 // 速度

    particles.value.push({
      id,
      x: e.clientX,
      y: e.clientY,
      angle,
      speed: velocity,
      size: Math.random() * 4 + 2, // 2-6px 大小
      color: colors[Math.floor(Math.random() * colors.length)] as string
    })

    // 600ms 后自动清理粒子
    setTimeout(() => {
      particles.value = particles.value.filter(p => p.id !== id)
    }, 600)
  }
}

onMounted(() => {
  window.addEventListener('mousedown', createParticles)
})

onUnmounted(() => {
  window.removeEventListener('mousedown', createParticles)
})
</script>

<template>
  <div class="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
    <div
      v-for="p in particles"
      :key="p.id"
      class="particle absolute rounded-full"
      :style="{
        left: p.x + 'px',
        top: p.y + 'px',
        width: p.size + 'px',
        height: p.size + 'px',
        backgroundColor: p.color,
        '--tx': Math.cos(p.angle) * 60 + 'px', // X轴飞出距离
        '--ty': Math.sin(p.angle) * 60 + 'px'  // Y轴飞出距离
      }"
    ></div>
  </div>
</template>

<style scoped>
.particle {
  animation: fly 0.6s ease-out forwards;
}

@keyframes fly {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    /* 向计算出的角度飞行，并消失 */
    transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(0);
    opacity: 0;
  }
}
</style>
