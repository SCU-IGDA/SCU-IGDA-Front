// types/user.ts
// 用户角色和权限类型定义

// 用户角色枚举
export enum UserRole {
    GUEST = 'guest',        // 游客 - 未登录状态下的用户，只能看
    MEMBER = 'member',      // 普通会员 - 系统的基础用户，可以正常使用各种基础功能
    PREMIUM = 'premium',    // 高级会员 - 系统的高级用户，可以进行任务发布和内容库的管理
    CORE = 'core',          // 核心会员 - 系统的更高级用户，可以进行活动编辑和商品上架
    ADMIN = 'admin'         // 运维 - 最高级的用户，总管理账号，可以更改其他账号的类型
}

// 权限类型
export interface Permission {
    id: string
    name: string
    description: string
}

// 用户权限映射
export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    [UserRole.GUEST]: [
        { id: 'view_content', name: '查看内容', description: '可以查看公开内容' },
        { id: 'view_activities', name: '查看活动', description: '可以查看活动信息' }
    ],
    [UserRole.MEMBER]: [
        { id: 'view_content', name: '查看内容', description: '可以查看公开内容' },
        { id: 'view_activities', name: '查看活动', description: '可以查看活动信息' },
        { id: 'create_post', name: '创建帖子', description: '可以创建和发布帖子' },
        { id: 'join_team', name: '加入组队', description: '可以加入组队系统' },
        { id: 'comment', name: '评论', description: '可以对内容进行评论' }
    ],
    [UserRole.PREMIUM]: [
        { id: 'view_content', name: '查看内容', description: '可以查看公开内容' },
        { id: 'view_activities', name: '查看活动', description: '可以查看活动信息' },
        { id: 'create_post', name: '创建帖子', description: '可以创建和发布帖子' },
        { id: 'join_team', name: '加入组队', description: '可以加入组队系统' },
        { id: 'comment', name: '评论', description: '可以对内容进行评论' },
        { id: 'publish_task', name: '发布任务', description: '可以发布任务' },
        { id: 'manage_content', name: '管理内容库', description: '可以管理内容库' }
    ],
    [UserRole.CORE]: [
        { id: 'view_content', name: '查看内容', description: '可以查看公开内容' },
        { id: 'view_activities', name: '查看活动', description: '可以查看活动信息' },
        { id: 'create_post', name: '创建帖子', description: '可以创建和发布帖子' },
        { id: 'join_team', name: '加入组队', description: '可以加入组队系统' },
        { id: 'comment', name: '评论', description: '可以对内容进行评论' },
        { id: 'publish_task', name: '发布任务', description: '可以发布任务' },
        { id: 'manage_content', name: '管理内容库', description: '可以管理内容库' },
        { id: 'edit_activities', name: '编辑活动', description: '可以编辑活动信息' },
        { id: 'manage_products', name: '管理商品', description: '可以上架和管理商品' }
    ],
    [UserRole.ADMIN]: [
        { id: 'view_content', name: '查看内容', description: '可以查看公开内容' },
        { id: 'view_activities', name: '查看活动', description: '可以查看活动信息' },
        { id: 'create_post', name: '创建帖子', description: '可以创建和发布帖子' },
        { id: 'join_team', name: '加入组队', description: '可以加入组队系统' },
        { id: 'comment', name: '评论', description: '可以对内容进行评论' },
        { id: 'publish_task', name: '发布任务', description: '可以发布任务' },
        { id: 'manage_content', name: '管理内容库', description: '可以管理内容库' },
        { id: 'edit_activities', name: '编辑活动', description: '可以编辑活动信息' },
        { id: 'manage_products', name: '管理商品', description: '可以上架和管理商品' },
        { id: 'manage_users', name: '管理用户', description: '可以管理用户账号和权限' },
        { id: 'change_user_role', name: '更改用户角色', description: '可以更改其他用户的角色类型' },
        { id: 'access_admin_panel', name: '访问管理后台', description: '可以访问管理员控制后台' }
    ]
}

// 管理员控制后台标签页类型
export interface AdminTab {
    id: string
    name: string
    icon: string
    component?: string
    requiredRole: UserRole[]
    description: string
}

// 管理员控制后台标签页配置
export const ADMIN_TABS: AdminTab[] = [
    {
        id: 'dashboard',
        name: '仪表盘',
        icon: 'dashboard',
        requiredRole: [UserRole.ADMIN, UserRole.CORE, UserRole.PREMIUM],
        description: '系统概览和统计数据'
    },
    {
        id: 'user_management',
        name: '用户管理',
        icon: 'users',
        requiredRole: [UserRole.ADMIN],
        description: '管理用户账号和权限'
    },
    {
        id: 'content_management',
        name: '内容管理',
        icon: 'file-text',
        requiredRole: [UserRole.ADMIN, UserRole.CORE, UserRole.PREMIUM],
        description: '管理内容库和帖子'
    },
    {
        id: 'activity_management',
        name: '活动管理',
        icon: 'calendar',
        requiredRole: [UserRole.ADMIN, UserRole.CORE],
        description: '编辑和管理活动信息'
    },
    {
        id: 'product_management',
        name: '商品管理',
        icon: 'shopping-bag',
        requiredRole: [UserRole.ADMIN, UserRole.CORE],
        description: '上架和管理商品'
    },
    {
        id: 'task_management',
        name: '任务管理',
        icon: 'check-square',
        requiredRole: [UserRole.ADMIN, UserRole.CORE, UserRole.PREMIUM],
        description: '发布和管理任务'
    },
    {
        id: 'system_settings',
        name: '系统设置',
        icon: 'settings',
        requiredRole: [UserRole.ADMIN],
        description: '系统配置和参数设置'
    },
    {
        id: 'audit_log',
        name: '操作日志',
        icon: 'clipboard',
        requiredRole: [UserRole.ADMIN],
        description: '查看系统操作记录'
    }
]

// 用户信息接口
export interface User {
    id: string | number
    username: string
    email: string
    role: UserRole
    avatar?: string
    createdAt?: string
    lastLogin?: string
}

// 权限检查工具函数
export function hasPermission(userRole: UserRole, permissionId: string): boolean {
    const permissions = ROLE_PERMISSIONS[userRole] || []
    return permissions.some(perm => perm.id === permissionId)
}

export function canAccessTab(userRole: UserRole, tab: AdminTab): boolean {
    return tab.requiredRole.includes(userRole)
}

// 角色等级比较
export function getRoleLevel(role: UserRole): number {
    const levels = {
        [UserRole.GUEST]: 0,
        [UserRole.MEMBER]: 1,
        [UserRole.PREMIUM]: 2,
        [UserRole.CORE]: 3,
        [UserRole.ADMIN]: 4
    }
    return levels[role] || 0
}

export function isRoleHigherOrEqual(userRole: UserRole, requiredRole: UserRole): boolean {
    return getRoleLevel(userRole) >= getRoleLevel(requiredRole)
}
