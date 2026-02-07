<script setup lang="ts">
	// 1. 引入我们封装好的 useAuth
	// 注意：确保 useAuth 导出了 setUserState 方法
	const { setUserState } = useAuth()
	const router = useRouter()
	const config = useRuntimeConfig()
	useHead({ title: '登录 - SCU IGDA' })
	// UI 状态
	const loading = ref(false)
	const form = ref({
		studentId: '',
		password: '',
		remember: false
	})
	// --- 类型定义 --- 
	// 建议：最佳实践是将这些接口移到 `/types/user.d.ts` 或 `/composables/useAuth.ts` 中导出
	// 这里保留是为了不报错
	interface User {
		userId : number
		username : string
		avatar : string
		dynamicNum : number
		permissionLevel : number
		studentId : string
		isLogin : boolean
	}
	interface LoginResponse {
		userResponse : User
		token : string
	}
	// ----------------
	const handleLogin = async () => {
		// 简单的表单校验
		if (!form.value.studentId || !form.value.password) return
		loading.value = true
		try {
			// 1. 发起请求
			const data = await $fetch<LoginResponse>('/user/login', {
				method: 'POST',
				baseURL: config.public.apiBase,
				body: {
					studentId: form.value.studentId,
					password: form.value.password
				}
			})
			// 2. 核心修改：使用 useAuth 统一管理状态
			if (data.token && data.userResponse) {
				setUserState(data.token, data.userResponse)
				console.log('登录成功:', data.userResponse.username)
				console.log('token',data.token)
				// 3. 跳转
				await router.push('/')
			}
		} catch (error : any) {
			console.error('登录流程异常:', error)

			// 优雅的错误信息提取
			const errorData = error.data
			// 优先显示后端返回的 message，其次显示 error 字段，最后显示默认文本
			const msg = errorData?.message || errorData?.error || '登录请求失败，请检查网络或账号密码'

			alert(msg)
		} finally {
			loading.value = false
		}
	}
</script>

<template>
	<div
		class="bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8 min-h-[80vh] transition-colors duration-300">

		<!-- 头部：标题与描述 (保持不变) -->
		<div class="w-full max-w-md text-center mb-8 select-none">
			<h2 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
				欢迎回来
			</h2>
			<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
				登录以管理您的作品和参与社团活动
			</p>
		</div>

		<!-- 卡片 (保持不变) -->
		<div
			class="w-full max-w-md bg-white dark:bg-gray-800 py-10 px-8 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">

			<form class="space-y-6" @submit.prevent="handleLogin">

				<!-- 基础输入框 -->
				<!-- 建议给 BaseInput 加上 :disabled="loading" 属性，如果组件支持的话 -->
				<BaseInput v-model="form.studentId" label="邮箱 / 学号" placeholder="请输入您的邮箱或学号" id="studentId" />

				<div class="space-y-1">
					<BaseInput v-model="form.password" type="password" label="密码" placeholder="请输入密码" id="password" />
				</div>

				<!-- 选项栏 (保持不变) -->
				<div class="flex items-center justify-between select-none">
					<div class="flex items-center">
						<input id="remember-me" v-model="form.remember" type="checkbox"
							class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded cursor-pointer">
						<label for="remember-me"
							class="ml-2 block text-sm text-gray-900 dark:text-gray-300 cursor-pointer">
							记住我
						</label>
					</div>

					<div class="text-sm">
						<a href="#" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
							忘记密码?
						</a>
					</div>
				</div>

				<!-- 提交按钮 -->
				<div>
					<!-- 稍微优化：Loading 时禁止点击且鼠标样式变化 -->
					<BaseButton type="submit"
						class="w-full shadow-md shadow-blue-200 dark:shadow-blue-900/20 disabled:opacity-70 disabled:cursor-not-allowed"
						size="lg" :disabled="loading">
						<!-- 增加一个 Loading 图标会让体验更好，这里保持文字切换 -->
						{{ loading ? '正在验证...' : '登录' }}
					</BaseButton>
				</div>
			</form>

			<!-- 底部跳转 (保持不变) -->
			<p class="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 select-none">
				还没有账号?
				<NuxtLink to="/register" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
					立即注册
				</NuxtLink>
			</p>

		</div>
	</div>
</template>