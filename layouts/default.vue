<!-- layouts/default.vue -->
<template>
  <div class="min-h-screen flex flex-col">
    <header class="bg-white shadow p-4">
      <nav class="container mx-auto flex justify-between">
        <h1 class="text-xl font-bold text-primary-600">SCU-IGDA</h1>
        <ul class="flex gap-4">
          <li><NuxtLink to="/" class="hover:text-primary-500">Home</NuxtLink></li>
          <li><NuxtLink to="/about" class="hover:text-primary-500">About</NuxtLink></li>
        </ul>
      </nav>
    </header>

    <main class="flex-grow container mx-auto p-4">
      <!-- 页面内容将渲染在这里 -->
      <slot />
    </main>

    <footer class="bg-gray-800 text-white p-4 text-center">
      <p>&copy; 2025 SCU IGDA</p>
    </footer>
  </div>
</template>
