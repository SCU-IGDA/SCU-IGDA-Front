// composables/useAuth.ts

// 定义接口...
interface User {
	userId : number
	username : string
	avatar : string
	bio : string
	organization : string
	permissionLevel : number
	email : string
	updatedAt : string
	isLogin : boolean
}

interface VerifyTokenResponse {
	valid : boolean
	userResponse ?: User
	message ?: string
}

// composables/useAuth.ts
export const useAuth = () => {
	// 1. 顶层同步调用
	const config = useRuntimeConfig()
	const tokenCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 })
	const user = useState<User | null>('user', () => null)

	// 🆕 新增：获取 Nuxt App 上下文，用于稍后手动恢复上下文（如果需要）
	const nuxtApp = useNuxtApp()
	const isLoggedIn = computed(() => !!user.value)
	const setUserState = (token : string, userData : User) => {
		tokenCookie.value = token
		user.value = userData
	}
	const logout = () => {
		tokenCookie.value = null
		user.value = null
		// ⚠️ 重点修改：navigateTo 在服务端异步错误流中可能丢失上下文
		// 我们加上 nuxtApp.runWithContext 确保它是安全的
		nuxtApp.runWithContext(() => {
			navigateTo('/login')
		})
	}
	const fetchUser = async () => {
		if (!tokenCookie.value) return
		if (user.value) return
		if (import.meta.server) return
		try {
			const res = await $fetch<VerifyTokenResponse>('/user/verifyToken', {
				method: 'POST',
				baseURL: config.public.apiBase as string,
				body: { token: tokenCookie.value }
			})
			console.log(res.userResponse?.avatar)
			if (res.valid && res.userResponse) {
				const rawAvatar = res.userResponse.avatar;
				if (rawAvatar) {
					const separator = rawAvatar.includes('?') ? '&' : '?';
					res.userResponse.avatar = `${rawAvatar}${separator}_t=${Date.now()}`;
				}
				user.value = res.userResponse
			} else {
				throw new Error(res.message || 'Token 无效')
			}
		} catch (e) {
			console.error('恢复登录态失败:', e)

			// 🌟 重点修改：区分环境
			// 如果是在服务端出错（比如网络连不上后端），直接清空 Token 即可，
			// 不要强行 navigateTo，因为此时响应流可能还没准备好处理重定向
			tokenCookie.value = null
			user.value = null
		}
	}
	const refreshUser = async () => {
		// 先清空当前状态，确保 fetchUser 能跑下去
		user.value = null
		await fetchUser()
	}

	return { user, isLoggedIn, setUserState, logout, fetchUser, tokenCookie,refreshUser }
}