<!-- pages/register.vue -->
<!-- 注册页面 -->

<script setup lang="ts">
	import { ref, onMounted, onUnmounted } from 'vue'
	import { useAuth } from '~/composables/useAuth'
	const router = useRouter()
	const config = useRuntimeConfig()
	const { setUserState, fetchUser } = useAuth()

	useHead({ title: '注册账号 - SCU IGDA' })

	// UI 状态
	const form = ref({
		username: '',
		email: '',
		verificationCode: '',
		password: '',
		confirmPassword: '',
		agree: false
	})

	// 加载状态，防止重复点击
	const isLoading = ref(false)

	// 验证码相关逻辑
	const countdown = ref(0)
	const canResend = ref(true)
	let timer : NodeJS.Timeout | null = null

	// ... (保留你原有的 restoreCountdownState, clearTimer, startCountdownTimer 函数，不需要改动) ...
	const restoreCountdownState = () => {
		const savedEndTime = localStorage.getItem('verificationCodeEndTime')
		if (savedEndTime) {
			const endTime = parseInt(savedEndTime)
			const now = Date.now()
			const remainingSeconds = Math.max(0, Math.floor((endTime - now) / 1000))
			if (remainingSeconds > 0) {
				countdown.value = remainingSeconds
				canResend.value = false
				startCountdownTimer()
			} else {
				localStorage.removeItem('verificationCodeEndTime')
			}
		}
	}

	const clearTimer = () => {
		if (timer) {
			clearInterval(timer)
			timer = null
		}
	}

	const startCountdownTimer = () => {
		clearTimer()
		timer = setInterval(() => {
			countdown.value--
			if (countdown.value <= 0) {
				clearTimer()
				canResend.value = true
				localStorage.removeItem('verificationCodeEndTime')
			}
		}, 1000)
	}

	onMounted(() => { restoreCountdownState() })
	onUnmounted(() => { clearTimer() })

	// 1. 发送验证码逻辑
	const sendVerificationCode = async () => {
		if (!canResend.value) return

		// 简单校验邮箱
		if (!form.value.email || !form.value.email.includes('@')) {
			alert('请输入有效的邮箱地址')
			return
		}

		try {
			// 假设后端发送验证码的接口是 /user/sendVeriCode (根据你之前的描述)
			// 如果后端也是 /sendVeriCode 请自行修改 url
			const res = await $fetch('/user/sendVeriCode', {
				method: 'POST',
				baseURL: config.public.apiBase, // 确保指向 http://127.0.0.1:8787
				body: {
					email: form.value.email
				}
			})

			console.log('验证码发送结果:', res)

			// 发送成功后开始倒计时
			countdown.value = 60
			canResend.value = false
			const endTime = Date.now() + 60 * 1000
			localStorage.setItem('verificationCodeEndTime', endTime.toString())
			startCountdownTimer()

			// 提示用户 (如果是本地开发，提醒去看控制台)
			alert('验证码已发送！')

		} catch (error : any) {
			console.error('发送验证码失败:', error)
			alert(error.data?.message || '验证码发送失败，请稍后重试')
		}
	}

	// 2. 注册逻辑 (对接不可修改的 /setUser 接口)
	const handleRegister = async () => {
		// 前端校验
		if (!form.value.username) return alert('请输入用户名')
		if (!form.value.email) return alert('请输入邮箱')
		if (!form.value.verificationCode) return alert('请输入验证码')
		if (!form.value.password) return alert('请输入密码')
		if (form.value.password !== form.value.confirmPassword) {
			alert('两次输入的密码不一致')
			return
		}
		if (!form.value.agree) {
			alert('请先同意用户协议')
			return
		}

		isLoading.value = true

		try {
			// 严格构造后端需要的 Payload
			const payload = {
				username: form.value.username,
				password: form.value.password,
				email: form.value.email,
				verificationCode: form.value.verificationCode
			}

			// 调用后端 /setUser 接口
			const data : any = await $fetch('/user/setUser', {
				method: 'POST',
				baseURL: config.public.apiBase, // 确保这里配置正确
				body: payload
			})

			console.log('注册成功响应:', data)

			// 注册成功后的处理
			if (data.message === '注册成功' || data.token) {
				// 情况 A: 后端注册接口做得好，直接返回了 { token: '...', userResponse: {...} }
				if (data.token && data.userResponse) {
					setUserState(data.token, data.userResponse)
					alert('注册成功，已自动登录！')
					router.push('/')
				}
				// 情况 B: 后端只返回了 token
				else if (data.token) {
					// 先存 Token (这里需要 useAuth 暴露一个仅存 Token 的方法，或者手动模拟)
					// 建议修改 useAuth 增加一个 setToken 方法，或者直接用 cookie
					const tokenCookie = useCookie('auth_token') // 注意：名字要和 useAuth 里保持一致！
					tokenCookie.value = data.token

					// 尝试拉取用户信息
					await fetchUser()
					alert('注册成功！')
					router.push('/')
				}
				// 情况 C: 没返回 token，需要去登录页
				else {
					alert('注册成功，请登录！')
					router.push('/login')
				}
			}

		} catch (error : any) {
			console.error('注册请求出错:', error)

			// 处理后端返回的 specific error codes
			if (error.response) {
				const status = error.response.status
				const msg = error.data?.message || '未知错误'

				if (status === 409) {
					alert(`注册失败: ${msg}`) // 邮箱已存在
				} else if (status === 400) {
					alert(`参数错误: ${msg}`) // 验证码错误或过期
				} else {
					alert(`服务器错误: ${msg}`)
				}
			} else {
				alert('网络连接失败，请检查后端是否启动')
			}
		} finally {
			isLoading.value = false
		}
	}
</script>

<template>
	<div
		class="bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8 min-h-[80vh] transition-colors duration-300">

		<!-- 头部：标题与描述 -->
		<div class="w-full max-w-md text-center mb-8 select-none">
			<h2 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
				加入社团
			</h2>
			<p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
				创建一个新账号，开启游戏创作之旅
			</p>
		</div>

		<!-- 卡片容器 -->
		<div
			class="w-full max-w-md bg-white dark:bg-gray-800 py-10 px-8 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">

			<form class="space-y-5" @submit.prevent="handleRegister">

				<!-- 基础输入框 -->
				<BaseInput v-model="form.username" label="用户名" placeholder="给自己起个响亮的名字" id="username" />

				<BaseInput v-model="form.email" label="电子邮箱" type="email" placeholder="example@scu.edu.cn" id="email" />

				<!-- 验证码输入框与重新发送按钮 -->
				<div>
					<label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
						验证码
					</label>
					<div class="flex gap-2">
						<div class="flex-1">
							<input v-model="form.verificationCode" type="text" placeholder="请输入验证码"
								class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
								maxlength="6" />
						</div>
						<div class="w-32 select-none">
							<button type="button" @click="sendVerificationCode" :disabled="!canResend"
								class="w-full h-full px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
								:class="canResend ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'">
								{{ countdown > 0 ? `${countdown}秒后重试` : '发送验证码' }}
							</button>
						</div>
					</div>
				</div>

				<BaseInput v-model="form.password" type="password" label="密码" placeholder="至少 8 位字符" id="password" />

				<BaseInput v-model="form.confirmPassword" type="password" label="确认密码" placeholder="请再次输入密码"
					id="confirm-password" />

				<!-- 用户协议勾选 -->
				<div class="flex items-start pt-2 select-none">
					<div class="flex items-center h-5">
						<input id="agree" v-model="form.agree" type="checkbox"
							class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded cursor-pointer">
					</div>
					<div class="ml-2 text-sm">
						<label for="agree" class="font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
							我已阅读并同意
						</label>
						<a href="#" class="text-blue-600 hover:text-blue-500 transition-colors">《社团章程》</a>
						<span class="text-gray-500 dark:text-gray-400"> 和 </span>
						<a href="#" class="text-blue-600 hover:text-blue-500 transition-colors">《隐私政策》</a>
					</div>
				</div>

				<!-- 注册按钮 -->
				<div class="pt-2 select-none">
					<BaseButton type="submit" class="w-full shadow-md shadow-blue-200 dark:shadow-blue-900/20" size="lg"
						:disabled="!form.agree">
						注册账号
					</BaseButton>
				</div>
			</form>

			<!-- 分割线 -->
			<AuthDivider label="或者" />

			<!-- 底部跳转链接 -->
			<p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 select-none">
				已有账号?
				<NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
					直接登录
				</NuxtLink>
			</p>

		</div>
	</div>
</template>