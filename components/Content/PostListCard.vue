<!-- components/Content/PostListCard.vue -->
<!-- 内容库帖子列表项 -->

<script setup lang="ts">
// 定义帖子数据结构接口
// TODO: username
export interface Post {
  id: string | number     // 帖子唯一标识
  title: string           // 帖子标题
  summary: string         // 帖子摘要
  cover?: string          // 帖子封面图片
  author: string          // 帖子作者
  date: string            // 帖子发布时间
  category: string        // 帖子分类
  views?: number          // 帖子浏览量
  likes?: number          // 帖子点赞数
}

defineProps<{
  post: Post
}>()
</script>

<template>
  <NuxtLink :to="`/content/${post.id}`" class="block group">
    <BaseCard hover class="h-full flex flex-col sm:flex-row overflow-hidden" padding="p-0">

      <!-- Left: Text Content -->
      <div class="flex-1 p-5 flex flex-col justify-between order-2 sm:order-1">
        <div>
          <!-- Tags & Meta -->
          <div class="flex items-center gap-2 mb-2">
            <span class="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {{ post.category }}
            </span>
            <span class="text-xs text-gray-400">{{ post.date }}</span>
          </div>

          <!-- Title -->
          <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {{ post.title }}
          </h3>

          <!-- Summary -->
          <p class="text-sm text-gray-500 line-clamp-2 mb-4">
            {{ post.summary }}
          </p>
        </div>

        <!-- Bottom: Author & Stats -->
        <div class="flex items-center text-xs text-gray-400 gap-4 mt-auto pt-2">
          <div class="flex items-center gap-1.5 hover:text-gray-700 transition">
            <div class="w-5 h-5 rounded-full bg-gray-200 overflow-hidden">
              <!-- Avatar Placeholder -->
              <svg class="w-full h-full text-gray-400" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
            </div>
            <span>{{ post.author }}</span>
          </div>

          <div class="flex gap-3 ml-auto">
            <span class="flex items-center gap-1">
               <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/></svg>
               {{ post.views || 0 }}
            </span>
            <span class="flex items-center gap-1">
               <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"/></svg>
               {{ post.likes || 0 }}
            </span>
          </div>
        </div>
      </div>

      <!-- Right: Cover Image (5:2 aspect ratio visually controlled via container on Desktop) -->
      <div
        class="w-full sm:w-48 md:w-64 h-48 sm:h-auto flex-shrink-0 bg-gray-100 relative order-1 sm:order-2"
      >
        <img
          v-if="post.cover"
          :src="post.cover"
          :alt="post.title"
          class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        >
        <div v-else class="absolute inset-0 flex items-center justify-center text-gray-300">
           <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        </div>
      </div>

    </BaseCard>
  </NuxtLink>
</template>
