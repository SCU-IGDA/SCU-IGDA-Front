// middleware/admin-auth.ts
// 管理员页面路由守卫

export default defineNuxtRouteMiddleware(async (to, from) => {
    // 在客户端和服务器端都执行
    const { canAccessAdmin, user, initAuth } = useAuth()

    // 初始化用户认证状态
    if (process.client) {
        initAuth()
    }

    // 等待用户状态初始化
    await new Promise(resolve => setTimeout(resolve, 0))

    // 检查是否有权限访问管理员页面
    if (!canAccessAdmin()) {
        console.log('权限检查失败，用户角色:', user.value?.role || 'guest', 'canAccessAdmin:', canAccessAdmin())
        // 如果没有权限，重定向到首页
        return navigateTo('/', { replace: true })
    }

    console.log('权限检查通过，用户角色:', user.value?.role, '可以访问管理员页面')
})
