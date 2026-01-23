<!-- components/App/Footer.vue -->
<!-- 全局页脚 -->

<template>
  <footer class="bg-gray-900 text-gray-300 border-t border-gray-800">
    <AppContainer>
      <div class="py-12 grid grid-cols-1 md:grid-cols-3 gap-8">

        <!-- Column 1: Organization Info -->
        <div class="space-y-4">
          <h3 class="text-white text-lg font-bold">SCU IGDA</h3>
          <p class="text-sm text-gray-400 leading-relaxed">
            四川大学游戏开发与研究社<br>
            致力于为校内游戏爱好者提供一个<br>
            交流、学习与创作的平台。
          </p>
        </div>

        <!-- Column 2: Quick Links -->
        <div>
          <h4 class="text-white font-semibold mb-4">快速导航</h4>
          <ul class="space-y-2 text-sm">
            <li><NuxtLink to="/" class="hover:text-white transition">首页</NuxtLink></li>
            <li><NuxtLink to="/content" class="hover:text-white transition">内容库</NuxtLink></li>
            <li><NuxtLink to="/activities" class="hover:text-white transition">社团活动</NuxtLink></li>
            <li><NuxtLink to="/about" class="hover:text-white transition">关于我们</NuxtLink></li>
          </ul>
        </div>

        <!-- Column 3: Connect -->
        <div>
          <h4 class="text-white font-semibold mb-4">关注我们</h4>
          <ul class="space-y-2 text-sm">
            <li><a href="#" class="hover:text-white transition">Bilibili 官方账号</a></li>
            <li><a href="#" class="hover:text-white transition">加入 QQ 群</a></li>
            <li><a href="#" class="hover:text-white transition">联系邮箱</a></li>
          </ul>
        </div>

      </div>

      <!-- Copyright -->
      <div class="border-t border-gray-800 py-6 text-center text-xs text-gray-500">
        &copy; {{ new Date().getFullYear() }} SCU IGDA. All rights reserved.
      </div>
    </AppContainer>
  </footer>
</template>
