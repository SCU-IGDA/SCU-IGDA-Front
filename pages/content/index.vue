<!-- pages/content.vue -->
<!-- 内容库页面 -->

<script setup lang="ts">
import type { Post } from '~/components/Content/PostListCard.vue'

// 页面元数据（SEO）
useHead({ title: '内容库 - SCU IGDA' })

// 状态管理
const searchQuery = ref('')
const currentCategory = ref('')
const page = ref(1)
const categories = ['程序', '美术', '策划', '音频', '杂谈']

// 模拟数据 (Mock Data)
const pending = ref(false)

const mockPosts: Post[] = [
  {
    id: 1,
    title: '【进击的巨人全集4K超清收藏版】全网最强画质 | 夸克网盘 | 2025最新分享！',
    summary: '本文整理了进击的巨人全四季及剧场版的最高画质资源，附带外挂字幕...',
    author: '资源搬运工',
    date: '2026-01-23',
    category: '资源',
    views: 2304,
    likes: 556,
    cover: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1000&h=400&q=80'
  },
  {
    id: 2,
    title: '拟人动物的历史与文化演变：从图腾、讽刺漫画到现代 Furry',
    summary: '本文尝试以“拟人化”这一认知倾向为切入点，梳理动物形象在不同历史与文化语境中的功能。',
    author: 'FurryClub',
    date: '2026-01-22',
    category: '杂谈',
    views: 18900,
    likes: 2532,
    cover: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1000&h=400&q=80'
  },
  {
    id: 3,
    title: 'Unity DOTS 技术栈落地实战：万人同屏优化指南',
    summary: '从 ECS 架构设计到 Burst Compiler 编译优化，全方位解析高性能游戏开发。',
    author: 'TechLead',
    date: '2026-01-20',
    category: '程序',
    views: 450,
    likes: 89,
    cover: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1000&h=400&q=80'
  },
  {
    id: 4,
    title: '关于社团近期招新面试的统一答疑',
    summary: '针对很多同学关心的作品集提交格式和面试流程问题，我们做了一个汇总。',
    author: 'SCU_IGDA',
    date: '2026-01-18',
    category: '公告',
    views: 5000,
    likes: 120,
    cover: ''
  }
]

const data = computed(() => ({
  posts: mockPosts,
  totalPages: 3
}))
</script>

<template>
  <div class="bg-white dark:bg-gray-900 min-h-screen pb-20 transition-colors duration-300">
    <AppContainer>

      <!-- 1. 顶部区域 (Top Area) -->
      <div class="pt-8 pb-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <!-- 标题 -->
          <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">内容库</h1>

          <!-- 搜索框 -->
          <div class="flex-grow max-w-2xl mx-auto w-full">
            <ContentSearchBar
              v-model="searchQuery"
              @search="page = 1"
            />
          </div>

          <!-- 发布按钮 -->
          <div class="flex-shrink-0">
             <BaseButton to="/content/create" variant="primary" size="md">
               <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
               发布帖子
             </BaseButton>
          </div>
        </div>
      </div>

      <!-- 2. 分区导航 (Category Tabs) -->
      <div class="border-b border-gray-100 dark:border-gray-800 mb-6 sticky top-[64px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-40 py-2 transition-colors">
        <ContentCategoryTabs
          :categories="categories"
          v-model="currentCategory"
          @update:modelValue="page = 1"
        />
      </div>

      <!-- 3. 主布局 (两栏结构) -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

        <!-- 左侧：帖子列表 (占 3/4) -->
        <div class="lg:col-span-3">

          <!-- Loading State -->
          <div v-if="pending" class="space-y-4">
            <div v-for="n in 4" :key="n" class="h-40 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
          </div>

          <!-- Post List -->
          <div v-else class="space-y-4">
            <ContentPostListCard
              v-for="post in data.posts"
              :key="post.id"
              :post="post"
            />

            <!-- 空状态 -->
            <div v-if="data.posts.length === 0" class="py-20 text-center text-gray-500 dark:text-gray-400">
              暂无内容
            </div>
          </div>

          <!-- Pagination -->
          <div class="mt-10">
            <BasePagination
              :page="page"
              :totalPages="data.totalPages"
              @update:page="page = $event"
            />
          </div>
        </div>

        <!-- 右侧：侧边栏 (占 1/4) -->
        <aside class="hidden lg:block space-y-6">
          <!-- 推荐板块 -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 border border-gray-100 dark:border-gray-800 transition-colors">
            <h3 class="font-bold text-gray-900 dark:text-white mb-4">热门标签</h3>
            <div class="flex flex-wrap gap-2">
              <BaseTag clickable>#虚幻引擎5</BaseTag>
              <BaseTag clickable>#AIGC</BaseTag>
              <BaseTag clickable>#独立游戏</BaseTag>
              <BaseTag clickable>#社团招新</BaseTag>
            </div>
          </div>

          <!-- 公告板块 -->
          <div class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
            <h3 class="font-bold text-gray-900 dark:text-white mb-3">📢 社团公告</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              2026年春季招新正在进行中！请有意向加入IGDA的同学点击上方“发布帖子”提交作品集链接。
            </p>
          </div>
        </aside>

      </div>

    </AppContainer>
  </div>
</template>
