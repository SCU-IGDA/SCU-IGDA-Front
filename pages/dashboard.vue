<script setup lang="ts">
	import { ref, reactive, computed } from 'vue'

	// 1. 获取用户状态
	const { user, isLoggedIn, logout, refreshUser } = useAuth() // 假设 refreshUser 用于更新本地 session
	const toast = useToast() // 假设你有类似 notify/toast 的插件，没有的话可以用 alert 代替
	const config = useRuntimeConfig()

	// 2. 表单状态
	const isLoading = ref(false)
	const isUploading = ref(false)
	const avatarFile = ref<File | null>(null)
	const avatarPreview = ref<string>('')

	// 表单数据初始化
	const form = reactive({
		username: user.value?.username || '',
		bio: user.value?.bio || '',
	})

	// 3. 计算显示的头像（优先显示预览，其次是用户头像，最后是默认图）
	const displayAvatar = computed(() => {
		if (avatarPreview.value) return avatarPreview.value
		if (user.value?.avatarUrl) {
			// ⚠️ 如果你的数据库只存了相对路径 (如 userInfo/avatar/...), 这里需要补全前缀
			// 如果存的是全路径则直接用
			return user.value.avatarUrl.startsWith('http')
				? user.value.avatarUrl
				: `https://你的B2存储桶域名/${user.value.avatarUrl}`
		}
		return `https://api.dicebear.com/7.x/initials/svg?seed=${user.value?.username || 'User'}`
	})

	// 4. 处理图片选择
	const handleFileChange = (event : Event) => {
		const input = event.target as HTMLInputElement
		if (input.files && input.files[0]) {
			const file = input.files[0]

			// 简单校验
			if (file.size > 2 * 1024 * 1024) {
				alert('图片大小不能超过 2MB')
				return
			}

			avatarFile.value = file
			// 生成本地预览 URL
			avatarPreview.value = URL.createObjectURL(file)
		}
	}

	// 5. 提交更新
	const handleUpdate = async () => {
		if (!user.value?.userId) return

		console.log('提交更新')
		isLoading.value = true
		try {
			const formData = new FormData()

			// 对应后端：const body = await c.req.parseBody()
			formData.append('userId', user.value.userId.toString())
			formData.append('username', form.username)
			formData.append('bio', form.bio)

			// 只有当用户选择了新文件时才传 file
			if (avatarFile.value) {
				formData.append('file', avatarFile.value)
			} else {
				// ⚠️ 注意：你的后端代码里写了 if (!(file instanceof File)) return error
				// 这意味着后端强制要求上传头像。如果只想改 Bio 不改头像，后端逻辑需要调整。
				// 这里为了适配当前后端，如果没有新文件，我们可能需要拦截或者提示用户。
				// 或者：修改后端让 file 变为可选。
				// 暂时策略：如果没有文件，前端提示（或者你可以传一个空的 Blob 骗过后端，但这不好）
				if (!avatarFile.value) {
					alert('请上传一张头像 (后端限制)') 
					return 
				}
			}

			// 发起请求 (假设 fetch 封装在 useFetch 中，或者直接用原生 fetch)
			// 注意：fetch 会自动设置 Content-Type 为 multipart/form-data，不要手动设置 header
			const { data, error } = await useFetch('/user/update', {
				method: 'POST',
				baseURL: config.public.apiBase,
				body: formData,
			})

			if (error.value) throw error.value

			// 更新成功
			alert('个人信息更新成功！')

			// 刷新本地用户信息（如果 useAuth 支持）
			// await refreshUser() 

		} catch (err) {
			console.error(err)
			alert('更新失败，请重试')
		} finally {
			isLoading.value = false
		}
	}

	// 格式化日期
	const formatDate = (dateStr ?: string) => {
		if (!dateStr) return 'N/A'
		return new Date(dateStr).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
	}
</script>

<template>
	<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">

		<!-- 顶部背景条 (与 Index 保持一致) -->
		<div
			class="h-48 md:h-64 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b border-blue-100 dark:border-gray-800">
			<AppContainer class="h-full flex items-center">
				<div class="mb-8 md:mb-0">
					<h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">个人中心</h1>
					<p class="mt-2 text-gray-600 dark:text-gray-400">管理你的档案与社团活动</p>
				</div>
			</AppContainer>
		</div>

		<!-- 主要内容区 (上移覆盖部分背景) -->
		<AppContainer class="-mt-16 md:-mt-24 relative z-10 pb-20">
			<div class="grid grid-cols-1 lg:grid-cols-3 gap-8">

				<!-- 左侧：个人概览卡片 -->
				<div class="lg:col-span-1">
					<div
						class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-24">

						<!-- 头像上传区 -->
						<div class="p-8 flex flex-col items-center border-b border-gray-100 dark:border-gray-700">
							<div class="relative group cursor-pointer" @click="$refs.fileInput.click()">
								<div
									class="w-32 h-32 rounded-full ring-4 ring-white dark:ring-gray-700 shadow-md overflow-hidden relative">
									<img :src="displayAvatar" alt="User Avatar"
										class="w-full h-full object-cover group-hover:blur-sm transition-all duration-300">
									<!-- Hover Overlay -->
									<div
										class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
										<svg class="w-8 h-8 text-white" fill="none" stroke="currentColor"
											viewBox="0 0 24 24">
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z">
											</path>
											<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
												d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path>
										</svg>
									</div>
								</div>
								<!-- 隐藏的文件输入 -->
								<input ref="fileInput" type="file" accept="image/*" class="hidden"
									@change="handleFileChange">
								<div
									class="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full p-1.5 border-2 border-white dark:border-gray-800">
									<svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
											d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z">
										</path>
									</svg>
								</div>
							</div>

							<h2 class="mt-4 text-xl font-bold text-gray-900 dark:text-white">{{ user?.username }}</h2>
							<p class="text-sm text-gray-500 dark:text-gray-400">{{ user?.email }}</p>

							<!-- 权限/角色标签 -->
							<div class="mt-3">
								<span
									class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
									{{ user?.permissionLevel > 1 ? '管理员' : '社团成员' }}
								</span>
							</div>
						</div>

						<!-- 统计信息 -->
						<div class="px-6 py-4 space-y-3">
							<div class="flex justify-between text-sm">
								<span class="text-gray-500 dark:text-gray-400">加入时间</span>
								<span
									class="font-medium text-gray-900 dark:text-gray-200">{{ formatDate(user?.createdAt) }}</span>
							</div>
							<div class="flex justify-between text-sm">
								<span class="text-gray-500 dark:text-gray-400">所属组织</span>
								<span
									class="font-medium text-gray-900 dark:text-gray-200">{{ user?.organization || 'SCU IGDA' }}</span>
							</div>
							<div class="flex justify-between text-sm">
								<span class="text-gray-500 dark:text-gray-400">发布内容</span>
								<span class="font-medium text-gray-900 dark:text-gray-200">0 篇</span>
							</div>
						</div>

						<div class="p-4 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
							<button @click="logout"
								class="w-full py-2 px-4 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-sm font-medium rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
								退出登录
							</button>
						</div>
					</div>
				</div>

				<!-- 右侧：设置表单 -->
				<div class="lg:col-span-2 space-y-6">

					<!-- 基本信息卡片 -->
					<div
						class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
						<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
							<svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
									d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
							</svg>
							编辑资料
						</h3>

						<form @submit.prevent="handleUpdate" class="space-y-6">
							<!-- 用户名 -->
							<div>
								<label for="username"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">用户名</label>
								<input id="username" v-model="form.username" type="text"
									class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
									placeholder="请输入你的昵称" />
							</div>

							<!-- 个人简介 -->
							<div>
								<label for="bio"
									class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">个人简介
									(Bio)</label>
								<textarea id="bio" v-model="form.bio" rows="4"
									class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
									placeholder="介绍一下你自己..."></textarea>
								<p class="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
									{{ form.bio?.length || 0 }}/200</p>
							</div>

							<!-- 操作按钮 -->
							<div
								class="flex items-center justify-end gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
								<button type="button" @click="form.username = user?.username; form.bio = user?.bio"
									class="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors">
									重置修改
								</button>
								<button type="submit" :disabled="isLoading"
									class="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-lg shadow-blue-200 dark:shadow-blue-900/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed">
									<svg v-if="isLoading" class="animate-spin h-4 w-4 text-white" fill="none"
										viewBox="0 0 24 24">
										<circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
											stroke-width="4"></circle>
										<path class="opacity-75" fill="currentColor"
											d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
										</path>
									</svg>
									{{ isLoading ? '保存中...' : '保存更改' }}
								</button>
							</div>
						</form>
					</div>

					<!-- 功能入口 (示例) -->
					<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div
							class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer group">
							<div
								class="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10">
									</path>
								</svg>
							</div>
							<h4 class="font-bold text-gray-900 dark:text-white">我的作品</h4>
							<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">管理你发布到内容库的文章和项目。</p>
						</div>

						<div
							class="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 transition-colors cursor-pointer group">
							<div
								class="w-10 h-10 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
								<svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
										d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z">
									</path>
								</svg>
							</div>
							<h4 class="font-bold text-gray-900 dark:text-white">组队信息</h4>
							<p class="text-sm text-gray-500 dark:text-gray-400 mt-1">查看你的队伍申请状态和邀请。</p>
						</div>
					</div>

				</div>
			</div>
		</AppContainer>
	</div>
</template>