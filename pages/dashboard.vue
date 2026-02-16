<script setup lang="ts">
import { ref, reactive, computed } from 'vue'

// 引入 Auth
const { user, refreshUser } = useAuth()
const config = useRuntimeConfig()

const isLoading = ref(false)
// 只需要文件对象，不需要额外的 Preview 字符串了，因为我们会立刻刷新
const avatarFile = ref<File | null>(null)
// 本地预览图（仅用于上传前的展示）
const localPreview = ref<string>('')

// 表单
const form = reactive({
  username: user.value?.username || '',
  bio: user.value?.bio || '',
})

// 计算头像：如果有本地预览用预览，否则用 user.avatar (useAuth 已经加了时间戳，这里直接用)
const displayAvatar = computed(() => {
  if (localPreview.value) return localPreview.value
  // 如果 user.avatar 存在，useAuth 已经保证它是最新的且带时间戳
  if (user.value?.avatar) return user.value.avatar
  // 兜底
  return `https://api.dicebear.com/7.x/initials/svg?seed=${user.value?.username || 'User'}`
})

// 选择文件
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    if (file.size > 2 * 1024 * 1024) {
      alert('图片大小不能超过 2MB')
      return
    }
    avatarFile.value = file
    // 生成临时预览
    localPreview.value = URL.createObjectURL(file)
  }
}

// 提交更新
const handleUpdate = async () => {
  if (!user.value?.userId) return
  isLoading.value = true

  try {
    const formData = new FormData()
    // 注意：确保后端接收的是字符串类型的 userId
    formData.append('userId', user.value.userId.toString())
    formData.append('username', form.username)
    formData.append('bio', form.bio)

    if (avatarFile.value) {
      formData.append('file', avatarFile.value)
    } else {
        // ⚠️ 你的后端强制检查 if (!(file instanceof File))
        // 在不改后端的情况下，如果用户没选图片，这里必须拦截，否则请求会报错
        alert("由于系统限制，修改资料时必须重新上传头像（或上传原图）。")
        isLoading.value = false
        return
    }

    const { error } = await useFetch('/user/update', {
      method: 'POST',
      baseURL: config.public.apiBase, // 确保这个 BaseURL 配置正确
      body: formData,
    })

    if (error.value) throw error.value

    alert('更新成功！')

    // 1. 释放本地预览内存
    if (localPreview.value) URL.revokeObjectURL(localPreview.value)
    localPreview.value = ''
    avatarFile.value = null

    // 2. 核心：调用我们在 useAuth 里增强过的 refreshUser
    // 这会重新请求 /verifyToken -> 拿到新数据 -> useAuth 加上新时间戳 -> Header 和 Dashboard 自动变
    await refreshUser()

  } catch (err: any) {
    console.error(err)
    alert('更新失败: ' + (err.message || '未知错误'))
  } finally {
    isLoading.value = false
  }
}

const formatDate = (dateStr?: string) => {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
    
    <!-- 顶部 Banner -->
    <div class="h-48 md:h-64 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-gray-800 dark:to-gray-900 border-b border-blue-100 dark:border-gray-800">
      <!-- 替换 AppContainer 为标准 div -->
      <div class="container mx-auto px-4 h-full flex items-center max-w-7xl">
        <div class="mb-8 md:mb-0">
          <h1 class="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white">个人中心</h1>
          <p class="mt-2 text-gray-600 dark:text-gray-400">管理你的档案与社团活动</p>
        </div>
      </div>
    </div>

    <!-- 主要内容 -->
    <!-- 替换 AppContainer -->
    <div class="container mx-auto px-4 -mt-16 md:-mt-24 relative z-10 pb-20 max-w-7xl">
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- 左侧：展示卡片 -->
        <div class="lg:col-span-1">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden sticky top-24">
            
            <div class="p-8 flex flex-col items-center border-b border-gray-100 dark:border-gray-700">
              <!-- 头像点击区域 -->
              <div class="relative group cursor-pointer" @click="$refs.fileInput.click()">
                <div class="w-32 h-32 rounded-full ring-4 ring-white dark:ring-gray-700 shadow-md overflow-hidden relative bg-gray-200">
                  <!-- 这里的 :src 会因为 avatarTimestamp 变化而重新加载 -->
                  <img :src="displayAvatar" alt="Avatar" class="w-full h-full object-cover group-hover:blur-sm transition-all duration-300">
                  
                  <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  </div>
                </div>
                <input ref="fileInput" type="file" accept="image/*" class="hidden" @change="handleFileChange">
                <div class="absolute bottom-1 right-1 bg-blue-600 text-white rounded-full p-1.5 border-2 border-white dark:border-gray-800">
                   <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                </div>
              </div>

              <h2 class="mt-4 text-xl font-bold text-gray-900 dark:text-white">{{ user?.username }}</h2>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ user?.email }}</p>
              <div class="mt-3">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200">
                  {{ user?.permissionLevel > 1 ? '管理员' : '成员' }}
                </span>
              </div>
            </div>

            <!-- 统计 -->
            <div class="px-6 py-4 space-y-3">
               <div class="flex justify-between text-sm"><span class="text-gray-500">加入时间</span><span class="text-gray-900 dark:text-white">{{ formatDate(user?.createdAt) }}</span></div>
               <div class="flex justify-between text-sm"><span class="text-gray-500">Bio</span><span class="text-gray-900 dark:text-white truncate max-w-[150px]">{{ user?.bio || '暂无' }}</span></div>
            </div>
            
            <div class="p-4 border-t border-gray-100 dark:border-gray-700">
                <button @click="logout" class="w-full py-2 px-4 border border-red-200 text-red-600 rounded-lg hover:bg-red-50">退出登录</button>
            </div>
          </div>
        </div>

        <!-- 右侧：编辑表单 -->
        <div class="lg:col-span-2 space-y-6">
          <div class="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
            <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-6">编辑资料</h3>
            
            <form @submit.prevent="handleUpdate" class="space-y-6">
              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">用户名</label>
                <input v-model="form.username" type="text" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">简介</label>
                <textarea v-model="form.bio" rows="4" class="w-full px-4 py-2 rounded-lg border border-gray-300 dark:bg-gray-700 dark:text-white dark:border-gray-600 focus:ring-2 focus:ring-blue-500 outline-none resize-none"></textarea>
              </div>

              <div class="flex justify-end gap-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                 <button type="submit" :disabled="isLoading" class="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50">
                   {{ isLoading ? '保存中...' : '保存更改' }}
                 </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  </div>
</template>