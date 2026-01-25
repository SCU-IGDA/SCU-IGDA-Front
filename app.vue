<!-- app.vue -->
<script setup lang="ts">
	const { fetchUser } = useAuth()
	// 每次页面加载/刷新时，尝试恢复登录
	onMounted(() => {
		fetchUser()
	})
</script>
<template>
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>