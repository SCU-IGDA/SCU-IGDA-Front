<!-- pages/index.vue -->
<!-- 首页 -->

<script setup lang="ts">
// 页面元数据（SEO）
useHead({
  title: 'SCU IGDA - 四川大学游戏开发与研究社',
  meta: [
    { name: 'description', content: '四川大学游戏开发与研究社官方网站，提供游戏开发资源、教程与社团活动信息。' }
  ]
})

// 模拟“内容库”的精选数据
// TODO: 替换为 const { data } = await useFetch('/api/posts/featured')
const featuredPosts = [
  {
    id: 1,
    title: '拟人动物的历史与文化演变：从图腾到 Furry',
    category: '杂谈',
    author: 'FurryFandomClub',
    date: '2026-01-20',
    cover: 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    summary: '本文尝试以“拟人化”这一认知倾向为切入点，梳理动物形象在不同历史与文化语境中的功能...'
  },
  {
    id: 2,
    title: 'Unity Shader 入门：渲染管线基础',
    category: '程序',
    author: 'TechLead',
    date: '2026-01-18',
    cover: 'https://images.unsplash.com/photo-1616499370260-485b3e5ed653?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    summary: '从零开始解析渲染管线流程，帮助美术同学理解 Shader 的工作原理。'
  },
  {
    id: 3,
    title: '2026年充电头选购指南',
    category: '数码',
    author: '中二数码台',
    date: '2026-01-15',
    cover: 'https://images.unsplash.com/photo-1585338107529-13afc5f02586?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    summary: '距离上期的充电头选购指南南辕北辙指南已经过去...'
  }
]

// 滚动到下一屏
const scrollToContent = () => {
  const contentSection = document.getElementById('content-section')
  contentSection?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <div class="flex flex-col transition-colors duration-300">

    <!-- Section 1: Hero Banner -->
    <section class="relative h-[90vh] flex flex-col items-center justify-center bg-white dark:bg-gray-900 overflow-hidden transition-colors duration-300">
      <div class="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#334155_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none"></div>

      <div class="z-10 text-center space-y-8 px-4 animate-fade-in-up">
        <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          SCU IGDA
        </h1>

        <div class="space-y-2">
          <p class="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 font-light">
            四川大学游戏开发与研究社
          </p>
          <p class="text-sm md:text-base text-gray-400 dark:text-gray-500 tracking-widest uppercase mt-4">
            —— 成为游戏背后的缔造者 ——
          </p>
        </div>

        <!-- Action Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 mt-8 justify-center">
          <BaseButton to="/activities" variant="outline" size="lg" class="min-w-[140px] dark:border-gray-700 dark:text-gray-300">
            近期活动
          </BaseButton>

          <BaseButton to="/content" variant="primary" size="lg" class="min-w-[140px] shadow-lg shadow-blue-200 dark:shadow-blue-900/20">
            内容库
          </BaseButton>

          <BaseButton to="/teams" variant="outline" size="lg" class="min-w-[140px] dark:border-gray-700 dark:text-gray-300" disabled>
            组队系统
            <span class="ml-2 text-[10px] bg-gray-100 dark:bg-gray-800 px-1 rounded text-gray-500">Dev</span>
          </BaseButton>
        </div>
      </div>

      <!-- Scroll Indicator -->
      <button
        @click="scrollToContent"
        class="absolute bottom-10 animate-bounce text-gray-400 dark:text-gray-600 hover:text-gray-600 dark:hover:text-gray-400 transition cursor-pointer"
        aria-label="Scroll down"
      >
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path></svg>
      </button>
    </section>


    <!-- Section 2: Latest Content -->
    <section id="content-section" class="py-20 bg-gray-50 dark:bg-gray-800/50 transition-colors duration-300">
      <AppContainer>
        <div class="flex justify-between items-end mb-10">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white">精选内容</h2>
            <p class="mt-2 text-gray-500 dark:text-gray-400">来自社团成员的干货分享与创作杂谈</p>
          </div>
          <BaseButton to="/content" variant="ghost" class="group dark:text-gray-400">
            查看更多
            <span class="ml-1 group-hover:translate-x-1 transition-transform">→</span>
          </BaseButton>
        </div>

        <!-- Grid Layout -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <NuxtLink
            v-for="post in featuredPosts"
            :key="post.id"
            :to="`/content/${post.id}`"
            class="group h-full block"
          >
            <BaseCard hover class="flex flex-col h-full cursor-pointer" padding="p-0">
              <div class="aspect-video w-full overflow-hidden bg-gray-200 dark:bg-gray-700 relative">
                <img :src="post.cover" :alt="post.title" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105">
                <div class="absolute top-3 left-3">
                   <BaseTag active class="shadow-sm">{{ post.category }}</BaseTag>
                </div>
              </div>

              <div class="p-5 flex flex-col flex-grow">
                <h3 class="text-lg font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {{ post.title }}
                </h3>
                <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-grow">
                  {{ post.summary }}
                </p>

                <div class="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 text-xs text-gray-400">
                  <span class="flex items-center gap-2">
                    <div class="w-5 h-5 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                    {{ post.author }}
                  </span>
                  <span>{{ post.date }}</span>
                </div>
              </div>
            </BaseCard>
          </NuxtLink>
        </div>
      </AppContainer>
    </section>

    <!-- Section 3: Call to Action -->
    <section class="py-24 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 transition-colors duration-300">
      <AppContainer>
        <div class="bg-gray-900 dark:bg-black rounded-2xl p-10 md:p-16 text-center text-white relative overflow-hidden border border-gray-800">
          <div class="relative z-10 max-w-2xl mx-auto space-y-6">
            <h2 class="text-3xl md:text-4xl font-bold">加入我们，一起创作</h2>
            <p class="text-gray-300 text-lg">
              无论你是程序、美术、策划还是音频，SCU IGDA 期待你的加入。
            </p>
            <div class="pt-4">
              <BaseButton to="/join" variant="primary" size="lg" class="bg-white text-black hover:bg-gray-100 border-none">
                申请加入社团
              </BaseButton>
            </div>
          </div>

          <div class="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-20"></div>
          <div class="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2 w-64 h-64 bg-purple-600 rounded-full blur-[100px] opacity-20"></div>
        </div>
      </AppContainer>
    </section>

  </div>
</template>

<style scoped>
.animate-fade-in-up {
  animation: fadeInUp 0.8s ease-out forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
