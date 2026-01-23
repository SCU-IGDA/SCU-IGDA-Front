<!-- components/App/Header.vue -->
<!-- 全局导航栏 -->

<script setup lang="ts">
// 定义导航菜单项
const navLinks = [
  { name: '首页', path: '/' },
  { name: '近期活动', path: '/activities' },
  { name: '内容库', path: '/content' },
]
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-100">
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
          <button class="text-gray-500 hover:text-black">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </button>

          <!-- 登录按钮 -->
          <NuxtLink
            to="/login"
            class="hidden sm:inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white dark:text-black bg-gray-800 dark:bg-gray-300 rounded-md hover:bg-gray-800 dark:hover:bg-gray-200 transition-all shadow-sm"
          >
            登录 / 注册
          </NuxtLink>
        </div>
      </div>
    </AppContainer>
  </header>
</template>
