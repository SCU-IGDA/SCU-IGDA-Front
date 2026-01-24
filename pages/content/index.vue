<script setup lang="ts">
import type { Post } from '~/components/Content/PostListCard.vue'

// 页面元数据
useHead({ title: '内容库 - SCU IGDA' })

// --- 状态管理 ---
const searchQuery = ref('')
const appliedSearchQuery = ref('') // 实际应用的搜索词
const currentCategory = ref('')
const page = ref(1)
const PAGE_SIZE = 5
const categories = ['程序', '美术', '策划', '音频', '杂谈', '资源', '公告']

// --- 模拟数据 ---
const allMockPosts: Post[] = [
  {
    id: 1,
    title: '【进击的巨人全集4K超清收藏版】全网最强画质 | 夸克网盘',
    summary: '本文整理了进击的巨人全四季及剧场版的最高画质资源...',
    author: '资源搬运工',
    date: '2026-01-23',
    category: '资源',
    views: 2304,
    likes: 556,
    cover: 'https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&w=1000&h=400&q=80'
  },
  {
    id: 2,
    title: '拟人动物的历史与文化演变：从图腾到 Furry',
    summary: '梳理动物形象在不同历史与文化语境中的功能。',
    author: 'FurryClub',
    date: '2026-01-22',
    category: '杂谈',
    views: 18900,
    likes: 2532,
    cover: 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?auto=format&fit=crop&w=1000&h=400&q=80'
  },
  {
    id: 3,
    title: 'Unity DOTS 技术栈落地实战',
    summary: '全方位解析高性能游戏开发，ECS 架构设计。',
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
    summary: '针对很多同学关心的作品集提交格式和面试流程问题。',
    author: 'SCU_IGDA',
    date: '2026-01-18',
    category: '公告',
    views: 5000,
    likes: 120,
    cover: ''
  },
  {
    id: 5,
    title: 'Blender 风格化渲染：三渲二完全指南',
    summary: '如何使用 Eevee 引擎制作日式赛璐珞风格的渲染效果。',
    author: 'ArtMaster',
    date: '2026-01-17',
    category: '美术',
    views: 1200,
    likes: 340,
    cover: 'https://images.unsplash.com/photo-1615184697985-c9bde1b07da7?auto=format&fit=crop&w=1000&h=400&q=80'
  },
  {
    id: 6,
    title: '独立游戏音效设计：如何营造恐怖氛围',
    summary: '通过 FMOD 实现动态音频，让玩家身临其境。',
    author: 'SoundLab',
    date: '2026-01-16',
    category: '音频',
    views: 800,
    likes: 150,
    cover: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1000&h=400&q=80'
  },
  {
    id: 7,
    title: '游戏关卡设计基础：引导与阻塞',
    summary: '解析马里奥与塞尔达中的非语言引导设计。',
    author: 'LevelUp',
    date: '2026-01-15',
    category: '策划',
    views: 950,
    likes: 210,
    cover: 'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?auto=format&fit=crop&w=1000&h=400&q=80'
  },
  {
    id: 8,
    title: 'C++ 内存管理高级技巧',
    summary: '智能指针与自定义分配器的深度解析。',
    author: 'CodeGuru',
    date: '2026-01-14',
    category: '程序',
    views: 600,
    likes: 110,
    cover: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=1000&h=400&q=80'
  },
  {
    id: 9,
    title: '2025年度最佳独立游戏盘点',
    summary: '那些你可能错过的宝藏游戏推荐。',
    author: 'GamerDaily',
    date: '2026-01-12',
    category: '杂谈',
    views: 3000,
    likes: 800,
    cover: 'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?auto=format&fit=crop&w=1000&h=400&q=80'
  }
]

// 词云数据
const trendingTags = [
  { name: '虚幻引擎5', weight: 5 },
  { name: 'Unity', weight: 4 },
  { name: '独立游戏', weight: 4 },
  { name: 'AIGC', weight: 3 },
  { name: '赛博朋克', weight: 2 },
  { name: '社团招新', weight: 5 },
  { name: '渲染管线', weight: 3 },
  { name: 'Shader', weight: 3 },
  { name: 'Blender', weight: 4 },
  { name: '关卡设计', weight: 2 },
  { name: 'FMOD', weight: 2 },
  { name: '像素艺术', weight: 1 },
  { name: '数值策划', weight: 1 }
]

// --- 核心逻辑 ---

// 应用搜索：将当前输入框的值设置为实际应用的搜索词
const applySearch = () => {
  appliedSearchQuery.value = searchQuery.value
  page.value = 1
}

const filteredPosts = computed(() => {
  return allMockPosts.filter(post => {
    const matchesCategory = currentCategory.value === '' || post.category === currentCategory.value
    const query = appliedSearchQuery.value.toLowerCase().trim()
    const matchesSearch = post.title.toLowerCase().includes(query) ||
                          post.summary.toLowerCase().includes(query)
    return matchesCategory && matchesSearch
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredPosts.value.length / PAGE_SIZE) || 1
})

const paginatedPosts = computed(() => {
  const start = (page.value - 1) * PAGE_SIZE
  const end = start + PAGE_SIZE
  return filteredPosts.value.slice(start, end)
})

// --- 交互优化 ---

// 当分类变化时，自动应用搜索（保持原有行为）
watch([currentCategory], () => {
  page.value = 1
  // 分类变化时也应用当前搜索词
  applySearch()
})

const handleTagSelect = (tagName: string) => {
  searchQuery.value = tagName
  applySearch()
}

const pending = ref(false)
</script>

<template>
  <div class="bg-white dark:bg-gray-900 min-h-screen pb-20 transition-colors duration-300 select-none">
    <AppContainer>

      <!-- 顶部区域 -->
      <div class="pt-8 pb-4">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">内容库</h1>

          <div class="flex-grow max-w-2xl mx-auto w-full">
            <ContentSearchBar
              v-model="searchQuery"
              @search="applySearch"
            />
          </div>

          <div class="flex-shrink-0">
             <BaseButton to="/content/create" variant="primary" size="md">
               <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
               发布帖子
             </BaseButton>
          </div>
        </div>
      </div>

      <!-- 分区导航 -->
      <div class="border-b border-gray-100 dark:border-gray-800 mb-6 sticky top-[64px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-40 py-2 transition-colors">
        <ContentCategoryTabs
          :categories="categories"
          v-model="currentCategory"
        />
      </div>

      <!-- 主布局 -->
      <div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

        <!-- 左侧：帖子列表 -->
        <div class="lg:col-span-3">

          <div v-if="pending" class="space-y-4">
            <!-- TODO: 将 4 改为 15 -->
            <div v-for="n in 4" :key="n" class="h-40 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse"></div>
          </div>

          <div v-else class="space-y-4">
            <ContentPostListCard
              v-for="post in paginatedPosts"
              :key="post.id"
              :post="post"
            />

            <div v-if="filteredPosts.length === 0" class="py-20 text-center">
              <div class="text-6xl mb-4">🔍</div>
              <p class="text-gray-500 dark:text-gray-400 text-lg">没有找到相关内容</p>
              <p class="text-gray-400 dark:text-gray-500 text-sm mt-2">请尝试更换搜索词或分类</p>
            </div>
          </div>

          <div v-if="filteredPosts.length > 0" class="mt-10">
            <BasePagination
              :page="page"
              :totalPages="totalPages"
              @update:page="page = $event"
            />
          </div>
        </div>

        <!-- 右侧：侧边栏 -->
        <aside class="hidden lg:block space-y-6">
          <!-- 推荐板块 (词云化) -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 transition-colors">
            <h3 class="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 font-sans">
              <svg class="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20"><path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
              热门标签
            </h3>

            <AppTagCloud
              :tags="trendingTags"
              @select="handleTagSelect"
            />
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
            <h3 class="font-bold text-gray-900 dark:text-white mb-3 font-sans">📢 社团公告</h3>
            <p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed select-text font-sans">
              2026年春季招新正在进行中！请有意向加入IGDA的同学点击上方“发布帖子”提交作品集链接。
            </p>
          </div>
        </aside>

      </div>

    </AppContainer>
  </div>
</template>
