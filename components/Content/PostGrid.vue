<!-- components/Content/PostGrid.vue -->

<script setup lang="ts">
import type { Post } from './PostListCard.vue'
import PostListCard from './PostListCard.vue'

interface Props {
  posts: Post[]
  loading: boolean
  page: number
  totalPages: number
}

defineProps<Props>()
defineEmits(['update:page'])
</script>

<template>
  <div class="space-y-6">

    <!-- 1. Loading State -->
    <div v-if="loading" class="space-y-4 animate-pulse">
      <div v-for="n in 5" :key="n" class="h-40 bg-gray-200 rounded-xl"></div>
    </div>

    <!-- 2. Empty State -->
    <div v-else-if="posts.length === 0" class="py-20 text-center">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
        <svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
      </div>
      <h3 class="text-lg font-medium text-gray-900 dark:text-white">没有找到相关内容</h3>
      <p class="text-gray-500 mt-1">请尝试切换分类或搜索其他关键词</p>
    </div>

    <!-- 3. Post List -->
    <div v-else class="grid grid-cols-1 gap-4">
      <PostListCard
        v-for="post in posts"
        :key="post.id"
        :post="post"
      />
    </div>

    <!-- 4. Pagination -->
    <div v-if="!loading && posts.length > 0" class="mt-8 border-t border-gray-100">
      <BasePagination
        :page="page"
        :totalPages="totalPages"
        @update:page="$emit('update:page', $event)"
      />
    </div>

  </div>
</template>
