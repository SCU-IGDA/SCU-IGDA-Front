<!-- components/Post/AuthorCard.vue -->
<!-- 帖子作者信息 -->

<script setup lang="ts">
defineProps<{
  authorName: string
}>()
</script>

<template>
  <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
    <div class="flex items-center space-x-4 mb-4">
      <div class="w-16 h-16 rounded-full bg-gray-200 flex-shrink-0">
        <!-- Placeholder -->
      </div>
      <div>
        <h3 class="text-lg font-bold text-gray-900 dark:text-white">{{ authorName }}</h3>
        <p class="text-xs text-gray-500">资深游戏开发者</p>
      </div>
    </div>

    <div class="flex gap-2">
      <BaseButton variant="primary" size="sm" class="w-full">关注</BaseButton>
      <BaseButton variant="outline" size="sm" class="w-full">私信</BaseButton>
    </div>

    <div class="mt-6 pt-6 border-t border-gray-100">
      <p class="text-sm text-gray-500 mb-2">近期发布</p>
      <ul class="space-y-2">
        <li class="text-sm truncate cursor-pointer hover:text-blue-600">
          • 虚幻引擎材质系统详解
        </li>
        <li class="text-sm truncate cursor-pointer hover:text-blue-600">
          • 独立游戏宣发避坑指南
        </li>
      </ul>
    </div>
  </div>
</template>
