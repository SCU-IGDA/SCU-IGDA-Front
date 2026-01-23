<!-- components/Post/Body.vue -->
<!-- 帖子内容 -->

<script setup lang="ts">
defineProps<{
  content: string // HTML 字符串
}>()
</script>

<template>
  <article
    class="prose prose-lg prose-slate max-w-none
           dark:prose-invert
           prose-img:mx-auto prose-img:rounded-xl prose-img:shadow-md
           prose-a:text-blue-600 hover:prose-a:text-blue-500"
    v-html="content"
  >
  </article>
</template>
