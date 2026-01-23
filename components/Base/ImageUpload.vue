<!-- components/Base/ImageUpload.vue -->
<!-- 基础图片上传 -->

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  modelValue?: string // 图片 URL
  label?: string
  aspectRatio?: string // 例如 "aspect-video" (16:9) 或 "aspect-square"
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  label: '上传图片',
  aspectRatio: 'aspect-video'
})

const emit = defineEmits(['update:modelValue', 'change'])
const fileInput = ref<HTMLInputElement | null>(null)
const isDragging = ref(false)

// 触发文件选择
const triggerSelect = () => {
  fileInput.value?.click()
}

// 处理文件变动
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    processFile(input.files[0])
  }
}

// 处理拖拽
const handleDrop = (event: DragEvent) => {
  isDragging.value = false
  if (event.dataTransfer?.files && event.dataTransfer.files[0]) {
    processFile(event.dataTransfer.files[0])
  }
}

// 读取文件并预览
const processFile = (file: File) => {
  // 这里可以添加文件大小/类型校验
  if (!file.type.startsWith('image/')) return alert('请上传图片文件')

  const reader = new FileReader()
  reader.onload = (e) => {
    const result = e.target?.result as string
    emit('update:modelValue', result) // 更新 v-model 预览
    emit('change', file) // 传出原始 File 对象供上传使用
  }
  reader.readAsDataURL(file)
}
</script>

<template>
  <div class="w-full">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-2">
      {{ label }}
    </label>

    <div
      @click="triggerSelect"
      @dragover.prevent="isDragging = true"
      @dragleave.prevent="isDragging = false"
      @drop.prevent="handleDrop"
      class="relative w-full border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 overflow-hidden group hover:border-blue-400 bg-gray-50"
      :class="[
        aspectRatio,
        isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300',
        !modelValue ? 'flex items-center justify-center' : ''
      ]"
    >
      <!-- Hidden Input -->
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        class="hidden"
        @change="handleFileChange"
      >

      <!-- Preview Image -->
      <img
        v-if="modelValue"
        :src="modelValue"
        class="absolute inset-0 w-full h-full object-cover"
        alt="Preview"
      >

      <!-- Placeholder / Hover Overlay -->
      <div
        v-if="!modelValue || isDragging"
        class="text-center p-4 pointer-events-none"
      >
        <div class="mx-auto h-12 w-12 text-gray-400 mb-2">
           <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
        </div>
        <p class="text-sm text-gray-500">
          <span class="font-semibold text-blue-600">点击上传</span> 或拖拽图片至此
        </p>
        <p class="text-xs text-gray-400 mt-1">支持 PNG, JPG, GIF</p>
      </div>

      <!-- Hover to Replace (Shown when image exists) -->
      <div
        v-if="modelValue && !isDragging"
        class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
      >
        <p class="text-white font-medium">点击更换封面</p>
      </div>
    </div>
  </div>
</template>
