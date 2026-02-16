<script setup lang="ts">
	// 引入路由和工具
	const route = useRoute()
	const router = useRouter()
	const config = useRuntimeConfig()
	const postId = route.params.id

	// --- 定义接口类型 ---
	interface ApiArticleDetail {
		id : number
		title : string
		content : string
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

	// --- 1. 获取文章详情数据 ---
	// 使用 lazy: true 和 server: false 避免服务端渲染阻塞，防止页面卡顿
	const { data: post, pending, error } = await useFetch<ApiArticleDetail>(`article/specific/${postId}`, {
		baseURL: config.public.apiBase,
		method: 'GET',
		server: false, // 建议：客户端获取，避免后端响应慢导致首屏卡死
		lazy: true,
		transform: (data) => {
			return {
				id: data.id,
				title: data.title,
				// 后端 coverUrl 映射给前端 cover
				cover: data.coverUrl || '',
				// 映射作者信息，把文章日期放这里（为了适配你的 UI 结构）
				author: {
					name: data.author?.username || '未知作者',
					avatar: data.author?.avatar || '',
					date: data.date ? data.date.split('T')[0] : '未知日期'
				},
				// 后端是一个 category 字符串，前端 UI 是 tags 数组，做一下转换
				tags: data.category ? [data.category] : [],
				content: data.content || '',
				likes: data.likes || 0,
				views: data.views || 0
			}
		}
	})

	// --- 2. 交互逻辑：增加阅读量 & 点赞 ---

	// --- 增加阅读量 (进入页面后自动触发) ---
	onMounted(() => {
	  if (postId) {
	    // 1. 构建表单数据对象
	    const formData = new FormData()
	    formData.append('articleId', String(postId)) // 确保转为字符串
	
	    $fetch('/article/addView', {
	      baseURL: config.public.apiBase,
	      method: 'POST',
	      body: formData // 👈 重点：传 FormData，而不是普通对象
	    }).catch(err => console.error('增加阅读量失败', err))
	  }
	})
	
	// --- 处理点赞 ---
	const isLiking = ref(false)
	const handleLike = async () => {
	  if (isLiking.value || !post.value) return
	  isLiking.value = true
	
	  try {
	    // 1. 构建表单数据对象
	    const formData = new FormData()
	    formData.append('articleId', String(postId))
	
	    await $fetch('/article/addLike', {
	      baseURL: config.public.apiBase,
	      method: 'POST',
	      body: formData // 👈 重点：传 FormData
	    })
	
	    // 乐观更新：如果不报错，直接在前端 +1
	    post.value.likes += 1
	  } catch (error) {
	    console.error('点赞失败', error)
	    alert('点赞失败，请稍后重试')
	  } finally {
	    isLiking.value = false
	  }
	}


	// --- 3. 评论数据 (保持 Mock，后端暂未实现) ---
	const comments = ref([
		{
			id: 1,
			user: '系统管理员',
			date: '2026-01-23 14:20',
			content: '评论功能正在开发中，敬请期待！'
		}
	])
	const commentInput = ref('')
	
	const handleEdit = () => {
	    router.push(`/content/edit/${postId}`)
	}
</script>


<template>
	<div class="bg-gray-100 dark:bg-gray-900 min-h-screen py-8 transition-colors duration-300">
		<AppContainer>
			<!-- Loading 状态 -->
			<div v-if="pending" class="max-w-4xl mx-auto py-20 text-center">
				<div class="animate-spin text-4xl mb-4">⌛</div>
				<p class="text-gray-500">文章加载中...</p>
			</div>

			<!-- Error 状态 -->
			<div v-else-if="error || !post" class="max-w-4xl mx-auto py-20 text-center">
				<div class="text-4xl mb-4">😕</div>
				<p class="text-gray-500">文章不存在或已被删除</p>
				<BaseButton to="/content" variant="outline" class="mt-4">返回列表</BaseButton>
			</div>

			<div v-else class="max-w-4xl mx-auto space-y-6">

				<article
					class="bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden border border-transparent dark:border-gray-700">

					<!-- 1. 封面 -->
					<div v-if="post.cover" class="w-full h-[300px] md:h-[400px] bg-gray-200 dark:bg-gray-700">
						<img :src="post.cover" class="w-full h-full object-cover" alt="封面">
					</div>

					<!-- 2. 标题 -->
					<div class="px-8 pt-8 pb-4">
						<h1 class="text-3xl font-bold text-gray-900 dark:text-white leading-tight">
							{{ post.title }}
						</h1>
					</div>

					<!-- 3. 作者栏 -->
					<!-- 3. 作者栏 -->
					<div class="px-8 py-4 border-t border-b border-gray-100 dark:border-gray-700 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none">
					    
					    <!-- 左侧：作者信息 -->
					    <div class="flex items-center gap-3">
					        <div class="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0 overflow-hidden">
					            <img v-if="post.author.avatar" :src="post.author.avatar" class="w-full h-full object-cover">
					        </div>
					        <div class="flex flex-col">
					            <span class="font-bold text-gray-900 dark:text-gray-100 text-sm">
					                {{ post.author.name }}
					            </span>
					            <span class="text-xs text-gray-500 dark:text-gray-400">
					                发布于 {{ post.author.date }} · {{ post.views }} 阅读
					            </span>
					        </div>
					    </div>
					
					    <!-- 右侧：操作区 (标签 + 编辑按钮) -->
					    <div class="flex items-center gap-3">
					        
					        <!-- 🌟 编辑按钮 (仅有权限时显示) -->
					        <BaseButton
					            @click="handleEdit" 
					            size="sm" 
					            variant="outline"
					            class="text-blue-600 border-blue-200 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-800 dark:hover:bg-blue-900/30"
					        >
					            ✎ 编辑文章
					        </BaseButton>
					
					        <!-- 标签 -->
					        <div class="flex gap-2">
					            <div v-for="tag in post.tags" :key="tag"
					                class="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs border border-gray-200 dark:border-gray-600 rounded">
					                {{ tag }}
					            </div>
					        </div>
					    </div>
					</div>

					<!-- 4. 正文 -->
					<div class="px-8 py-8 min-h-[300px]">
						<PostBody :content="post.content" />
					</div>

					<!-- 5. 底部操作栏 (绑定了点赞) -->
					<div
						class="bg-gray-100 dark:bg-gray-900/50 px-8 py-4 flex justify-end items-center gap-3 border-t border-gray-200 dark:border-gray-700">
						<BaseButton @click="handleLike" :disabled="isLiking" variant="outline" size="sm"
							class="bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300 transition-transform active:scale-95">
							👍 点赞 {{ post.likes > 0 ? post.likes : '' }}
						</BaseButton>
						<BaseButton variant="outline" size="sm"
							class="bg-white dark:bg-gray-800 dark:border-gray-600 dark:text-gray-300">
							↪ 转发
						</BaseButton>
					</div>
				</article>
				<!-- 模块二：评论区 -->
				<section
					class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-8 border border-transparent dark:border-gray-700">
					<h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6 select-none">评论区</h3>

					<!-- 1. 评论输入框区域 -->
					<div class="flex gap-4 mb-10">
						<div class="w-12 h-12 bg-gray-300 dark:bg-gray-600 rounded overflow-hidden flex-shrink-0">
							<svg class="w-full h-full text-gray-400 dark:text-gray-500 p-2" fill="currentColor"
								viewBox="0 0 24 24">
								<path
									d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
							</svg>
						</div>

						<div class="flex-grow">
							<div class="relative">
								<textarea v-model="commentInput" rows="3" placeholder="发一条友善的评论..."
									class="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"></textarea>
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
								<div
									class="inline-block bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-600 dark:text-gray-300 mb-1 rounded-sm select-none">
									{{ comment.user }}
								</div>
								<div
									class="inline-block ml-2 bg-gray-200 dark:bg-gray-700 px-2 py-0.5 text-xs text-gray-500 dark:text-gray-400 mb-1 rounded-sm select-none">
									{{ comment.date }}
								</div>

								<div
									class="mt-2 bg-gray-100 dark:bg-gray-900 p-4 rounded text-sm text-gray-700 dark:text-gray-200">
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