<!-- pages/permission-test.vue -->
<!-- 权限测试页面 -->

<script setup lang="ts">
import { UserRole, ADMIN_TABS, ROLE_PERMISSIONS } from '~/types/user'
import { useAuth } from '~/composables/useAuth'

// 页面元数据
useHead({ title: '权限测试 - SCU IGDA' })

// 用户认证状态
const { user, userRole, switchUser, logout, hasPermission } = useAuth()

// 所有用户角色
const allRoles = Object.values(UserRole)

// 切换用户角色
const handleSwitchRole = (role: UserRole) => {
  switchUser(role)
}

// 获取当前用户的权限
const currentUserPermissions = computed(() => {
  return ROLE_PERMISSIONS[userRole.value] || []
})

// 获取当前用户可访问的管理员标签页
const accessibleAdminTabs = computed(() => {
  if (!user.value) return []

  return ADMIN_TABS.filter(tab =>
    tab.requiredRole.includes(user.value!.role as UserRole)
  )
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-6 select-none">
    <div class="max-w-6xl mx-auto">
      <!-- 页面标题 -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">权限控制测试页面</h1>
        <p class="text-gray-600 dark:text-gray-400">
          测试基于群组的权限控制系统，演示不同角色的访问权限
        </p>
      </div>

      <!-- 当前用户状态 -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 mb-8">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">当前用户状态</h2>
            <div class="flex items-center space-x-4">
              <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span class="text-blue-600 dark:text-blue-300 font-bold text-lg">
                  {{ user?.username?.charAt(0) || 'G' }}
                </span>
              </div>
              <div>
                <p class="text-lg font-medium text-gray-900 dark:text-white">
                  {{ user?.username || '游客' }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400 capitalize">
                  角色: {{ user?.role || 'guest' }}
                </p>
              </div>
            </div>
          </div>

          <div class="flex flex-wrap gap-2">
            <button
              v-if="user"
              @click="logout"
              class="px-4 py-2 text-sm border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
            >
              退出登录
            </button>
            <NuxtLink
              to="/admin"
              v-if="user && ['admin', 'core', 'premium'].includes(user.role)"
              class="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              进入管理后台
            </NuxtLink>
            <NuxtLink
              to="/"
              class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              返回首页
            </NuxtLink>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <!-- 角色切换面板 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">切换用户角色</h3>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            点击以下按钮切换不同用户角色，测试权限控制效果
          </p>

          <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
            <button
              v-for="role in allRoles"
              :key="role"
              @click="handleSwitchRole(role)"
              :class="[
                'p-4 rounded-lg border transition-all text-center',
                userRole === role
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300'
                  : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
              ]"
            >
              <div class="text-2xl mb-2">
                {{
                  role === 'guest' ? '👤' :
                  role === 'member' ? '👨‍💼' :
                  role === 'premium' ? '⭐' :
                  role === 'core' ? '🔷' :
                  '👑'
                }}
              </div>
              <div class="font-medium capitalize">{{ role }}</div>
              <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {{
                  role === 'guest' ? '游客' :
                  role === 'member' ? '普通会员' :
                  role === 'premium' ? '高级会员' :
                  role === 'core' ? '核心会员' :
                  '运维'
                }}
              </div>
            </button>
          </div>

          <div class="mt-6 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg">
            <h4 class="font-medium text-gray-900 dark:text-white mb-2">角色说明</h4>
            <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• <span class="font-medium">游客</span>: 未登录用户，只能查看内容</li>
              <li>• <span class="font-medium">普通会员</span>: 基础用户，可以使用基础功能</li>
              <li>• <span class="font-medium">高级会员</span>: 可以发布任务和管理内容库</li>
              <li>• <span class="font-medium">核心会员</span>: 可以编辑活动和上架商品</li>
              <li>• <span class="font-medium">运维</span>: 最高权限，可以管理用户和系统</li>
            </ul>
          </div>
        </div>

        <!-- 权限详情 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">当前权限详情</h3>

          <div class="mb-6">
            <h4 class="font-medium text-gray-900 dark:text-white mb-3">拥有的权限</h4>
            <div class="space-y-2">
              <div
                v-for="permission in currentUserPermissions"
                :key="permission.id"
                class="flex items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg"
              >
                <span class="text-green-600 dark:text-green-400 mr-3">✓</span>
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">{{ permission.name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ permission.description }}</div>
                </div>
              </div>

              <div v-if="currentUserPermissions.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
                当前角色没有任何特殊权限
              </div>
            </div>
          </div>

          <div>
            <h4 class="font-medium text-gray-900 dark:text-white mb-3">可访问的管理后台标签页</h4>
            <div class="space-y-2">
              <div
                v-for="tab in accessibleAdminTabs"
                :key="tab.id"
                class="flex items-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg"
              >
                <span class="text-blue-600 dark:text-blue-400 mr-3">
                  {{
                    tab.icon === 'dashboard' ? '📊' :
                    tab.icon === 'users' ? '👥' :
                    tab.icon === 'file-text' ? '📄' :
                    tab.icon === 'calendar' ? '📅' :
                    tab.icon === 'shopping-bag' ? '🛍️' :
                    tab.icon === 'check-square' ? '✅' :
                    tab.icon === 'settings' ? '⚙️' :
                    tab.icon === 'clipboard' ? '📋' : '📌'
                  }}
                </span>
                <div class="flex-1">
                  <div class="font-medium text-gray-900 dark:text-white">{{ tab.name }}</div>
                  <div class="text-xs text-gray-500 dark:text-gray-400">{{ tab.description }}</div>
                </div>
                <div class="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded">
                  需要: {{ tab.requiredRole.join(', ') }}
                </div>
              </div>

              <div v-if="accessibleAdminTabs.length === 0" class="text-center py-4 text-gray-500 dark:text-gray-400">
                当前角色无法访问任何管理后台标签页
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 权限测试结果 -->
      <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">权限测试结果</h3>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">访问管理后台</div>
            <div class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ user && ['admin', 'core', 'premium'].includes(user.role) ? '允许' : '拒绝' }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ user && ['admin', 'core', 'premium'].includes(user.role) ? '✓ 权限足够' : '✗ 权限不足' }}
            </div>
          </div>

          <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">管理用户</div>
            <div class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ user?.role === 'admin' ? '允许' : '拒绝' }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ user?.role === 'admin' ? '✓ 仅管理员' : '✗ 需要管理员权限' }}
            </div>
          </div>

          <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">编辑活动</div>
            <div class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ user && ['admin', 'core'].includes(user.role) ? '允许' : '拒绝' }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ user && ['admin', 'core'].includes(user.role) ? '✓ 核心会员及以上' : '✗ 需要核心会员' }}
            </div>
          </div>

          <div class="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
            <div class="text-sm text-gray-500 dark:text-gray-400 mb-1">发布任务</div>
            <div class="text-xl font-semibold text-gray-900 dark:text-white">
              {{ user && ['admin', 'core', 'premium'].includes(user.role) ? '允许' : '拒绝' }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {{ user && ['admin', 'core', 'premium'].includes(user.role) ? '✓ 高级会员及以上' : '✗ 需要高级会员' }}
            </div>
          </div>
        </div>

        <div class="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg select-text">
          <h4 class="font-medium text-blue-800 dark:text-blue-300 mb-2">测试说明</h4>
          <p class="text-sm text-blue-700 dark:text-blue-400 mb-3">
            1. 点击上方角色按钮切换不同用户角色<br>
            2. 观察导航栏中"管理后台"链接的显示/隐藏<br>
            3. 尝试访问 <NuxtLink to="/admin" class="underline">/admin</NuxtLink> 页面测试路由守卫<br>
            4. 查看不同角色拥有的权限和可访问的管理标签页
          </p>
          <div class="mt-3 p-3 bg-white dark:bg-gray-800 rounded border border-blue-200 dark:border-blue-800">
            <h5 class="font-medium text-gray-900 dark:text-white mb-1">测试账号</h5>
            <p class="text-xs text-gray-600 dark:text-gray-400">
              要测试登录功能，可以使用以下测试账号：<br>
              • 管理员: admin@scuigda.com / password123<br>
              • 核心会员: core@scuigda.com / password123<br>
              • 高级会员: premium@scuigda.com / password123<br>
              • 普通会员: member@scuigda.com / password123
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 自定义样式 */

/* 允许特定内容被选中 */
.select-text {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}

/* 测试说明中的链接和文本应该可以选中 */
.test-instructions {
  user-select: text;
  -webkit-user-select: text;
  -moz-user-select: text;
  -ms-user-select: text;
}
</style>
