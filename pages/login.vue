<script setup lang="ts">
	// 1. 引入路由，用于跳转
	const router = useRouter()

	// 页面元数据
	useHead({ title: '登录 - SCU IGDA' })

	// UI 状态
	const loading = ref(false) // 新增：控制按钮的加载状态
	const form = ref({
		email: '',
		password: '',
		remember: false
	})

	// --- 类型定义 (建议后续移动到 types/api.ts) ---
	export interface User {
		userId : number
		username : string
		avatar : string
		dynamicNum : number
		permissionLevel : number
		email : string
		isLogin : boolean
	}

	export interface LoginResponse {
		userResponse : User
		token : string
	}
	// ---------------------------------------------

	const config = useRuntimeConfig()

	// 定义全局用户状态（类似简单的 Store）
	// 这样在别的页面也能通过 useUser() 获取到用户信息
	const useUser = () => useState<User | null>('user', () => null)
	const user = useUser()

	const handleLogin = async () => {
		// 简单的表单校验
		if (!form.value.email || !form.value.password) return

		// 1. 开启 Loading，防止重复点击
		loading.value = true

		try {
			const data = await $fetch<LoginResponse>('/user/login', {
				method: 'POST',
				baseURL: config.public.apiBase,
				body: {
					email: form.value.email,
					password: form.value.password
				},
				// 注意：这里建议去掉 onResponseError 中的 alert
				// 统一在 catch 里处理错误，或者在这里只处理特定业务逻辑
				onResponseError({ response }) {
					if (response.status === 401) {
						console.warn('账号或密码错误')
					}
				}
			})

			// --- 登录成功后的逻辑 ---

			// 2. 存储 Token 到 Cookie (设置过期时间为7天，或者根据你的 remember me 决定)
			const tokenCookie = useCookie('token', {
				maxAge: form.value.remember ? 60 * 60 * 24 * 7 : 60 * 60 * 24 // 记住我7天，否则1天
			})
			tokenCookie.value = data.token

			// 3. 更新全局用户状态
			user.value = data.userResponse

			console.log('登录成功:', data.userResponse.username)

			// 4. 跳转到首页
			await router.push('/')

		} catch (error : any) {
			// 5. 错误处理
			console.error('登录流程异常:', error)
			// 获取后端返回的具体错误信息 (fetch 的错误对象里包含了 data)
			const msg = error.data || '登录请求失败，请检查网络或联系管理员'
			alert(msg) // 实际项目中建议使用 Toast 组件替代 alert
		} finally {
			// 6. 无论成功失败，最后都要关闭 Loading
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
				<BaseInput v-model="form.email" label="邮箱 / 学号" placeholder="请输入您的邮箱或学号" id="email" />

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
					<!-- 修改点：传入 loading 状态，禁用按钮 -->
					<BaseButton type="submit" class="w-full shadow-md shadow-blue-200 dark:shadow-blue-900/20" size="lg"
						:disabled="loading">
						<!-- 简单的 Loading 文字切换，如果 BaseButton 内部有 loading prop 更好 -->
						{{ loading ? '登录中...' : '登录' }}
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