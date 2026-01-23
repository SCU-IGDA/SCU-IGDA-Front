<!-- pages/activities.vue -->
<!-- 近期活动页面 - 占位符 -->

<script setup lang="ts">
// 页面元数据
useHead({
  title: '近期活动 - SCU IGDA',
  meta: [
    { name: 'description', content: '四川大学游戏开发与研究社近期活动安排与历史活动回顾。' }
  ]
})
</script>

<template>
  <div class="bg-white dark:bg-gray-900 min-h-screen pb-20 transition-colors duration-300 select-none">
    <AppContainer>
      <!-- 页面标题 -->
      <div class="pt-12 pb-8 text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          近期活动
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          社团近期举办的技术分享、游戏开发工作坊、招新面试等活动安排
        </p>
      </div>

      <!-- 占位内容 -->
      <div class="max-w-4xl mx-auto mt-12">
        <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-10 border border-gray-200 dark:border-gray-700 text-center">
          <div class="text-6xl mb-6">📅</div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            活动页面开发中
          </h2>
          <p class="text-gray-600 dark:text-gray-400 mb-6">
            近期活动功能正在积极开发中。
          </p>
          <div class="space-y-4 max-w-md mx-auto">
            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <span class="text-blue-600 dark:text-blue-400 font-bold">1</span>
                </div>
                <div class="text-left">
                  <p class="font-medium text-gray-900 dark:text-white">技术分享会</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">Unity DOTS 与高性能游戏开发</p>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <span class="text-green-600 dark:text-green-400 font-bold">2</span>
                </div>
                <div class="text-left">
                  <p class="font-medium text-gray-900 dark:text-white">春季招新面试</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">2026年春季社团成员招募</p>
                </div>
              </div>
            </div>

            <div class="bg-white dark:bg-gray-800 p-4 rounded-lg border border-gray-100 dark:border-gray-700">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <span class="text-purple-600 dark:text-purple-400 font-bold">3</span>
                </div>
                <div class="text-left">
                  <p class="font-medium text-gray-900 dark:text-white">Game Jam 活动</p>
                  <p class="text-sm text-gray-500 dark:text-gray-400">48小时极限游戏开发挑战</p>
                </div>
              </div>
            </div>
          </div>

          <div class="mt-10 pt-6 border-t border-gray-200 dark:border-gray-700">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-4">
              想要了解更多活动信息或提出活动建议？
            </p>
            <BaseButton to="/content" variant="outline" class="mx-2">
              查看内容库
            </BaseButton>
            <BaseButton to="/" variant="ghost" class="mx-2">
              返回首页
            </BaseButton>
          </div>
        </div>
      </div>
    </AppContainer>
  </div>
</template>

<style scoped>
/* 占位符页面样式 */
</style>
