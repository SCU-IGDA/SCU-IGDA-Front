// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
    // 1. 直接获取存储 Token 的 Cookie
    // 注意：这里 'auth_token' 必须和你 useAuth 里存 Cookie 的名字一致！
    // 如果你在 useAuth 里用的是 useCookie('token')，这里就写 'token'
    const token = useCookie('auth_token') 

    // 2. 如果 Cookie 不存在，说明肯定没登录 -> 拦截
    if (!token.value) {
        // 保存用户想去的页面，登录后跳回来 (可选优化)
        return navigateTo(`/login?redirect=${to.fullPath}`)
    }

    // 3. 如果 Cookie 存在，直接放行 (return void)
    // 即使 Token 可能是过期的，我们先让用户进 Dashboard，
    // 然后由页面内部的 API 请求 (401 Unauthorized) 触发自动登出逻辑。
    // 这样用户体验最流畅，不会闪屏。
})