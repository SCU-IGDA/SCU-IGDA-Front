// composables/useAuth.ts

// 定义接口...
interface User {
	userId: number
	username: string
	avatar: string
	bio: string
	organization: string
	permissionLevel: number
	email: string
	updatedAt: string
	isLogin: boolean
}

interface VerifyTokenResponse {
	valid: boolean
	userResponse?: User
	message?: string
}

// composables/useAuth.ts
export const useAuth = () => {
	// 1. 顶层同步调用
	const config = useRuntimeConfig()
	const tokenCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 })
	const user = useState<User | null>('user', () => null)

	const nuxtApp = useNuxtApp()
	const isLoggedIn = computed(() => !!user.value)
	const setUserState = (token: string, userData: User) => {
		tokenCookie.value = token
		user.value = userData
	}
	const logout = () => {
		tokenCookie.value = null
		user.value = null
		nuxtApp.runWithContext(() => {
			navigateTo('/login')
		})
	}
	const fetchUser = async () => {
		if (!tokenCookie.value) return
		if (user.value) return
		if (import.meta.server) return
		try {
			console.log(tokenCookie.value)
			const res = await $fetch<VerifyTokenResponse>('/user/verifyToken', {
				method: 'POST',
				baseURL: config.public.apiBase as string,
				body: { token: tokenCookie.value }
			})
			if (res.valid && res.userResponse) {
				user.value = res.userResponse
			} else {
				throw new Error(res.message || 'Token 无效')
			}
		} catch (e) {
			console.error('恢复登录态失败:', e)

			tokenCookie.value = null
			user.value = null
		}
	}
	return { user, isLoggedIn, setUserState, logout, fetchUser, tokenCookie }
}
