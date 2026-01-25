// composables/useAuth.ts
// 用户认证和权限状态管理

import type { User, UserRole } from '~/types/user'

// 模拟用户数据（实际项目中应从API获取）
const mockUsers: User[] = [
    {
        id: 1,
        username: '管理员',
        email: 'admin@scuigda.com',
        role: 'admin' as UserRole,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        createdAt: '2024-01-01',
        lastLogin: '2026-01-24'
    },
    {
        id: 2,
        username: '核心会员',
        email: 'core@scuigda.com',
        role: 'core' as UserRole,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=core',
        createdAt: '2024-02-01',
        lastLogin: '2026-01-23'
    },
    {
        id: 3,
        username: '高级会员',
        email: 'premium@scuigda.com',
        role: 'premium' as UserRole,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=premium',
        createdAt: '2024-03-01',
        lastLogin: '2026-01-22'
    },
    {
        id: 4,
        username: '普通会员',
        email: 'member@scuigda.com',
        role: 'member' as UserRole,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=member',
        createdAt: '2024-04-01',
        lastLogin: '2026-01-21'
    }
]

export const useAuth = () => {
    // 使用useState确保全局状态共享
    const user = useState<User | null>('auth.user', () => null)
    const isAuthenticated = computed(() => !!user.value)
    const userRole = computed(() => user.value?.role || 'guest' as UserRole)

    // 加载状态
    const isLoading = ref(false)

    // 状态更新触发器
    const updateTrigger = ref(0)

    // 初始化 - 从localStorage恢复用户状态
    const initAuth = () => {
        if (process.client) {
            const savedUser = localStorage.getItem('scuigda_user')
            if (savedUser) {
                try {
                    const parsedUser = JSON.parse(savedUser)
                    user.value = parsedUser
                    console.log('从localStorage恢复用户:', parsedUser.username)
                } catch (e) {
                    console.error('Failed to parse saved user:', e)
                    localStorage.removeItem('scuigda_user')
                }
            } else {
                console.log('localStorage中没有找到用户数据')
            }
        }
    }

    // 登录函数
    const login = async (email: string, password: string, remember = false) => {
        isLoading.value = true

        try {
            // 模拟API调用延迟
            await new Promise(resolve => setTimeout(resolve, 500))

            // 查找模拟用户
            const foundUser = mockUsers.find(u => u.email === email)

            if (!foundUser) {
                throw new Error('用户不存在或密码错误')
            }

            // 模拟密码验证（实际项目中应使用后端验证）
            if (password !== 'password123') {
                throw new Error('用户不存在或密码错误')
            }

            // 设置用户
            user.value = foundUser
            updateTrigger.value++ // 触发状态更新

            console.log('登录成功，设置用户:', foundUser.username, '角色:', foundUser.role)

            // 保存到localStorage（无论是否记住我，都保存会话）
            if (process.client) {
                localStorage.setItem('scuigda_user', JSON.stringify(foundUser))
                console.log('用户已保存到localStorage')
            }

            return { success: true, user: foundUser }
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : '登录失败'
            }
        } finally {
            isLoading.value = false
        }
    }

    // 登出函数
    const logout = () => {
        user.value = null
        updateTrigger.value++ // 触发状态更新
        if (process.client) {
            localStorage.removeItem('scuigda_user')
        }
    }

    // 切换用户角色（用于演示）
    const switchUser = (role: UserRole) => {
        const targetUser = mockUsers.find(u => u.role === role)
        if (targetUser) {
            user.value = targetUser
            updateTrigger.value++ // 触发状态更新
            if (process.client) {
                localStorage.setItem('scuigda_user', JSON.stringify(targetUser))
            }
        }
    }

    // 权限检查函数
    const hasPermission = (permissionId: string): boolean => {
        if (!user.value) return false

        // 导入权限检查函数
        const { hasPermission: checkPermission } = usePermissions()
        return checkPermission(user.value.role, permissionId)
    }

    const canAccessAdmin = (): boolean => {
        if (!user.value) return false
        return ['admin', 'core', 'premium'].includes(user.value.role)
    }

    // 初始化
    onMounted(() => {
        initAuth()
    })

    return {
        // 状态
        user,
        isAuthenticated,
        userRole,
        isLoading,
        updateTrigger,

        // 方法
        login,
        logout,
        switchUser,
        hasPermission,
        canAccessAdmin,

        // 工具函数
        initAuth
    }
}

// 权限检查composable
export const usePermissions = () => {
    const { hasPermission: checkPermission, canAccessTab } = useUserPermissions()

    return {
        hasPermission: checkPermission,
        canAccessTab
    }
}

// 用户权限工具函数（从types/user导入）
const useUserPermissions = () => {
    return {
        hasPermission: (userRole: UserRole, permissionId: string): boolean => {
            // 这里应该从types/user导入，但为了避免循环引用，我们直接实现
            const permissions = {
                guest: ['view_content', 'view_activities'],
                member: ['view_content', 'view_activities', 'create_post', 'join_team', 'comment'],
                premium: ['view_content', 'view_activities', 'create_post', 'join_team', 'comment', 'publish_task', 'manage_content'],
                core: ['view_content', 'view_activities', 'create_post', 'join_team', 'comment', 'publish_task', 'manage_content', 'edit_activities', 'manage_products'],
                admin: ['view_content', 'view_activities', 'create_post', 'join_team', 'comment', 'publish_task', 'manage_content', 'edit_activities', 'manage_products', 'manage_users', 'change_user_role', 'access_admin_panel']
            }

            return permissions[userRole]?.includes(permissionId) || false
        },

        canAccessTab: (userRole: UserRole, requiredRoles: UserRole[]): boolean => {
            return requiredRoles.includes(userRole)
        }
    }
}
