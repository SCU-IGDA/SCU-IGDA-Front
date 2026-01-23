<!-- pages/register.vue -->
<!-- 注册页面 -->

<script setup lang="ts">
// 页面元数据
useHead({ title: '注册账号 - SCU IGDA' })

// UI 状态
const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  agree: false
})
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8 min-h-[80vh] transition-colors duration-300">

    <!-- 头部：标题与描述 -->
    <div class="w-full max-w-md text-center mb-8">
      <h2 class="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
        加入社团
      </h2>
      <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
        创建一个新账号，开启游戏创作之旅
      </p>
    </div>

    <!-- 卡片容器 -->
    <div class="w-full max-w-md bg-white dark:bg-gray-800 py-10 px-8 shadow-xl rounded-2xl border border-gray-100 dark:border-gray-700 transition-colors duration-300">

      <form class="space-y-5" @submit.prevent>

        <!-- 基础输入框 -->
        <BaseInput
          v-model="form.username"
          label="用户名"
          placeholder="给自己起个响亮的名字"
          id="username"
        />

        <BaseInput
          v-model="form.email"
          label="电子邮箱"
          type="email"
          placeholder="example@scu.edu.cn"
          id="email"
        />

        <BaseInput
          v-model="form.password"
          type="password"
          label="密码"
          placeholder="至少 8 位字符"
          id="password"
        />

        <BaseInput
          v-model="form.confirmPassword"
          type="password"
          label="确认密码"
          placeholder="请再次输入密码"
          id="confirm-password"
        />

        <!-- 用户协议勾选 -->
        <div class="flex items-start pt-2">
          <div class="flex items-center h-5">
            <input
              id="agree"
              v-model="form.agree"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 dark:bg-gray-700 rounded cursor-pointer"
            >
          </div>
          <div class="ml-2 text-sm">
            <label for="agree" class="font-medium text-gray-700 dark:text-gray-300 cursor-pointer">
              我已阅读并同意
            </label>
            <a href="#" class="text-blue-600 hover:text-blue-500 transition-colors">《社团章程》</a>
            <span class="text-gray-500 dark:text-gray-400"> 和 </span>
            <a href="#" class="text-blue-600 hover:text-blue-500 transition-colors">《隐私政策》</a>
          </div>
        </div>

        <!-- 注册按钮 -->
        <div class="pt-2">
          <BaseButton
            type="submit"
            class="w-full shadow-md shadow-blue-200 dark:shadow-blue-900/20"
            size="lg"
            :disabled="!form.agree"
          >
            注册账号
          </BaseButton>
        </div>
      </form>

      <!-- 分割线 -->
      <AuthDivider label="或者" />

      <!-- 底部跳转链接 -->
      <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
        已有账号?
        <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
          直接登录
        </NuxtLink>
      </p>

    </div>
  </div>
</template>
