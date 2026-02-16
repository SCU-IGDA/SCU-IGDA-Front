<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import BaseButton from '~/components/Base/Button.vue'
import BaseInput from '~/components/Base/Input.vue'
import BaseCard from '~/components/Base/Card.vue'
import AppContainer from '~/components/App/Container.vue'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'

// 1. 基础配置
const { user, isLoggedIn } = useAuth()
const config = useRuntimeConfig()
const colorMode = useColorMode()
const route = useRoute()
const router = useRouter()

const isEditMode = computed(() => !!route.params.id && route.params.id !== 'create')
const postId = route.params.id

// 表单数据
const form = ref({
  title: '',
  category: '',
  tags: [] as string[],
  coverUrl: '', // 回显用的旧图 URL
  content: '',
  summary: ''
})

// 文件相关
const coverFile = ref<File | null>(null) // 用户新选的文件
const localPreview = ref<string>('') 
const categories = ['程序', '美术', '策划', '音频', '杂谈', '资源', '公告']
const errors = ref({ title: '', category: '', content: '', cover: '' })

// 计算当前展示的图片 (优先显示本地新选的，其次显示网络旧图)
const displayCover = computed(() => {
  if (localPreview.value) return localPreview.value
  if (form.value.coverUrl) return form.value.coverUrl
  return ''
})

// 处理文件选择
const handleFileChange = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (input.files && input.files[0]) {
    const file = input.files[0]
    if (file.size > 5 * 1024 * 1024) {
      alert('图片大小不能超过 5MB')
      return
    }
    coverFile.value = file
    localPreview.value = URL.createObjectURL(file)
    errors.value.cover = ''
  }
}

// 验证逻辑
const validateForm = () => {
  let valid = true
  errors.value = { title: '', category: '', content: '', cover: '' }

  if (!form.value.title.trim()) errors.value.title = '标题不能为空', valid = false
  if (!form.value.category) errors.value.category = '请选择分类', valid = false
  if (!form.value.content.trim()) errors.value.content = '正文不能为空', valid = false

  // 封面验证逻辑分叉：
  // 1. 新建模式：必须有 coverFile
  // 2. 编辑模式：如果没有 coverFile (没换图)，则必须有 coverUrl (旧图)，否则报错
  if (!isEditMode.value && !coverFile.value) {
    errors.value.cover = '新建帖子必须上传封面图'
    valid = false
  } else if (isEditMode.value && !coverFile.value && !form.value.coverUrl) {
    errors.value.cover = '封面图缺失'
    valid = false
  }

  return valid
}

const submitting = ref(false)

const handleSubmit = async () => {
  if (!isLoggedIn.value) return alert('请先登录')
  if (!validateForm()) return window.scrollTo({ top: 0, behavior: 'smooth' })

  submitting.value = true
  
  try {
    const formData = new FormData()

    // --- 公共字段 ---
    formData.append('authorId', user.value?.userId.toString() || '0')
    formData.append('title', form.value.title)
    formData.append('category', form.value.category)
    formData.append('content', form.value.content)
    formData.append('summary', form.value.summary || form.value.content.slice(0, 100))

    // --- 分流逻辑 ---
    let endpoint = ''
    
    if (isEditMode.value) {
      // === 编辑模式 Logic (/editArticle) ===
      endpoint = '/article/editArticle' // 假设你的路由前缀是 /article
      
      formData.append('articleId', postId as string)
      // 注意：后端检查了 permissionLevel，这里必须传
      // 假设你的 user 对象里有 permissionLevel，或者你需要根据实际情况硬编码/获取
      formData.append('permissionLevel', user.value?.permissionLevel || 'user') 

      // 关键点：只有当用户真正选择了新文件时，才通过 formData 发送 file
      // 后端逻辑是：if (body.file) -> update cover; else -> keep old cover.
      if (coverFile.value) {
        formData.append('file', coverFile.value)
      }
      
    } else {
      // === 新建模式 Logic (/setArticle) ===
      endpoint = '/article/setArticle'
      formData.append('date', new Date().toISOString())
      
      // 新建模式必须传文件
      if (coverFile.value) {
        formData.append('file', coverFile.value)
      }
    }

    // 发送请求
    const { data, error } = await useFetch(endpoint, {
      method: 'POST',
      baseURL: config.public.apiBase,
      body: formData
    })

    if (error.value) throw error.value

    alert(isEditMode.value ? '更新成功！' : '发布成功！')
    
    // 清理资源并跳转
    if (localPreview.value) URL.revokeObjectURL(localPreview.value)
    router.push('/content')

  } catch (error: any) {
    console.error(error)
    const errorMsg = error.data?.message || error.message || '未知错误'
    
    // 特殊处理后端返回的 403 权限错误
    if (errorMsg === '无权修改') {
        alert('修改失败：您没有权限修改此文章（可能是由于非管理员身份限制）。')
    } else {
        alert(`操作失败: ${errorMsg}`)
    }
  } finally {
    submitting.value = false
  }
}

const handleCancel = () => {
  if (confirm('确定要取消吗？未保存的内容将会丢失。')) {
    router.back()
  }
}

// 加载编辑数据
if (isEditMode.value) {
  const { data: post } = await useFetch<any>(`/article/specific/${postId}`, {
    baseURL: config.public.apiBase,
    method: 'GET',
    server: false,
    lazy: true
  })

  watch(post, (data) => {
    if (data) {
      form.value = {
        title: data.title,
        category: data.category || '',
        tags: [],
        coverUrl: data.coverUrl || '',
        content: data.content || '',
        summary: data.summary || ''
      }
    }
  })
}
</script>

<template>
  <div class="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 transition-colors duration-300 select-none">
    <AppContainer>
      <div class="max-w-4xl mx-auto">
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 dark:text-white">
            {{ isEditMode ? '编辑帖子' : '发布新帖子' }}
          </h1>
          <p class="text-gray-500 dark:text-gray-400 mt-2">
            分享你的知识、经验或资源
          </p>
        </div>

        <div class="space-y-6">
          <!-- 标题 -->
          <BaseCard hover padding="p-6">
            <div class="space-y-4">
              <label class="block text-lg font-semibold text-gray-900 dark:text-white">
                标题 <span class="text-red-500">*</span>
              </label>
              <BaseInput 
                v-model="form.title" 
                placeholder="请输入帖子标题" 
                :error="errors.title"
                class="select-auto" 
              />
            </div>
          </BaseCard>

          <!-- 封面图 -->
          <BaseCard hover padding="p-6">
            <label class="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
              封面图 <span class="text-red-500">*</span>
            </label>
            
            <div class="flex flex-col md:flex-row gap-6">
              <!-- 预览图 -->
              <div 
                class="w-full md:w-64 h-36 rounded-lg bg-gray-100 dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center overflow-hidden relative"
                :class="{ 'border-red-500': errors.cover }"
              >
                <!-- 加载遮罩 -->
                <div v-if="isConvertingFile" class="absolute inset-0 bg-black/50 flex items-center justify-center z-10">
                  <span class="text-white text-sm">正在处理原图...</span>
                </div>
                
                <img v-if="displayCover" :src="displayCover" class="w-full h-full object-cover" />
                <div v-else class="text-center p-4">
                  <span class="text-gray-400 text-sm">暂无图片</span>
                </div>
              </div>

              <!-- 操作区 -->
              <div class="flex-1 space-y-3">
                <div class="relative">
                  <input 
                    type="file" 
                    accept="image/*"
                    @change="handleFileChange"
                    class="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-200 cursor-pointer"
                  />
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400 space-y-1">
                  <p>最大支持 5MB 的图片。</p>
                  <p v-if="isEditMode && form.value?.coverUrl" class="text-blue-600 dark:text-blue-400">
                     💡 提示：如果不选择新图片，系统将尝试自动使用当前封面。
                  </p>
                </div>
                <p v-if="errors.cover" class="text-red-600 text-sm font-medium">
                  {{ errors.cover }}
                </p>
              </div>
            </div>
          </BaseCard>

          <!-- 编辑器 -->
          <BaseCard hover padding="p-6">
            <label class="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
              正文内容 <span class="text-red-500">*</span>
            </label>
            <MdEditor 
              v-model="form.content" 
              :language="'zh-CN'"
              :theme="colorMode.value === 'dark' ? 'dark' : 'light'" 
              :toolbars="['bold', 'italic', 'title', 'quote', 'unorderedList', 'orderedList', 'code', 'link', 'image', 'table', 'preview', 'fullscreen']" 
              :preview="false" 
              class="min-h-[400px] select-auto" 
            />
            <p v-if="errors.content" class="text-sm text-red-600 mt-2">{{ errors.content }}</p>
          </BaseCard>

          <!-- 摘要 -->
          <BaseCard hover padding="p-6">
            <label class="block text-lg font-semibold text-gray-900 dark:text-white mb-3">摘要</label>
            <textarea 
              v-model="form.summary" 
              rows="3" 
              class="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white select-auto"
            ></textarea>
          </BaseCard>

          <!-- 分类 -->
          <BaseCard hover padding="p-6">
            <label class="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
              分类 <span class="text-red-500">*</span>
            </label>
            <div class="flex flex-wrap gap-2">
              <button 
                v-for="cat in categories" 
                :key="cat" 
                @click="form.category = cat"
                class="px-4 py-2 rounded-lg border text-sm font-medium select-auto"
                :class="form.category === cat ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'"
              >
                {{ cat }}
              </button>
            </div>
            <p v-if="errors.category" class="mt-2 text-sm text-red-600">{{ errors.category }}</p>
          </BaseCard>

          <!-- 底部按钮 -->
          <div class="flex justify-end gap-4 pt-6 pb-20">
            <BaseButton @click="handleCancel" variant="outline" size="lg">取消</BaseButton>
            <BaseButton 
              @click="handleSubmit" 
              variant="primary" 
              size="lg" 
              :loading="submitting"
            >
              {{ submitting ? (isConvertingFile ? '处理图片中...' : '发布中...') : (isEditMode ? '发布更新' : '发布帖子') }}
            </BaseButton>
          </div>
        </div>
      </div>
    </AppContainer>
  </div>
</template>

<style scoped>
:deep(.md-editor) {
  border-radius: 0.75rem;
  overflow: hidden;
  border: 1px solid #e5e7eb;
}
.dark :deep(.md-editor) {
  border-color: #4b5563;
}
</style>