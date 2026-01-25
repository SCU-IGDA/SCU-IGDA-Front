<!-- pages/admin/index.vue -->
<!-- 管理员控制后台首页 -->

<script setup lang="ts">
import { ADMIN_TABS, UserRole, type AdminTab } from '~/types/user'
import { useAuth } from '~/composables/useAuth'

// 页面元数据和中间件
definePageMeta({
  middleware: 'admin-auth'
})

// 页面元数据
useHead({ title: '管理员控制后台 - SCU IGDA' })

// 用户认证状态
const { user, userRole, canAccessAdmin } = useAuth()

// 当前选中的标签页
const activeTab = ref('dashboard')

// 移动端侧边栏状态
const isMobileSidebarOpen = ref(false)

// 权限信息折叠状态
const isPermissionsCollapsed = ref(true)

// 根据用户角色过滤可访问的标签页
const accessibleTabs = computed(() => {
  if (!user.value) return []

  return ADMIN_TABS.filter(tab =>
    tab.requiredRole.includes(user.value!.role as UserRole)
  )
})

// 当前选中的标签页对象
const currentTab = computed(() => {
  return accessibleTabs.value.find(tab => tab.id === activeTab.value) || accessibleTabs.value[0]
})

// 切换标签页
const switchTab = (tabId: string) => {
  activeTab.value = tabId
  // 在移动端切换标签页后自动关闭侧边栏
  if (window.innerWidth < 1024) {
    isMobileSidebarOpen.value = false
  }
}

// 检查是否有权限访问管理员后台
const hasAccess = computed(() => {
  return canAccessAdmin()
})

// 切换移动端侧边栏
const toggleMobileSidebar = () => {
  isMobileSidebarOpen.value = !isMobileSidebarOpen.value
}

// 切换权限信息折叠状态
const togglePermissions = () => {
  isPermissionsCollapsed.value = !isPermissionsCollapsed.value
}

// 点击外部关闭移动端侧边栏
const closeSidebarOnClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.mobile-sidebar') && !target.closest('.mobile-sidebar-toggle')) {
    isMobileSidebarOpen.value = false
  }
}

// 监听点击事件
onMounted(() => {
  document.addEventListener('click', closeSidebarOnClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeSidebarOnClickOutside)
})
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300 select-none">
    <!-- 权限检查 -->
    <div v-if="!hasAccess" class="p-8 text-center">
      <div class="max-w-md mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div class="text-red-500 text-5xl mb-4">🚫</div>
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">权限不足</h2>
        <p class="text-gray-600 dark:text-gray-300 mb-6">
          您没有权限访问管理员控制后台。只有高级会员、核心会员和运维人员可以访问此页面。
        </p>
        <NuxtLink to="/" class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          返回首页
        </NuxtLink>
      </div>
    </div>

    <!-- 管理员后台主界面 -->
    <div v-else class="flex flex-col lg:flex-row">
      <!-- 移动端顶部栏 -->
      <div class="lg:hidden bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <button
            @click.stop="toggleMobileSidebar"
            class="mobile-sidebar-toggle p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg class="w-6 h-6 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
            </svg>
          </button>
          <div class="flex items-center space-x-2">
            <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span class="text-blue-600 dark:text-blue-300 font-semibold text-sm">
                {{ user?.username?.charAt(0) || 'U' }}
              </span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white text-sm">{{ user?.username }}</h3>
              <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ user?.role }}</p>
            </div>
          </div>
        </div>

        <div class="text-sm font-medium text-gray-700 dark:text-gray-300">
          {{ currentTab?.name || '仪表盘' }}
        </div>
      </div>

      <!-- 移动端侧边栏 (覆盖层) -->
      <div
        v-if="isMobileSidebarOpen"
        class="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50 transition-opacity"
        @click="isMobileSidebarOpen = false"
      >
        <div
          class="mobile-sidebar absolute left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-xl transform transition-transform"
          @click.stop
        >
          <!-- 侧边栏内容 -->
          <div class="h-full flex flex-col">
            <!-- 用户信息 -->
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center space-x-3">
                <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <span class="text-blue-600 dark:text-blue-300 font-bold text-lg">
                    {{ user?.username?.charAt(0) || 'U' }}
                  </span>
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900 dark:text-white">{{ user?.username }}</h3>
                  <p class="text-sm text-gray-500 dark:text-gray-400 capitalize">{{ user?.role }}</p>
                </div>
              </div>
            </div>

            <!-- 标签页导航 -->
            <nav class="p-4 flex-1 overflow-y-auto">
              <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                管理菜单
              </h4>
              <ul class="space-y-1">
                <li v-for="tab in accessibleTabs" :key="tab.id">
                  <button
                    @click="switchTab(tab.id)"
                    :class="[
                      'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                      activeTab === tab.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    ]"
                  >
                    <span class="text-lg">{{
                      tab.icon === 'dashboard' ? '📊' :
                      tab.icon === 'users' ? '👥' :
                      tab.icon === 'file-text' ? '📄' :
                      tab.icon === 'calendar' ? '📅' :
                      tab.icon === 'shopping-bag' ? '🛍️' :
                      tab.icon === 'check-square' ? '✅' :
                      tab.icon === 'settings' ? '⚙️' :
                      tab.icon === 'clipboard' ? '📋' : '📌'
                    }}</span>
                    <span>{{ tab.name }}</span>
                    <span v-if="tab.requiredRole.includes(UserRole.ADMIN)" class="ml-auto text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded">
                      仅管理员
                    </span>
                  </button>
                </li>
              </ul>
            </nav>

            <!-- 角色信息 (可折叠) -->
            <div class="p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                @click="togglePermissions"
                class="w-full flex items-center justify-between text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2"
              >
                <span>当前权限</span>
                <svg
                  class="w-4 h-4 transition-transform"
                  :class="{ 'rotate-180': !isPermissionsCollapsed }"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                </svg>
              </button>

              <div v-if="!isPermissionsCollapsed" class="text-sm text-gray-700 dark:text-gray-300 space-y-2">
                <div class="flex items-center justify-between">
                  <span>用户管理</span>
                  <span v-if="user?.role === 'admin'" class="text-green-600">✓</span>
                  <span v-else class="text-gray-400">✗</span>
                </div>
                <div class="flex items-center justify-between">
                  <span>内容管理</span>
                  <span v-if="['admin', 'core', 'premium'].includes(user?.role || '')" class="text-green-600">✓</span>
                  <span v-else class="text-gray-400">✗</span>
                </div>
                <div class="flex items-center justify-between">
                  <span>活动编辑</span>
                  <span v-if="['admin', 'core'].includes(user?.role || '')" class="text-green-600">✓</span>
                  <span v-else class="text-gray-400">✗</span>
                </div>
                <div class="flex items-center justify-between">
                  <span>商品管理</span>
                  <span v-if="['admin', 'core'].includes(user?.role || '')" class="text-green-600">✓</span>
                  <span v-else class="text-gray-400">✗</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 桌面端侧边栏 -->
      <aside class="hidden lg:block lg:w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 min-h-screen">
        <!-- 用户信息 -->
        <div class="p-6 border-b border-gray-200 dark:border-gray-700">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span class="text-blue-600 dark:text-blue-300 font-bold text-lg">
                {{ user?.username?.charAt(0) || 'U' }}
              </span>
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-white">{{ user?.username }}</h3>
              <p class="text-sm text-gray-500 dark:text-gray-400 capitalize">{{ user?.role }}</p>
            </div>
          </div>
        </div>

        <!-- 标签页导航 -->
        <nav class="p-4">
          <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
            管理菜单
          </h4>
          <ul class="space-y-1">
            <li v-for="tab in accessibleTabs" :key="tab.id">
              <button
                @click="switchTab(tab.id)"
                :class="[
                  'w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                  activeTab === tab.id
                    ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                ]"
              >
                <span class="text-lg">{{
                  tab.icon === 'dashboard' ? '📊' :
                  tab.icon === 'users' ? '👥' :
                  tab.icon === 'file-text' ? '📄' :
                  tab.icon === 'calendar' ? '📅' :
                  tab.icon === 'shopping-bag' ? '🛍️' :
                  tab.icon === 'check-square' ? '✅' :
                  tab.icon === 'settings' ? '⚙️' :
                  tab.icon === 'clipboard' ? '📋' : '📌'
                }}</span>
                <span>{{ tab.name }}</span>
                <span v-if="tab.requiredRole.includes(UserRole.ADMIN)" class="ml-auto text-xs px-2 py-1 bg-red-100 dark:bg-red-900 text-red-600 dark:text-red-300 rounded">
                  仅管理员
                </span>
              </button>
            </li>
          </ul>
        </nav>

        <!-- 角色信息 (桌面端默认展开) -->
        <div class="p-4 border-t border-gray-200 dark:border-gray-700 mt-4">
          <h4 class="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            当前权限
          </h4>
          <div class="text-sm text-gray-700 dark:text-gray-300">
            <div class="flex items-center justify-between mb-1">
              <span>用户管理</span>
              <span v-if="user?.role === 'admin'" class="text-green-600">✓</span>
              <span v-else class="text-gray-400">✗</span>
            </div>
            <div class="flex items-center justify-between mb-1">
              <span>内容管理</span>
              <span v-if="['admin', 'core', 'premium'].includes(user?.role || '')" class="text-green-600">✓</span>
              <span v-else class="text-gray-400">✗</span>
            </div>
            <div class="flex items-center justify-between mb-1">
              <span>活动编辑</span>
              <span v-if="['admin', 'core'].includes(user?.role || '')" class="text-green-600">✓</span>
              <span v-else class="text-gray-400">✗</span>
            </div>
            <div class="flex items-center justify-between">
              <span>商品管理</span>
              <span v-if="['admin', 'core'].includes(user?.role || '')" class="text-green-600">✓</span>
              <span v-else class="text-gray-400">✗</span>
            </div>
          </div>
        </div>
      </aside>

      <!-- 主内容区 -->
      <main class="flex-1 p-4 lg:p-6">
        <!-- 顶部栏 (桌面端) -->
        <div class="hidden lg:flex flex-col sm:flex-row sm:items-center justify-between mb-8">
          <div>
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {{ currentTab?.name || '管理员控制后台' }}
            </h1>
            <p class="text-gray-600 dark:text-gray-400">
              {{ currentTab?.description || '系统管理面板' }}
            </p>
          </div>

          <div class="flex items-center space-x-4 mt-4 sm:mt-0">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              当前角色: <span class="font-semibold text-blue-600 dark:text-blue-400 capitalize">{{ user?.role }}</span>
            </div>
            <button
              @click="$router.push('/')"
              class="px-4 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              返回网站
            </button>
          </div>
        </div>

        <!-- 移动端内容标题 -->
        <div class="lg:hidden mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h2 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ currentTab?.name || '管理员控制后台' }}
              </h2>
              <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {{ currentTab?.description || '系统管理面板' }}
              </p>
            </div>
            <button
              @click="$router.push('/')"
              class="px-3 py-1.5 text-xs border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              返回
            </button>
          </div>

          <!-- 移动端快速角色信息 -->
          <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-600 dark:text-gray-400">
                当前角色: <span class="font-semibold text-blue-600 dark:text-blue-400 capitalize">{{ user?.role }}</span>
              </div>
              <button
                @click="togglePermissions"
                class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
              >
                {{ isPermissionsCollapsed ? '查看权限' : '隐藏权限' }}
              </button>
            </div>

            <!-- 折叠的权限信息 -->
            <div v-if="!isPermissionsCollapsed" class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div class="grid grid-cols-2 gap-2 text-xs">
                <div class="flex items-center justify-between">
                  <span class="text-gray-600 dark:text-gray-400">用户管理</span>
                  <span v-if="user?.role === 'admin'" class="text-green-600">✓</span>
                  <span v-else class="text-gray-400">✗</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600 dark:text-gray-400">内容管理</span>
                  <span v-if="['admin', 'core', 'premium'].includes(user?.role || '')" class="text-green-600">✓</span>
                  <span v-else class="text-gray-400">✗</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600 dark:text-gray-400">活动编辑</span>
                  <span v-if="['admin', 'core'].includes(user?.role || '')" class="text-green-600">✓</span>
                  <span v-else class="text-gray-400">✗</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-gray-600 dark:text-gray-400">商品管理</span>
                  <span v-if="['admin', 'core'].includes(user?.role || '')" class="text-green-600">✓</span>
                  <span v-else class="text-gray-400">✗</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 标签页内容 -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <!-- 仪表盘 -->
          <div v-if="activeTab === 'dashboard'">
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div class="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-xl">
                <div class="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">1,248</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">总用户数</div>
              </div>
              <div class="bg-green-50 dark:bg-green-900/20 p-6 rounded-xl">
                <div class="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">356</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">今日活跃</div>
              </div>
              <div class="bg-purple-50 dark:bg-purple-900/20 p-6 rounded-xl">
                <div class="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">89</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">新内容</div>
              </div>
              <div class="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl">
                <div class="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2">24</div>
                <div class="text-sm text-gray-600 dark:text-gray-400">待处理</div>
              </div>
            </div>

            <div class="border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">系统概览</h3>
              <p class="text-gray-600 dark:text-gray-400">
                欢迎使用SCU IGDA管理员控制后台。您当前以 <span class="font-semibold capitalize">{{ user?.role }}</span> 身份登录。
                根据您的角色，您可以访问特定的管理功能。
              </p>
            </div>
          </div>

          <!-- 用户管理 -->
          <div v-else-if="activeTab === 'user_management'">
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">用户管理</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                管理用户账号、权限和角色分配。只有管理员可以访问此功能。
              </p>

              <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-8 text-center">
                <div class="text-4xl mb-4">👥</div>
                <h4 class="text-xl font-semibold text-gray-900 dark:text-white mb-2">用户管理面板</h4>
                <p class="text-gray-600 dark:text-gray-400 mb-6">
                  此功能正在开发中，将包含用户列表、角色编辑、权限分配等功能。
                </p>
                <div class="inline-flex items-center px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg">
                  开发中
                </div>
              </div>
            </div>
          </div>

          <!-- 内容管理 -->
          <div v-else-if="activeTab === 'content_management'">
            <div class="mb-6">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">内容管理</h3>
              <p class="text-gray-600 dark:text-gray-400 mb-6">
                管理内容库、审核帖子、分类管理等。高级会员及以上可以访问。
              </p>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 class="font-semibold text-gray-900 dark:text-white mb-3">内容统计</h4>
                  <div class="space-y-3">
                    <div class="flex justify-between">
                      <span class="text-gray-600 dark:text-gray-400">总帖子数</span>
                      <span class="font-semibold">1,245</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600 dark:text-gray-400">待审核</span>
                      <span class="font-semibold text-yellow-600">12</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-gray-600 dark:text-gray-400">今日新增</span>
                      <span class="font-semibold text-green-600">24</span>
                    </div>
                  </div>
                </div>

                <div class="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                  <h4 class="font-semibold text-gray-900 dark:text-white mb-3">快速操作</h4>
                  <div class="space-y-3">
                    <button class="w-full text-left px-4 py-3 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                      审核待处理内容
                    </button>
                    <button class="w-full text-left px-4 py-3 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                      添加新分类
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 其他标签页占位 -->
          <div v-else>
            <div class="text-center py-12">
              <div class="text-5xl mb-6">{{
                currentTab?.icon === 'calendar' ? '📅' :
                currentTab?.icon === 'shopping-bag' ? '🛍️' :
                currentTab?.icon === 'check-square' ? '✅' :
                currentTab?.icon === 'settings' ? '⚙️' :
                currentTab?.icon === 'clipboard' ? '📋' : '📌'
              }}</div>
              <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">{{ currentTab?.name }}</h3>
              <p class="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                {{ currentTab?.description }}
              </p>
              <div class="inline-flex items-center px-6 py-3 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700">
                功能开发中
              </div>
            </div>
          </div>
        </div>

        <!-- 底部信息 -->
        <div class="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>SCU IGDA 管理员控制后台 • 当前版本: 1.0.0 • 最后更新: 2026-01-24</p>
          <p class="mt-1">如需帮助，请联系系统管理员</p>
        </div>
      </main>
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

/* 移动端侧边栏动画 */
.mobile-sidebar {
  animation: slideInLeft 0.3s ease-out;
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

/* 移动端优化 */
@media (max-width: 1023px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .stat-card {
    padding: 1rem;
  }
}
</style>
