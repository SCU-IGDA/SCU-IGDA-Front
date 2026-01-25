// composables/useAuth.ts
export const useAuth = () => {
  // 1. 使用 useState 创建全局响应式状态
  // 这里的 'user' 是全局唯一的 key，不同组件调用 useAuth() 获取的是同一个 Ref
  const user = useState<any | null>('user', () => null)
  
  // 2. 计算属性判断是否登录
  const isLoggedIn = computed(() => !!user.value)

  // 3. 设置用户状态 (登录/注册成功时调用)
  const setUserState = (token: string, userData: any) => {
    // 存 Cookie
    const tokenCookie = useCookie('auth_token', { maxAge: 60 * 60 * 24 * 7 })
    tokenCookie.value = token
    
    // 更新全局状态 (这会触发 Navbar 更新)
    user.value = userData
  }

  // 4. 登出
  const logout = () => {
    const tokenCookie = useCookie('auth_token')
    tokenCookie.value = null
    user.value = null
    navigateTo('/login') // 登出后强制跳转
  }

  // 5. 初始化 (在 app.vue 或插件中调用，用于刷新页面后恢复状态)
  const fetchUser = async () => {
    const token = useCookie('auth_token')
    if (!token.value) return

    try {
      // 假设有一个 /user/profile 接口用 token 换用户信息
      // 如果没有这个接口，你可以暂时只恢复 token，或者解码 JWT
      // 这里仅做演示
      // const data = await $fetch('/user/profile', ...)
      // user.value = data
    } catch (e) {
      logout()
    }
  }

  return {
    user,
    isLoggedIn,
    setUserState,
    logout,
    fetchUser
  }
}
