<!-- components/App/Header.vue -->
<!-- 全局导航栏 -->

<script setup lang="ts">
// 1. 引入 Auth 钩子 (确保你有 composables/useAuth.ts)
const { user, isLoggedIn, logout, token } = useAuth()

// 定义导航菜单项
const navLinks = [
  { name: '首页', path: '/' },
  { name: '近期活动', path: '/activities' },
  { name: '内容库', path: '/content' },
  { name: '组队系统', path: '/teams' },
  { name: '关于我们', path: '/about' }
]

// 移动端菜单状态
const isMobileMenuOpen = ref(false)

// 点击菜单项后关闭移动端菜单
const handleNavClick = () => {
  isMobileMenuOpen.value = false
}

// 处理退出登录（同时关闭移动端菜单）
const handleLogout = () => {
  logout()
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
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 select-none transition-colors duration-300">
    <AppContainer>
      <div class="flex items-center justify-between h-16">
        <!-- Left: Logo -->
        <div class="flex-shrink-0 flex items-center gap-3">
          <img
            src="~/assets/images/logo/logo-black-1.jpg"
            alt="SCU IGDA Logo"
            class="w-8 h-8 object-contain rounded-full"
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
            class="text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-black dark:hover:text-white transition-colors py-2 border-b-2 border-transparent"
            active-class="!text-black dark:!text-white border-black dark:border-white"
          >
            {{ link.name }}
          </NuxtLink>
        </nav>

        <!-- Right: User / Login Action -->
        <div class="flex items-center gap-4">
          <AppThemeToggle />
          
          <!-- 搜索按钮 (保留原样) -->
          <button class="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>

          <!-- 🌟 PC端逻辑核心修改区 -->
          <ClientOnly>
			<!-- 情况A: 已登录 (头像 + 下拉菜单) -->
            <div v-if="isLoggedIn " class="hidden sm:relative sm:flex group">
              <!-- 用户触发按钮 -->
              <button class="flex items-center gap-2 focus:outline-none py-2">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-200 max-w-[100px] truncate">
                  {{ user?.username || '用户' }}
                </span>
                <img 
                  :src="user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'" 
                  class="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 dark:border-gray-700 object-cover"
                  alt="Avatar"
                />
              </button>

              <!-- 下拉菜单 (Hover显示) -->
              <div class="absolute right-0 top-full pt-2 w-48 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform translate-y-2 group-hover:translate-y-0">
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                  <div class="py-1">
                    <NuxtLink to="/dashboard" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                      个人中心
                    </NuxtLink>
                    <NuxtLink to="/content/create" class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700">
                      发布作品
                    </NuxtLink>
                    <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                    <button @click="handleLogout" class="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20">
                      退出登录
                    </button>
                  </div>
                </div>
              </div>
            </div>
			
            <!-- 情况B: 未登录 -->
            <NuxtLink
              v-else-if="!token"
              to="/login"
              class="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white dark:text-black bg-gray-800 dark:bg-gray-300 rounded-md hover:bg-gray-700 dark:hover:bg-gray-200 transition-all shadow-sm"
            >
              登录 / 注册
            </NuxtLink>

            

            <!-- 加载时的占位符 (防止闪烁) -->
            <template v-else>
              <div class="w-20 h-9 bg-gray-200 dark:bg-gray-700 rounded animate-pulse hidden sm:block"></div>
            </template>
          </ClientOnly>

          <!-- 移动端汉堡菜单按钮 -->
          <button
            class="md:hidden hamburger-button p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors focus:outline-none"
            @click.stop="isMobileMenuOpen = !isMobileMenuOpen"
            aria-label="Toggle mobile menu"
          >
            <!-- 汉堡图标SVG保持不变 -->
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="transition-transform duration-300" :class="{ 'rotate-90': isMobileMenuOpen }">
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
        <div class="py-4 px-4 h-[calc(100vh-4rem)] overflow-y-auto">
          <nav class="flex flex-col space-y-2">
            <!-- 普通导航链接 -->
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

            <!-- 🌟 移动端登录/用户信息区域 -->
            <div class="pt-4 border-t border-gray-100 dark:border-gray-800 mt-2">
              <ClientOnly>
                <!-- 情况A: 移动端未登录 -->
                <NuxtLink
                  v-if="!isLoggedIn"
                  to="/login"
                  class="flex items-center justify-center px-4 py-3 text-base font-medium text-white dark:text-black bg-gray-800 dark:bg-gray-300 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-200 transition-all"
                  @click="handleNavClick"
                >
                  登录 / 注册
                </NuxtLink>

                <!-- 情况B: 移动端已登录 -->
                <div v-else class="space-y-2">
                  <!-- 用户信息卡片 -->
                  <div class="flex items-center gap-3 px-4 py-2 mb-2 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <img 
                      :src="user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'" 
                      class="w-10 h-10 rounded-full border border-gray-200 dark:border-gray-700 object-cover"
                    />
                    <div class="overflow-hidden">
                      <p class="font-bold text-gray-900 dark:text-white truncate">{{ user?.username }}</p>
                      <p class="text-xs text-gray-500 truncate">{{ user?.email }}</p>
                    </div>
                  </div>
                  
                  <NuxtLink 
                    to="/dashboard" 
                    class="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                    @click="handleNavClick"
                  >
                    个人中心
                  </NuxtLink>
                  <NuxtLink 
                    to="/content/create" 
                    class="block px-4 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-lg"
                    @click="handleNavClick"
                  >
                    发布作品
                  </NuxtLink>
                  <button 
                    @click="handleLogout" 
                    class="w-full text-left px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg"
                  >
                    退出登录
                  </button>
                </div>
              </ClientOnly>
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
