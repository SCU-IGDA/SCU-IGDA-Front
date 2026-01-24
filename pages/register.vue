<!-- pages/register.vue -->
<!-- 注册页面 -->

<script setup lang="ts">
// 页面元数据
useHead({ title: '注册账号 - SCU IGDA' })

// UI 状态
const form = ref({
  username: '',           // 用户名
  email: '',              // 电子邮箱
  verificationCode: '',   // 验证码
  password: '',           // 密码
  confirmPassword: '',    // 确认密码
  agree: false            // 用户协议
})

// 验证码计时器
const countdown = ref(0)
const canResend = ref(true)
let timer: NodeJS.Timeout | null = null

// 从本地存储恢复倒计时状态
const restoreCountdownState = () => {
  const savedEndTime = localStorage.getItem('verificationCodeEndTime')
  if (savedEndTime) {
    const endTime = parseInt(savedEndTime)
    const now = Date.now()
    const remainingSeconds = Math.max(0, Math.floor((endTime - now) / 1000))

    if (remainingSeconds > 0) {
      countdown.value = remainingSeconds
      canResend.value = false
      startCountdownTimer()
    } else {
      // 倒计时已结束，清理存储
      localStorage.removeItem('verificationCodeEndTime')
    }
  }
}

// 清理定时器
const clearTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

// 开始倒计时定时器
const startCountdownTimer = () => {
  clearTimer() // 清理之前的定时器
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearTimer()
      canResend.value = true
      localStorage.removeItem('verificationCodeEndTime')
    }
  }, 1000)
}

// 组件挂载时恢复倒计时状态
onMounted(() => {
  restoreCountdownState()
})

// 组件卸载时清理定时器
onUnmounted(() => {
  clearTimer()
})

// 发送验证码
const sendVerificationCode = () => {
  if (!canResend.value) return

  // 验证邮箱格式
  if (!form.value.email || !form.value.email.includes('@')) {
    alert('请输入有效的邮箱地址')
    return
  }

  // TODO: 这里应该调用API发送验证码到邮箱
  console.log('发送验证码到:', form.value.email)

  // 开始60秒倒计时
  countdown.value = 60
  canResend.value = false

  // 保存倒计时结束时间到本地存储
  const endTime = Date.now() + 60 * 1000
  localStorage.setItem('verificationCodeEndTime', endTime.toString())

  // 开始倒计时
  startCountdownTimer()
}
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-900 flex flex-col justify-center items-center py-20 px-4 sm:px-6 lg:px-8 min-h-[80vh] transition-colors duration-300">

    <!-- 头部：标题与描述 -->
    <div class="w-full max-w-md text-center mb-8 select-none">
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

        <!-- 验证码输入框与重新发送按钮 -->
        <div>
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            验证码
          </label>
          <div class="flex gap-2">
            <div class="flex-1">
              <input
                v-model="form.verificationCode"
                type="text"
                placeholder="请输入验证码"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                maxlength="6"
              />
            </div>
            <div class="w-32 select-none">
              <button
                type="button"
                @click="sendVerificationCode"
                :disabled="!canResend"
                class="w-full h-full px-3 py-2 text-xs font-medium rounded-lg transition-colors whitespace-nowrap"
                :class="canResend ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'"
              >
                {{ countdown > 0 ? `${countdown}秒后重试` : '发送验证码' }}
              </button>
            </div>
          </div>
        </div>

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
        <div class="flex items-start pt-2 select-none">
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
        <div class="pt-2 select-none">
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
      <p class="mt-6 text-center text-sm text-gray-600 dark:text-gray-400 select-none">
        已有账号?
        <NuxtLink to="/login" class="font-medium text-blue-600 hover:text-blue-500 transition-colors">
          直接登录
        </NuxtLink>
      </p>

    </div>
  </div>
</template>
