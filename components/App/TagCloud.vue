<script setup lang="ts">
interface Tag {
  name: string
  weight: number // 1-5，决定大小
}

const props = defineProps<{
  tags: Tag[]
}>()

const emit = defineEmits(['select'])

// 将权重映射到 Tailwind 的字体大小类名
const sizeMap: Record<number, string> = {
  1: 'text-xs opacity-60 hover:opacity-100',
  2: 'text-sm opacity-80 hover:opacity-100',
  3: 'text-base font-medium opacity-90',
  4: 'text-lg font-bold',
  5: 'text-xl font-extrabold text-blue-600 dark:text-blue-400'
}

// 随机旋转角度 (可选，增加灵动感)
const getRandomRotation = () => {
  const rotations = ['rotate-0', 'rotate-0', 'rotate-0', 'rotate-1', '-rotate-1', 'rotate-2', '-rotate-2']
  return rotations[Math.floor(Math.random() * rotations.length)]
}
</script>

<template>
  <div class="flex flex-wrap justify-center items-center gap-x-4 gap-y-2 p-2">
    <button
      v-for="tag in tags"
      :key="tag.name"
      @click="emit('select', tag.name)"
      class="inline-block transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
      :class="[sizeMap[tag.weight], getRandomRotation()]"
    >
      #{{ tag.name }}
    </button>
  </div>
</template>
