<script setup lang="ts">
	// 引入类型定义
	import type { Post } from '~/components/Content/PostListCard.vue'

	// 页面元数据
	useHead({ title: '内容库 - SCU IGDA' })

	// 获取运行时配置 (用于拿到 apiBase)
	const config = useRuntimeConfig()

	// 使用全局公告
	const { announcement } = useAnnouncement()

	// --- 状态管理 ---
	const searchQuery = ref('')
	const appliedSearchQuery = ref('') // 实际应用的搜索词
	const currentCategory = ref('')
	const page = ref(1)
	const PAGE_SIZE = 5
	const categories = ['程序', '美术', '策划', '音频', '杂谈', '资源', '公告']

	// --- 🔥 数据获取核心逻辑 (修改处) ---

	// 定义后端返回的数据接口类型 (根据你的 Hono 代码推断)
	interface ApiArticle {
		id : number
		userId : number
		title : string
		content : string
		summary : string // 或者 abstract，取决于你数据库 SELECT 查的是哪个字段，下面做了兼容
		abstract ?: string
		category : string
		date : string
		views : number
		likes : number
		coverUrl : string
		author : {
			username : string
			avatar : string
		}
	}

	// 请求后端数据
	// 注意：这里假设你在 nuxt.config.ts 中配置了 public.apiBase，或者使用了代理
	// 如果没有配置，这里需要写完整的 URL，例如 'https://你的worker地址.workers.dev/article/list'
	const { data: postsData, pending, refresh } = await useFetch<ApiArticle[]>('/article/list', {
		baseURL: config.public.apiBase,
		method: 'GET',
		server: false,
		lazy: true,
		// 数据转换：将后端格式清洗为前端组件(Post)需要的格式
		transform: (response) => {
			// 容错处理：如果后端返回 {message: "暂无文章"} 或 null
			if (!response || !Array.isArray(response)) {
				return []
			}

			return response.map((item) => ({
				id: item.id,
				title: item.title,
				// 兼容后端可能查的是 summary 也可能查的是 abstract
				summary: item.summary || item.abstract || '暂无简介',
				// 后端返回的是 author 对象，前端组件只需要名字字符串
				author: item.author?.username || '未知作者',
				// 处理日期格式，假设后端返回 ISO 字符串
				date: item.date ? item.date.split('T')[0] : '近期',
				category: item.category,
				views: item.views || 0,
				likes: item.likes || 0,
				// 字段映射 coverUrl -> cover
				cover: item.coverUrl || ''
			})) as Post[]
		}
	})

	// 最终使用的文章列表 (如果有数据则使用，否则为空数组)
	const allPosts = computed(() => postsData.value || [])

	// --- 词云数据 (保持 Mock，暂不从后端获取) ---
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

	// 过滤逻辑 (基于 allPosts)
	const filteredPosts = computed(() => {
		return allPosts.value.filter(post => {
			const matchesCategory = currentCategory.value === '' || post.category === currentCategory.value
			const query = appliedSearchQuery.value.toLowerCase().trim()

			// 防止字段为空导致报错
			const title = post.title || ''
			const summary = post.summary || ''

			const matchesSearch = title.toLowerCase().includes(query) ||
				summary.toLowerCase().includes(query)
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
		applySearch()
	})

	const handleTagSelect = (tagName : string) => {
		searchQuery.value = tagName
		applySearch()
	}
</script>

<template>
	<div class="bg-white dark:bg-gray-900 min-h-screen pb-20 transition-colors duration-300 select-none">
		<AppContainer>

			<!-- 顶部区域 -->
			<div class="pt-8 pb-4">
				<div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
					<h1 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">内容库</h1>

					<div class="flex-grow max-w-2xl mx-auto w-full">
						<ContentSearchBar v-model="searchQuery" @search="applySearch" />
					</div>

					<div class="flex-shrink-0">
						<BaseButton to="/content/create" variant="primary" size="md">
							<svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M12 4v16m8-8H4" />
							</svg>
							发布帖子
						</BaseButton>
					</div>
				</div>
			</div>

			<!-- 分区导航 -->
			<div
				class="border-b border-gray-100 dark:border-gray-800 mb-6 sticky top-[64px] bg-white/80 dark:bg-gray-900/80 backdrop-blur-md z-40 py-2 transition-colors">
				<ContentCategoryTabs :categories="categories" v-model="currentCategory" />
			</div>

			<!-- 主布局 -->
			<div class="grid grid-cols-1 lg:grid-cols-4 gap-8">

				<!-- 左侧：帖子列表 -->
				<div class="lg:col-span-3">

					<!-- 骨架屏：当 pending 为 true 时显示 -->
					<div v-if="pending" class="space-y-4">
						<div v-for="n in 5" :key="n" class="h-40 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse">
						</div>
					</div>

					<!-- 真实数据列表 -->
					<div v-else class="space-y-4">
						<ContentPostListCard v-for="post in paginatedPosts" :key="post.id" :post="post" />

						<!-- 空状态：数据加载完了，但是过滤后没有结果 -->
						<div v-if="filteredPosts.length === 0" class="py-20 text-center">
							<div class="text-6xl mb-4">🔍</div>
							<p class="text-gray-500 dark:text-gray-400 text-lg">
								{{ allPosts.length === 0 ? '暂时还没有文章' : '没有找到相关内容' }}
							</p>
							<p v-if="allPosts.length > 0" class="text-gray-400 dark:text-gray-500 text-sm mt-2">
								请尝试更换搜索词或分类</p>
						</div>
					</div>

					<div v-if="filteredPosts.length > 0" class="mt-10">
						<BasePagination :page="page" :totalPages="totalPages" @update:page="page = $event" />
					</div>
				</div>

				<!-- 右侧：侧边栏 -->
				<aside class="hidden lg:block space-y-6">
					<!-- 推荐板块 (词云化) -->
					<div
						class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800 transition-colors">
						<h3 class="font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 font-sans">
							<svg class="w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
								<path
									d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z">
								</path>
							</svg>
							热门标签
						</h3>

						<AppTagCloud :tags="trendingTags" @select="handleTagSelect" />
					</div>

					<div
						class="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-800 shadow-sm transition-colors">
						<h3 class="font-bold text-gray-900 dark:text-white mb-3 font-sans">{{ announcement.title }}</h3>
						<p class="text-sm text-gray-600 dark:text-gray-400 leading-relaxed select-text font-sans">
							{{ announcement.content }}
						</p>
					</div>
				</aside>

			</div>

		</AppContainer>
	</div>
</template>