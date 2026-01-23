<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
const postId = route.params.id

// --- 1. 模拟文章详情数据 ---
const post = ref({
  id: postId,
  title: 'Unity Shader 入门精要：从渲染管线到光照模型',
  cover: 'https://images.unsplash.com/photo-1616499370260-485b3e5ed653?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80',
  author: {
    name: 'TechLead',
    avatar: '',
    date: '2026-01-23'
  },
  tags: ['程序', '渲染', 'Unity', '入门'],
  content: `
    <p>在游戏开发中，Shader（着色器）是连接美术与程序的桥梁。本文将带你深入理解渲染管线的基本流程。</p>
    <h2>1. 什么是渲染管线？</h2>
    <p>渲染管线是指 GPU 将 3D 模型顶点数据转换为屏幕上 2D 像素的过程。</p>
    <img src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80" alt="渲染管线示意图" />
    <p>如上图所示，我们通常关注顶点着色器和片元着色器两个阶段。</p>
    <blockquote>Shader 是一段运行在 GPU 上的小程序，它决定了像素的颜色。</blockquote>
  `
})

// --- 2. 模拟评论数据 ---
const comments = ref([
  {
    id: 1,
    user: '新手小白',
    date: '2026-01-23 14:20',
    content: '写的太好了，终于看懂了渲染管线！'
  },
  {
    id: 2,
    user: 'GraphicsPro',
    date: '2026-01-23 15:45',
    content: '建议补充一下关于延迟渲染的部分。'
  }
])

const commentInput = ref('')
</script>

<template>
  <div class="bg-gray-100 dark:bg-gray-900 min-h-screen py-8 transition-colors duration-300">
    <AppContainer>
      <div class="max-w-4xl mx-auto space-y-6">

        <!-- 模块一：文章主体卡片 -->
        <article class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-transparent dark:border-gray-700">

          <!-- 1. 封面图片 -->
          <div class="w-full h-[300px] md:h-[400px] bg-gray-200 dark:bg-gray-700">
            <img
              :src="post.cover"
              class="w-full h-full object-cover"
              alt="封面"
            >
          </div>

          <!-- 2. 标题区域 -->
          <div class="px-8 pt-8 pb-4">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
              {{ post.title }}
            </h1>
          </div>

          <!-- 3. 作者栏 -->
          <div class="px-8 py-4 border-t border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>
              <div class="flex flex-col">
                <span class="font-bold text-gray-900 dark:text-gray-100 text-sm">{{ post.author.name }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">发布于 {{ post.author.date }}</span>
              </div>
            </div>

            <div class="flex gap-2">
              <div
                v-for="tag in post.tags"
                :key="tag"
                class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs border border-gray-200 dark:border-gray-600"
              >
                {{ tag }}
              </div>
            </div>
          </div>

          <!-- 4. 文章内容 -->
          <div class="px-8 py-8 min-h-[300px]">
            <PostBody :content="post.content" />
          </div>

          <!-- 5. 底部操作栏 -->
          <div class="bg-gray-100 dark:bg-gray-900/50 px-8 py-4 flex justify-end items-center gap-3 border-t border-gray-200 dark:border-gray-700">
            <BaseButton variant="outline" size="sm" class="bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300">
              👍 点赞
            </BaseButton>
            <BaseButton variant="outline" size="sm" class="bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300">
              ↪ 转发
            </BaseButton>
          </div>

        </article>

        <!-- 模块二：评论区 -->
        <section class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-transparent dark:border-gray-700">
          <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">评论区</h3>

          <!-- 1. 评论输入框区域 -->
          <div class="flex gap-4 mb-10">
            <div class="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded overflow-hidden flex-shrink-0">
               <svg class="w-full h-full text-gray-400 dark:text-gray-500 p-2" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
            </div>

            <div class="flex-grow">
              <div class="relative">
                <textarea
                  v-model="commentInput"
                  rows="3"
                  placeholder="发一条友善的评论..."
                  class="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                ></textarea>
                <div class="flex justify-end mt-2">
                  <BaseButton variant="primary" size="sm">发布按钮</BaseButton>
                </div>
              </div>
            </div>
          </div>

          <hr class="border-gray-100 dark:border-gray-700 mb-8" />

          <!-- 2. 评论列表 -->
          <div class="space-y-8">
            <div v-for="comment in comments" :key="comment.id" class="flex gap-4">
              <div class="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded flex-shrink-0"></div>

              <div class="flex-grow">
                <div class="inline-block bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300 mb-1 rounded-sm">
                  {{ comment.user }}
                </div>
                <div class="inline-block ml-2 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400 mb-1 rounded-sm">
                  {{ comment.date }}
                </div>

                <div class="mt-2 bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm text-gray-700 dark:text-gray-200">
                  {{ comment.content }}
                </div>
              </div>
            </div>
          </div>

        </section>

      </div>
    </AppContainer>
  </div>
</template>

<style scoped>
:deep(.post-content img) {
  margin: 2rem auto;
  max-width: 80%;
  background-color: #e5e7eb;
}

.dark :deep(.post-content img) {
  background-color: #374151;
}
</style>
