<!-- components/Base/Pagination.vue -->
<!-- 基础分页器 -->

<script setup lang="ts">
const props = defineProps<{
  page: number
  totalPages: number
}>()

const emit = defineEmits(['update:page'])

const updatePage = (newPage: number) => {
  if (newPage >= 1 && newPage <= props.totalPages) {
    emit('update:page', newPage)
  }
}
</script>

<template>
  <div v-if="totalPages > 1" class="flex items-center justify-center space-x-2 py-4">
    <!-- Previous Button -->
    <button
      @click="updatePage(page - 1)"
      :disabled="page === 1"
      class="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      <span class="sr-only">Previous</span>
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
      </svg>
    </button>

    <!-- Page Info (Simple Style) -->
    <span class="text-sm text-gray-700 font-medium">
      {{ page }} / {{ totalPages }}
    </span>

    <!-- Next Button -->
    <button
      @click="updatePage(page + 1)"
      :disabled="page === totalPages"
      class="p-2 rounded-md border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
    >
      <span class="sr-only">Next</span>
      <svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
      </svg>
    </button>
  </div>
</template>
