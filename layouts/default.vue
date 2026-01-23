<template>
  <div class="flex flex-col min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
    <!-- 1. 注册鼠标跟随组件 -->
    <AppCursor />

    <!-- 2. 注册点击特效组件 -->
    <AppClickSpark />

    <!-- 顶部导航 -->
    <AppHeader />

    <!-- 页面内容 -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- 底部页脚 -->
    <AppFooter />
  </div>
</template>

<style>
body {
  cursor: none;
}
a, button {
  cursor: none;
}
</style>
