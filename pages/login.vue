<!-- pages/login.vue -->
<!-- 登录页面 -->

<script setup lang="ts">
// 页面元数据
useHead({ title: '登录 - SCU IGDA' })

// UI 状态
const form = ref({
  email: '',        // 用户邮箱
  password: '',     // 用户密码
  remember: false   // 记住密码
})
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8 min-h-[80vh] transition-colors duration-300">

    <!-- 头部：标题与描述 -->
    <div class="w-full max-w-md text-center mb-8 select-none">
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
        <div class="flex items-center justify-between select-none">
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

            <!-- 底部跳转 -->
      <p class="mt-8 text-center text-sm text-gray-600 dark:text-gray-400 select-none">
        还没有账号?
        <NuxtLink to="/register" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
          立即注册
        </NuxtLink>
      </p>

    </div>
  </div>
</template>
