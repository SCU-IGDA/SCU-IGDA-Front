<!-- components/Post/Body.vue -->
<!-- 帖子内容 -->

<script setup lang="ts">
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
import { computed } from 'vue'

const props = defineProps<{
  content: string // Markdown 字符串
}>()

const colorMode = useColorMode()

// 解码 HTML 实体，防止被转义导致 Markdown 语法失效
const unescapedContent = computed(() => {
  if (!props.content) return ''
  return props.content
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
})
</script>

<template>
  <div class="post-body">
    <MdPreview
      :modelValue="unescapedContent"
      :theme="colorMode.value === 'dark' ? 'dark' : 'light'"
      class="!bg-transparent"
    />
  </div>
</template>

<style scoped>
:deep(.md-editor-preview-wrapper) {
  padding: 0;
}

/* 增强样式，对齐 Tailwind Typography */
:deep(.md-editor-preview) {
  font-family: inherit;
  color: inherit;
  font-size: 1rem;
  line-height: 1.75;
}

/* 标题样式 */
:deep(.md-editor-preview h1),
:deep(.md-editor-preview h2),
:deep(.md-editor-preview h3),
:deep(.md-editor-preview h4) {
  color: inherit;
  font-weight: 700;
  margin-top: 2em;
  margin-bottom: 1em;
  line-height: 1.3;
}

:deep(.md-editor-preview h1) { font-size: 2.25em; }
:deep(.md-editor-preview h2) { font-size: 1.5em; border-bottom: 1px solid #e5e7eb; padding-bottom: 0.3em; }
.dark :deep(.md-editor-preview h2) { border-color: #374151; }
:deep(.md-editor-preview h3) { font-size: 1.25em; }
:deep(.md-editor-preview h4) { font-size: 1.125em; }

:deep(.md-editor-preview p) {
  margin-bottom: 1.25em;
}

/* 代码块 & 行内代码 */
:deep(.md-editor-preview pre) {
  border-radius: 0.5rem;
  margin-top: 1.5em;
  margin-bottom: 1.5em;
}

:deep(.md-editor-preview code) {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size: 0.875em;
}

:deep(.md-editor-preview :not(pre) > code) {
  background-color: #f3f4f6;
  color: #111827;
  padding: 0.2em 0.4em;
  border-radius: 0.25rem;
  font-weight: 600;
}
.dark :deep(.md-editor-preview :not(pre) > code) {
  background-color: #374151;
  color: #e5e7eb;
}

:deep(.md-editor-preview img) {
  border-radius: 0.75rem; /* rounded-xl */
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1); /* shadow-md */
  margin-left: auto;
  margin-right: auto;
  max-width: 100%;
}

:deep(.md-editor-preview a) {
  color: #2563eb; /* text-blue-600 */
  text-decoration: none;
}

:deep(.md-editor-preview a:hover) {
  color: #3b82f6; /* text-blue-500 */
  text-decoration: underline;
}

/* 优化列表间距 */
:deep(.md-editor-preview ul),
:deep(.md-editor-preview ol) {
  padding-left: 1.5em;
  list-style-position: outside;
}

:deep(.md-editor-preview ul) {
  list-style-type: disc;
}

:deep(.md-editor-preview ol) {
  list-style-type: decimal;
}

/* 嵌套列表样式 */
:deep(.md-editor-preview ul ul),
:deep(.md-editor-preview ol ul) {
  list-style-type: circle;
}

:deep(.md-editor-preview ol ol),
:deep(.md-editor-preview ul ol) {
  list-style-type: lower-alpha;
}

/* 优化引用样式 */
:deep(.md-editor-preview blockquote) {
  border-left-color: #e5e7eb; /* gray-200 */
  background-color: #f9fafb; /* gray-50 */
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
}
.dark :deep(.md-editor-preview blockquote) {
  border-left-color: #374151; /* gray-700 */
  background-color: #1f2937; /* gray-800 */
}
</style>
