<!-- pages/login.vue -->
<!-- 登录页面 -->

<script setup lang="ts">
// 页面元数据
useHead({ title: '登录 - SCU IGDA' })

// UI 状态
const form = ref({
  email: '',
  password: '',
  remember: false
})
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8 min-h-[80vh] transition-colors duration-300">

    <!-- 头部：标题与描述 -->
    <div class="w-full max-w-md text-center mb-8">
      <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        欢迎回来
      </h2>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        登录以管理您的作品和参与社团活动
      </p>
    </div>

    <!-- 卡片：适配暗黑模式背景与边框 -->
    <div class="w-full max-w-md bg-white dark:bg-gray-800 py-10 px-8 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">

      <form class="space-y-6" @submit.prevent>

        <!-- 基础输入框 -->
        <BaseInput
          v-model="form.email"
          label="邮箱 / 学号"
          placeholder="请输入您的邮箱或学号"
          id="email"
        />

        <div class="space-y-1">
          <BaseInput
            v-model="form.password"
            type="password"
            label="密码"
            placeholder="请输入密码"
            id="password"
          />
        </div>

        <!-- 选项栏 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="form.remember"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded cursor-pointer"
            >
            <label for="remember-me" class="ml-2 block text-sm text-gray-900 dark:text-gray-300 cursor-pointer">
              记住我
            </label>
          </div>

          <div class="text-sm">
            <a href="#" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
              忘记密码?
            </a>
          </div>
        </div>

        <!-- 提交按钮 -->
        <div>
          <BaseButton type="submit" class="w-full shadow-md shadow-blue-200 dark:shadow-blue-900/20" size="lg">
            登录
          </BaseButton>
        </div>
      </form>

      <AuthDivider label="使用第三方账号登录" />

      <!-- 第三方按钮 -->
      <div class="grid grid-cols-2 gap-4">
        <!-- AuthSocialButton 内部应添加 dark:bg-gray-700 dark:border-gray-600 -->
        <AuthSocialButton class="dark:bg-gray-700 dark:border-gray-600">
          <svg class="h-5 w-5 text-[#0099FF]" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 2.2c3.44 0 6.45 1.58 8.35 4.02-.35.32-.73.61-1.13.86-.32-2.18-2.2-3.88-4.47-3.88-1.57 0-2.95.82-3.77 2.06-.82-1.24-2.2-2.06-3.77-2.06-2.27 0-4.15 1.7-4.47 3.88-.4-.25-.78-.54-1.13-.86C3.55 3.78 6.56 2.2 12 2.2z"/></svg>
          <span class="ml-2 dark:text-gray-300">QQ</span>
        </AuthSocialButton>

        <AuthSocialButton class="dark:bg-gray-700 dark:border-gray-600">
          <svg class="h-5 w-5 text-[#07C160]" fill="currentColor" viewBox="0 0 24 24"><path d="M17.4 12.6c0-.9.2-1.8.6-2.6-1.5-.7-3.2-1.1-5-1.1-6.1 0-11 3.8-11 8.5 0 2.6 1.5 5 4.1 6.5-.2.8-.7 1.9-1.3 2.5 1.7 0 3.3-.8 4.6-1.7.9.2 1.9.3 2.9.3.4 0 .9 0 1.3-.1-.3-1.1-.4-2.2-.4-3.4-.1-4.7 3.9-8.5 8.7-8.5 1.9 0 3.6.6 5.1 1.6.4-1.3.6-2.7.6-4.1-.1-4.7-5-8.5-11.2-8.5z"/></svg>
          <span class="ml-2 dark:text-gray-300">微信</span>
        </AuthSocialButton>
      </div>

      <!-- 底部跳转 -->
      <p class="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
        还没有账号?
        <NuxtLink to="/register" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
          立即注册
        </NuxtLink>
      </p>

    </div>
  </div>
</template>
