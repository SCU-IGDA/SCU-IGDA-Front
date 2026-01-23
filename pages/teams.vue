<!-- pages/teams.vue -->
<!-- 组队系统页面 - 占位符 -->

<script setup lang="ts">
// 页面元数据
useHead({
  title: '组队系统 - SCU IGDA',
  meta: [
    { name: 'description', content: '四川大学游戏开发与研究社组队系统，帮助成员组建游戏开发团队。' }
  ]
})
</script>

<template>
  <div class="bg-white dark:bg-gray-900 min-h-screen pb-20 transition-colors duration-300 select-none">
    <AppContainer>
      <!-- 页面标题 -->
      <div class="pt-12 pb-8 text-center">
        <div class="inline-flex items-center gap-3 mb-4">
          <div class="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <svg class="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
          </div>
          <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            组队系统
          </h1>
        </div>
        <p class="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          寻找志同道合的伙伴，组建你的游戏开发团队
        </p>
        <div class="mt-4">
          <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd"></path></svg>
            开发中功能
          </span>
        </div>
      </div>

      <!-- 占位内容 -->
      <div class="max-w-6xl mx-auto mt-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- 左侧：功能介绍 -->
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              组队系统功能预览
            </h2>

            <div class="space-y-6">
              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white mb-1">智能匹配</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">根据技能、兴趣、可用时间自动匹配最合适的团队成员</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white mb-1">项目展示</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">展示你的游戏创意或正在开发的项目，吸引感兴趣的成员加入</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white mb-1">团队管理</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">创建团队、分配角色、设置里程碑，高效管理开发进度</p>
                </div>
              </div>

              <div class="flex items-start gap-4">
                <div class="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center flex-shrink-0">
                  <svg class="w-5 h-5 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
                </div>
                <div>
                  <h3 class="font-medium text-gray-900 dark:text-white mb-1">沟通协作</h3>
                  <p class="text-gray-600 dark:text-gray-400 text-sm">内置讨论区、文件共享、任务跟踪等协作工具</p>
                </div>
              </div>
            </div>
          </div>

          <!-- 右侧：开发状态 -->
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 border border-blue-100 dark:border-blue-800">
            <div class="text-center mb-8">
              <div class="text-6xl mb-4">🚧</div>
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                功能开发中
              </h2>
              <p class="text-gray-600 dark:text-gray-400">
                我们正在全力开发组队系统
              </p>
            </div>

            <div class="space-y-4">
              <div>
                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>后端开发</span>
                  <span>75%</span>
                </div>
                <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div class="h-full bg-blue-600 rounded-full" style="width: 75%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>前端界面</span>
                  <span>60%</span>
                </div>
                <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div class="h-full bg-green-600 rounded-full" style="width: 60%"></div>
                </div>
              </div>

              <div>
                <div class="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>测试与优化</span>
                  <span>30%</span>
                </div>
                <div class="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div class="h-full bg-purple-600 rounded-full" style="width: 30%"></div>
                </div>
              </div>
            </div>

            <div class="mt-8 pt-6 border-t border-blue-100 dark:border-blue-800">
              <p class="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
                想要提前体验或提供建议？
              </p>
              <div class="flex flex-col sm:flex-row gap-3 justify-center">
                <BaseButton to="/content" variant="outline" size="sm">
                  查看现有项目
                </BaseButton>
                <BaseButton to="/" variant="ghost" size="sm">
                  返回首页
                </BaseButton>
              </div>
            </div>
          </div>
        </div>

        <!-- 提示信息 -->
        <div class="mt-10 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6">
          <div class="flex items-start gap-4">
            <div class="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0">
              <svg class="w-5 h-5 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path></svg>
            </div>
            <div>
              <h3 class="font-medium text-gray-900 dark:text-white mb-1">临时解决方案</h3>
              <p class="text-gray-600 dark:text-gray-400 text-sm">
                在组队系统上线前，你可以通过内容库发布"组队招募"帖子，或联系社团管理员协助寻找团队成员。
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppContainer>
  </div>
</template>

<style scoped>
/* 占位符页面样式 */
</style>
