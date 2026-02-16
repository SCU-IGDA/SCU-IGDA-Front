<script setup lang="ts">
	import { ref, computed } from 'vue'
	import { useRoute } from 'vue-router'
	import BaseButton from '~/components/Base/Button.vue'
	import BaseInput from '~/components/Base/Input.vue'
	import BaseCard from '~/components/Base/Card.vue'
	import AppContainer from '~/components/App/Container.vue'
	import { MdEditor } from 'md-editor-v3'
	import 'md-editor-v3/lib/style.css'
	import { useAuth } from '~/composables/useAuth'

	const colorMode = useColorMode()
	const { user, token } = useAuth() // 获取用户信息
	const config = useRuntimeConfig()
	const route = useRoute()
	const isEditMode = computed(() => !!route.params.id)

	const rawFile = ref<File | null>(null) // 用于存储用户选择的二进制文件
	const previewUrl = ref('') // 用于在界面上回显图片

	// 表单数据
	const form = ref({
		title: '',
		category: '',
		tags: [] as string[],
		cover: '',
		content: '',
		summary: ''
	})

	// 分类选项（与首页一致）
	const categories = ['程序', '美术', '策划', '音频', '杂谈', '资源', '公告']

	// 标签输入
	const tagInput = ref('')
	const addTag = () => {
		const tag = tagInput.value.trim()
		if (tag && !form.value.tags.includes(tag)) {
			form.value.tags.push(tag)
			tagInput.value = ''
		}
	}
	const removeTag = (index : number) => {
		form.value.tags.splice(index, 1)
	}

	// 表单验证错误
	const errors = ref({
		title: '',
		category: '',
		content: ''
	})

	// 验证表单
	const validateForm = () => {
		let valid = true
		errors.value = { title: '', category: '', content: '' }

		if (!form.value.title.trim()) {
			errors.value.title = '标题不能为空'
			valid = false
		} else if (form.value.title.length > 100) {
			errors.value.title = '标题长度不能超过100个字符'
			valid = false
		}

		if (!form.value.category) {
			errors.value.category = '请选择分类'
			valid = false
		}

		if (!form.value.content.trim()) {
			errors.value.content = '正文内容不能为空'
			valid = false
		}

		return valid
	}

  const handleUploadImg = async (files: Array<File>, callback: (urls: Array<string>) => void) => {
    // 假设后端有一个图片上传接口 /upload/image
    // 如果没有，暂时演示返回本地 blob URL
    // TODO: 替换为真实的上传逻辑
    const res = await Promise.all(
      files.map((file) => {
        return new Promise<string>((resolve, reject) => {
          // 这里应该调用上传 API
          // const formData = new FormData()
          // formData.append('file', file)
          // $fetch('/upload/image', { method: 'POST', body: formData }).then(url => resolve(url))

          // 临时方案：转 Base64 (避免 Blob URL 刷新失效)
          const reader = new FileReader()
          reader.readAsDataURL(file)
          reader.onload = () => resolve(reader.result as string)
          reader.onerror = (error) => reject(error)
        })
      })
    )
    callback(res)
  }

  // 处理文件选择
  const handleFileChange = (event : Event) => {
		const input = event.target as HTMLInputElement
		if (input.files && input.files[0]) {
			const file = input.files[0]
			// 限制文件大小（例如 5MB）
			if (file.size > 5 * 1024 * 1024) {
				alert('图片大小不能超过 5MB')
				return
			}
			rawFile.value = file
			// 生成本地预览 URL，让用户能看到选了什么图
			previewUrl.value = URL.createObjectURL(file)
			// 清除原来的 URL 输入（如果有的话），避免歧义
			form.value.cover = ''
		}
	}

	// 发布/保存
	const submitting = ref(false)
	const handleSubmit = async () => {
		if (!validateForm()) return
		console.log(user.value)
		if (!user.value || !user.value.userId) { // 校验登录情况
			alert('请先登录')
			return
		}
		if (!rawFile.value && !isEditMode.value) { // 校验封面是否上传
			alert('请上传封面图片')
			return
		}
		submitting.value = true
		try {
			// 构建 FormData
			const formData = new FormData()
			// 对应后端：authorId (Number)
			formData.append('authorId', user.value.userId.toString())
			// 对应后端：title, summary, content, category
			formData.append('title', form.value.title)
			formData.append('summary', form.value.summary || form.value.content.slice(0, 100)) // 如果没摘要，截取正文
			formData.append('content', form.value.content)
			formData.append('category', form.value.category)
			formData.append('date', new Date().toISOString()) // 对应后端 date


			// 对应后端：file (必须是 File 对象)
			if (rawFile.value) {
				formData.append('file', rawFile.value)
			}
			// 注意：后端目前没有接收 tags 字段，如果你需要存 tags，
			// 可能需要修改后端数据库和接口，或者暂时把 tags 拼接到 summary 或 category 里。
			// 这里暂时忽略 tags 的提交，或者你可以 stringify 后传给备用字段。

			// 发送请求
			// 注意：不要手动设置 'Content-Type': 'multipart/form-data'
			// fetch 会自动根据 formData 设置 boundary，手动设置反而会报错
			const response = await $fetch(`/article/setArticle`, {
				method: 'POST',
				body: formData,
				baseURL:config.public.apiBase,
				headers: {
					// 如果需要 token鉴权，可以在这里加
					// Authorization: `Bearer ${token.value}`
				}
			})
			console.log('发布成功:', response)
			alert(isEditMode.value ? '帖子已更新' : '帖子已发布成功！')
			navigateTo('/content') // 或者是你的文章列表页路径
		} catch (error : any) {
			console.error('发布失败:', error)
			const msg = error.data?.message || '发布失败，请稍后重试'
			alert(msg)
		} finally {
			submitting.value = false
		}
	}

	// 取消
	const handleCancel = () => {
		if (confirm('确定要取消吗？未保存的内容将会丢失。')) {
			navigateTo('/content')
		}
	}

	// 模拟加载编辑数据（如果是编辑模式）
	if (isEditMode.value) {
		// 这里可以调用API获取帖子数据
		// 模拟数据
		setTimeout(() => {
			form.value = {
				title: 'Unity Shader 入门精要：从渲染管线到光照模型',
				category: '程序',
				tags: ['Unity', 'Shader', '渲染'],
				cover: 'https://images.unsplash.com/photo-1616499370260-485b3e5ed653?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600&q=80',
				content: '## 这是示例内容\n\n你可以在这里编辑你的帖子。',
				summary: '本文介绍Unity Shader的基础知识，适合初学者。'
			}
		}, 300)
	}
</script>

<template>
	<div class="bg-gray-50 dark:bg-gray-900 min-h-screen py-8 transition-colors duration-300 select-none">
		<AppContainer>
			<div class="max-w-4xl mx-auto">
				<!-- 页面标题 -->
				<div class="mb-8">
					<h1 class="text-3xl font-bold text-gray-900 dark:text-white">
						{{ isEditMode ? '编辑帖子' : '发布新帖子' }}
					</h1>
					<p class="text-gray-500 dark:text-gray-400 mt-2">
						分享你的知识、经验或资源，让更多人受益
					</p>
				</div>

				<!-- 表单区域 -->
				<div class="space-y-6">
					<!-- 标题 -->
					<BaseCard hover padding="p-6">
						<div class="space-y-4">
							<label class="block text-lg font-semibold text-gray-900 dark:text-white">
								标题
							</label>
							<BaseInput v-model="form.title" placeholder="请输入帖子标题，建议简洁明了" :error="errors.title"
								class="select-auto" />
							<div class="flex justify-between items-center">
								<p class="text-sm text-gray-500 dark:text-gray-400">
									好的标题能吸引更多读者，建议包含关键词
								</p>
								<span class="text-xs text-gray-400">
									{{ form.title.length }}/100
								</span>
							</div>
						</div>
					</BaseCard>

					<!-- 封面图部分 -->
					<BaseCard hover padding="p-6">
					  <label class="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
					    封面图（必填）
					  </label>
					  <div class="flex items-center gap-4">
					    <!-- 预览区域 -->
					    <div
					      v-if="previewUrl || form.cover"
					      class="w-48 aspect-video rounded-lg overflow-hidden border border-gray-300 dark:border-gray-600 relative group"
					    >
					      <!-- 优先显示本地预览，其次显示编辑模式下的原有URL -->
					      <img
					        :src="previewUrl || form.cover"
					        class="w-full h-full object-cover"
					        alt="封面"
					      />
					    </div>

					    <!-- 上传控件区域 -->
					    <div class="flex-1">
					      <!-- 隐藏原生 file input，用样式美化或者直接显示 -->
					      <input
					        type="file"
					        accept="image/png, image/jpeg, image/webp"
					        @change="handleFileChange"
					        class="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
					      />

					      <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">
					        建议尺寸 16:9 (如 1920x1080)，支持 JPG、PNG、WebP 格式。
					      </p>
					    </div>
					  </div>
					</BaseCard>

					<!-- Markdown 编辑器 -->
					<BaseCard hover padding="p-6">
						<label class="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
							正文内容
						</label>
						<MdEditor v-model="form.content" :language="'zh-CN'"
							:theme="colorMode.value === 'dark' ? 'dark' : 'light'" :toolbars="[
                'bold', 'italic', 'strikeThrough', 'underline', 'title', 'sub', 'sup',
                'quote', 'unorderedList', 'orderedList', 'task', 'codeRow', 'code',
                'link', 'image', 'table', 'mermaid', 'katex', 'revoke', 'next',
                'save', 'preview', 'pageFullscreen', 'fullscreen'
              ]" :preview="false" class="min-h-[400px] select-auto"
              @onUploadImg="handleUploadImg" />
						<div class="flex justify-between items-center mt-3">
							<p class="text-sm text-gray-500 dark:text-gray-400">
								支持 Markdown 语法，可使用工具栏快速格式化
							</p>
							<p v-if="errors.content" class="text-sm text-red-600">
								{{ errors.content }}
							</p>
						</div>
					</BaseCard>

					<!-- 摘要 -->
					<BaseCard hover padding="p-6">
						<label class="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
							摘要（可选）
						</label>
						<textarea v-model="form.summary" rows="3" placeholder="请输入帖子摘要，用于在列表页展示"
							class="w-full border border-gray-300 dark:border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none bg-white dark:bg-gray-800 text-gray-900 dark:text-white select-auto"></textarea>
					</BaseCard>

					<!-- 分类与标签 -->
					<BaseCard hover padding="p-6">
						<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
							<!-- 分类 -->
							<div>
								<label class="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
									分类
								</label>
								<div class="flex flex-wrap gap-2">
									<button v-for="cat in categories" :key="cat" @click="form.category = cat"
										class="px-4 py-2 rounded-lg border transition-colors text-sm font-medium select-auto"
										:class="form.category === cat
                      ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-blue-300'">
										{{ cat }}
									</button>
								</div>
								<p v-if="errors.category" class="mt-2 text-sm text-red-600">
									{{ errors.category }}
								</p>
							</div>

							<!-- 标签 -->
							<div>
								<label class="block text-lg font-semibold text-gray-900 dark:text-white mb-3">
									标签
								</label>
								<div class="flex gap-2 mb-3">
									<BaseInput v-model="tagInput" placeholder="输入标签后按回车" @keyup.enter="addTag"
										class="select-auto" />
									<BaseButton @click="addTag" variant="outline" size="md">
										添加
									</BaseButton>
								</div>
								<div class="flex flex-wrap gap-2">
									<div v-for="(tag, index) in form.tags" :key="tag"
										class="inline-flex items-center gap-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm select-auto">
										{{ tag }}
										<button @click="removeTag(index)"
											class="text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 select-auto">
											×
										</button>
									</div>
									<p v-if="form.tags.length === 0" class="text-gray-400 text-sm">
										暂无标签，添加标签有助于帖子被搜索到
									</p>
								</div>
							</div>
						</div>
					</BaseCard>

					<!-- 操作按钮 -->
					<div class="flex justify-end gap-4 pt-6">
						<BaseButton @click="handleCancel" variant="outline" size="lg">
							取消
						</BaseButton>
						<BaseButton @click="handleSubmit" variant="primary" size="lg" :loading="submitting">
							{{ isEditMode ? '更新帖子' : '发布帖子' }}
						</BaseButton>
					</div>
				</div>
			</div>
		</AppContainer>
	</div>
</template>

<style scoped>
	/* 自定义编辑器样式 */
	:deep(.md-editor) {
		border-radius: 0.75rem;
		overflow: hidden;
		border: 1px solid #e5e7eb;
	}

	.dark :deep(.md-editor) {
		border-color: #4b5563;
	}

	/* 暗色主题下编辑器内部元素 */
	:deep(.md-editor-dark) {
		--md-color: #e5e7eb;
		--md-hover-color: #f3f4f6;
		--md-bk-color: #1f2937;
		--md-bk-color-outstand: #111827;
		--md-bk-hover-color: #374151;
		--md-border-color: #4b5563;
		--md-border-hover-color: #6b7280;
	}
</style>
