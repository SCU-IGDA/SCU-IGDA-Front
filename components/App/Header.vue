<!-- components/App/Header.vue -->
<!-- 全局导航栏 -->

<script setup lang="ts">
import { useAuth } from '~/composables/useAuth'

// 用户认证状态
const { user, canAccessAdmin, initAuth } = useAuth()

// 初始化用户状态
onMounted(() => {
  initAuth()
})

// 定义导航菜单项
const navLinks = computed(() => {
  const links = [
    { name: '首页', path: '/' },
    { name: '近期活动', path: '/activities' },
    { name: '内容库', path: '/content' },
    { name: '组队系统', path: '/teams' },
    { name: '关于我们', path: '/about' }
  ]

  // 如果用户有管理员权限，添加管理员入口
  if (canAccessAdmin()) {
    links.push({ name: '管理后台', path: '/admin' })
  }

  return links
})

// 移动端菜单状态
const isMobileMenuOpen = ref(false)

// 点击菜单项后关闭移动端菜单
const handleNavClick = () => {
  isMobileMenuOpen.value = false
}

// 点击外部关闭菜单
const closeOnClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.mobile-menu-container') && !target.closest('.hamburger-button')) {
    isMobileMenuOpen.value = false
  }
}

// 监听点击事件
onMounted(() => {
  document.addEventListener('click', closeOnClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeOnClickOutside)
})

// 用户菜单相关
const isUserMenuOpen = ref(false)
const toggleUserMenu = () => {
  isUserMenuOpen.value = !isUserMenuOpen.value
}

// 登出函数
const { logout } = useAuth()
const handleLogout = () => {
  logout()
  isUserMenuOpen.value = false
  navigateTo('/')
}

// 监听用户状态变化，确保组件更新
watch(user, () => {
  // 用户状态变化时，强制重新计算导航链接
  console.log('用户状态变化:', user.value?.username)
}, { immediate: true })
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 select-none">
    <AppContainer>
      <div class="flex items-center justify-between h-16">
        <!-- Left: Logo -->
        <div class="flex-shrink-0 flex items-center gap-3">
          <!-- Logo -->
          <img
            src="~/assets/images/logo/logo-black-1.jpg"
            alt="SCU IGDA Logo"
            class="w-8 h-8 object-contain"
          >
          <NuxtLink to="/" class="text-xl font-bold text-gray-900 dark:text-white tracking-tight">
            SCU IGDA
          </NuxtLink>
        </div>

        <!-- Center: Navigation (Desktop) -->
        <nav class="hidden md:flex gap-8">
          <NuxtLink
            v-for="link in navLinks"
            :key="link.path"
            :to="link.path"
            class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black transition-colors py-2 border-b-2 border-transparent"
            active-class="!text-black dark:!text-white border-black dark:border-white"
          >
            {{ link.name }}
          </NuxtLink>
        </nav>

        <!-- Right: User / Login Action -->
        <div class="flex items-center gap-4">
          <AppThemeToggle />
          <!-- TODO: 搜索图标占位 -->
          <button class="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>

          <!-- 用户已登录 (桌面端显示下拉菜单，移动端不显示) -->
          <div v-if="user" class="hidden md:block relative">
            <button
              @click="toggleUserMenu"
              class="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors focus:outline-none"
            >
              <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                <span class="text-blue-600 dark:text-blue-300 font-semibold text-sm">
                  {{ user.username?.charAt(0) || 'U' }}
                </span>
              </div>
              <span class="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-300">
                {{ user.username }}
              </span>
              <svg
                class="w-4 h-4 text-gray-500 dark:text-gray-400"
                :class="{ 'rotate-180': isUserMenuOpen }"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- 用户下拉菜单 (仅桌面端) -->
            <div
              v-if="isUserMenuOpen"
              class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50"
            >
              <div class="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user.username }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ user.role }}</p>
              </div>

              <NuxtLink
                to="/profile"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="isUserMenuOpen = false"
              >
                个人资料
              </NuxtLink>

              <NuxtLink
                v-if="canAccessAdmin()"
                to="/admin"
                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                @click="isUserMenuOpen = false"
              >
                管理后台
              </NuxtLink>

              <button
                @click="handleLogout"
                class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                退出登录
              </button>
            </div>
          </div>

          <!-- 移动端用户头像 (仅显示头像，不显示下拉菜单) -->
          <div v-if="user" class="md:hidden">
            <div class="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <span class="text-blue-600 dark:text-blue-300 font-semibold text-sm">
                {{ user.username?.charAt(0) || 'U' }}
              </span>
            </div>
          </div>

          <!-- 未登录状态 -->
          <div v-else>
            <!-- 登录按钮 (桌面端) -->
            <NuxtLink
              to="/login"
              class="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white dark:text-black bg-gray-800 dark:bg-gray-300 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-sm"
            >
              登录 / 注册
            </NuxtLink>
          </div>

          <!-- 移动端汉堡菜单按钮 -->
          <button
            class="md:hidden hamburger-button p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none"
            @click.stop="isMobileMenuOpen = !isMobileMenuOpen"
            aria-label="Toggle mobile menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="transition-transform duration-300"
              :class="{ 'rotate-90': isMobileMenuOpen }"
            >
              <line v-if="!isMobileMenuOpen" x1="3" y1="12" x2="21" y2="12"/>
              <line v-if="!isMobileMenuOpen" x1="3" y1="6" x2="21" y2="6"/>
              <line v-if="!isMobileMenuOpen" x1="3" y1="18" x2="21" y2="18"/>
              <path v-if="isMobileMenuOpen" d="M18 6L6 18"/>
              <path v-if="isMobileMenuOpen" d="M6 6L18 18"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- 移动端菜单 (下拉) -->
      <div
        v-if="isMobileMenuOpen"
        class="mobile-menu-container md:hidden absolute left-0 right-0 top-16 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 shadow-lg"
      >
        <div class="py-4 px-4">
          <nav class="flex flex-col space-y-2">
            <NuxtLink
              v-for="link in navLinks"
              :key="link.path"
              :to="link.path"
              class="px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors"
              active-class="!text-black dark:!text-white bg-gray-100 dark:bg-gray-800"
              @click="handleNavClick"
            >
              {{ link.name }}
            </NuxtLink>

            <!-- 移动端用户状态 -->
            <div v-if="user" class="pt-4 border-t border-gray-100 dark:border-gray-800 mt-2">
              <div class="px-4 py-3 mb-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <p class="text-sm font-medium text-gray-900 dark:text-white">{{ user.username }}</p>
                <p class="text-xs text-gray-500 dark:text-gray-400 capitalize">{{ user.role }}</p>
              </div>

              <NuxtLink
                to="/profile"
                class="flex items-center px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg transition-colors mb-2"
                @click="handleNavClick"
              >
                个人资料
              </NuxtLink>

              <NuxtLink
                v-if="canAccessAdmin()"
                to="/admin"
                class="flex items-center px-4 py-3 text-base font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors mb-2"
                @click="handleNavClick"
              >
                管理后台
              </NuxtLink>

              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-3 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                退出登录
              </button>
            </div>

            <!-- 移动端登录按钮 (未登录状态) -->
            <div v-else class="pt-4 border-t border-gray-100 dark:border-gray-800 mt-2">
              <NuxtLink
                to="/login"
                class="flex items-center justify-center px-4 py-3 text-base font-medium text-white dark:text-black bg-gray-800 dark:bg-gray-300 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-200 transition-all"
                @click="handleNavClick"
              >
                登录 / 注册
              </NuxtLink>
            </div>
          </nav>
        </div>
      </div>
    </AppContainer>
  </header>
</template>

<style scoped>
/* 平滑过渡动画 */
.mobile-menu-container {
  animation: slideDown 0.2s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
