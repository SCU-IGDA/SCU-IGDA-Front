<!-- components/Post/Header.vue -->
<!-- 帖子头部 -->

<script setup lang="ts">
import type { Post } from '~/components/Content/PostListCard.vue'

defineProps<{
  post: Post
}>()
</script>

<template>
  <div class="mb-8 border-b border-gray-100 pb-8">
    <!-- 1. 封面图 (16:9) -->
    <div v-if="post.cover" class="w-full aspect-video rounded-xl overflow-hidden bg-gray-100 mb-8 shadow-sm">
      <img
        :src="post.cover"
        :alt="post.title"
        class="w-full h-full object-cover"
      >
    </div>

    <!-- 2. 标题 -->
    <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white leading-tight mb-4">
      {{ post.title }}
    </h1>

    <!-- 3. 元信息 (作者、时间、数据) -->
    <div class="flex items-center text-sm text-gray-500 space-x-6">
      <!-- Author -->
      <div class="flex items-center space-x-2">
         <div class="w-6 h-6 rounded-full bg-gray-200">
           <!-- Avatar Placeholder -->
         </div>
         <span class="font-medium text-gray-900 dark:text-white">{{ post.author }}</span>
      </div>

      <!-- Date -->
      <span>{{ post.date }}</span>

      <!-- Category -->
      <span class="text-blue-600 bg-blue-50 px-2 py-0.5 rounded text-xs font-bold">
        {{ post.category }}
      </span>

      <!-- Stats -->
      <div class="flex space-x-4 ml-auto">
        <span class="flex items-center gap-1">👁 {{ post.views }}</span>
        <span class="flex items-center gap-1">👍 {{ post.likes }}</span>
      </div>
    </div>
  </div>
</template>
