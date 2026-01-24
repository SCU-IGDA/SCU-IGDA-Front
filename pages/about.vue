<!-- pages/about.vue -->
<!-- 关于我们页面 -->

<script setup lang="ts">
// 页面元数据
useHead({
  title: '关于我们 - SCU IGDA',
  meta: [
    { name: 'description', content: '了解四川大学游戏开发与研究社的使命、价值观、组织结构与历史成就。' }
  ]
})

// 核心价值数据
const coreValues = [
  {
    icon: '🎮',
    title: '游戏开发',
    description: '专注于游戏开发全流程，从创意到发布，培养完整的游戏制作能力。'
  },
  {
    icon: '🤝',
    title: '社区协作',
    description: '建立开放、包容的开发者社区，促进跨学科合作与知识共享。'
  },
  {
    icon: '🚀',
    title: '技术创新',
    description: '探索前沿游戏技术，包括VR/AR、AI生成内容、云游戏等新兴领域。'
  },
  {
    icon: '🎓',
    title: '人才培养',
    description: '通过工作坊、导师制、项目实践等方式培养下一代游戏开发者。'
  }
]

// 组织结构数据
const organizationStructure = [
  {
    department: '技术部',
    description: '负责游戏引擎、编程、工具开发等技术方向',
    color: 'bg-blue-100 dark:bg-blue-900/30',
    textColor: 'text-blue-600 dark:text-blue-400'
  },
  {
    department: '美术部',
    description: '负责游戏美术、UI/UX设计、概念艺术等视觉方向',
    color: 'bg-purple-100 dark:bg-purple-900/30',
    textColor: 'text-purple-600 dark:text-purple-400'
  },
  {
    department: '策划部',
    description: '负责游戏设计、剧情创作、关卡设计等策划方向',
    color: 'bg-green-100 dark:bg-green-900/30',
    textColor: 'text-green-600 dark:text-green-400'
  },
  {
    department: '音效部',
    description: '负责游戏音效、音乐创作、音频技术等声音方向',
    color: 'bg-orange-100 dark:bg-orange-900/30',
    textColor: 'text-orange-600 dark:text-orange-400'
  },
  {
    department: '运营部',
    description: '负责社团运营、活动组织、对外合作等管理方向',
    color: 'bg-red-100 dark:bg-red-900/30',
    textColor: 'text-red-600 dark:text-red-400'
  }
]

// 历史成就数据
const achievements = [
  {
    year: '2025',
    title: '全国大学生游戏开发大赛一等奖',
    description: '作品《星海漫游》获得全国大学生游戏开发大赛创新奖'
  },
  {
    year: '2024',
    title: '与腾讯游戏学院建立合作',
    description: '成为腾讯游戏学院在西南地区的首个高校合作伙伴'
  },
  {
    year: '2023',
    title: '独立游戏《像素冒险》上线Steam',
    description: '社团首个商业化游戏作品，获得90%好评率'
  },
  {
    year: '2022',
    title: '社团成员突破200人',
    description: '成为四川大学规模最大的技术类社团之一'
  }
]

// 联系方式数据
const contactInfo = [
  {
    platform: '邮箱',
    value: 'scu.igda@example.com',
    icon: '📧',
    link: 'mailto:scu.igda@example.com'
  },
  {
    platform: 'GitHub',
    value: 'github.com/scu-igda',
    icon: '💻',
    link: 'https://github.com/scu-igda'
  },
  {
    platform: 'B站',
    value: 'SCU_IGDA官方',
    icon: '📺',
    link: 'https://space.bilibili.com/'
  },
  {
    platform: 'QQ群',
    value: '123456789',
    icon: '👥',
    link: 'https://qm.qq.com/'
  }
]
</script>

<template>
  <div class="bg-white dark:bg-gray-900 min-h-screen pb-20 transition-colors duration-300 select-none">
    <AppContainer>
      <!-- 页面标题 -->
      <div class="pt-12 pb-8 text-center">
        <h1 class="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
          关于我们
        </h1>
        <p class="text-gray-500 dark:text-gray-400 text-lg max-w-3xl mx-auto">
          四川大学游戏开发与研究社（SCU IGDA）致力于培养游戏开发人才、推动游戏技术创新、构建开放协作的开发者社区。
        </p>
      </div>

      <!-- 社团介绍 -->
      <section class="mt-12">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-6">
              我们的使命
            </h2>
            <div class="space-y-4 text-gray-600 dark:text-gray-400">
              <p>
                SCU IGDA 是四川大学首个专注于游戏开发与研究的学术技术类社团。我们致力于为对游戏开发感兴趣的同学提供一个学习、交流和实践的平台。
              </p>
              <p>
                社团以"技术驱动创意，协作成就卓越"为核心理念，通过定期举办技术分享、项目实践、Game Jam等活动，帮助成员掌握游戏开发全流程技能。
              </p>
              <p>
                我们与多家游戏公司建立了合作关系，为成员提供实习机会、技术指导和行业资源，助力成员在游戏行业的发展。
              </p>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div class="text-6xl mb-4 text-center">🎯</div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-4 text-center">
              社团数据
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">200+</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">活跃成员</div>
              </div>
              <div class="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div class="text-2xl font-bold text-green-600 dark:text-green-400">50+</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">完成项目</div>
              </div>
              <div class="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div class="text-2xl font-bold text-purple-600 dark:text-purple-400">12</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">技术工作坊/年</div>
              </div>
              <div class="text-center p-4 bg-white dark:bg-gray-800 rounded-lg">
                <div class="text-2xl font-bold text-orange-600 dark:text-orange-400">8</div>
                <div class="text-sm text-gray-500 dark:text-gray-400">合作企业</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 核心价值 -->
      <section class="mt-16">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            核心价值
          </h2>
          <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            我们坚持的四大核心价值，指引着社团的发展方向与成员成长
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            v-for="(value, index) in coreValues"
            :key="index"
            class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
          >
            <div class="text-4xl mb-4">{{ value.icon }}</div>
            <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-3">
              {{ value.title }}
            </h3>
            <p class="text-gray-600 dark:text-gray-400">
              {{ value.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- 组织结构 -->
      <section class="mt-16">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            组织结构
          </h2>
          <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            社团采用矩阵式组织结构，支持跨部门协作与专业深度发展
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="(dept, index) in organizationStructure"
            :key="index"
            class="rounded-xl p-6 border transition-all hover:-translate-y-1"
            :class="[dept.color, 'border-transparent']"
          >
            <div class="flex items-center gap-3 mb-4">
              <div class="w-12 h-12 rounded-full flex items-center justify-center" :class="dept.color">
                <span class="text-2xl" :class="dept.textColor">{{ dept.department.charAt(0) }}</span>
              </div>
              <h3 class="text-xl font-bold text-gray-900 dark:text-white">
                {{ dept.department }}
              </h3>
            </div>
            <p class="text-gray-600 dark:text-gray-400">
              {{ dept.description }}
            </p>
          </div>
        </div>
      </section>

      <!-- 历史成就 -->
      <section class="mt-16">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            历史成就（模拟数据）
          </h2>
          <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            自成立以来，社团在游戏开发、技术创新、人才培养等方面取得了显著成果
          </p>
        </div>

        <div class="relative">
          <!-- 时间线 -->
          <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-0.5 bg-gray-200 dark:bg-gray-700 hidden md:block"></div>

          <div class="space-y-8">
            <div
              v-for="(achievement, index) in achievements"
              :key="index"
              class="relative"
            >
              <div class="md:flex items-center" :class="index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'">
                <!-- 左侧内容 -->
                <div class="md:w-1/2" :class="index % 2 === 0 ? 'md:pr-12 md:text-right' : 'md:pl-12'">
                  <div class="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 shadow-sm">
                    <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {{ achievement.title }}
                    </h3>
                    <p class="text-gray-600 dark:text-gray-400">
                      {{ achievement.description }}
                    </p>
                  </div>
                </div>

                <!-- 时间点 -->
                <div class="hidden md:flex absolute left-1/2 transform -translate-x-1/2 w-12 h-12 items-center justify-center">
                  <div class="w-6 h-6 rounded-full bg-blue-600 border-4 border-white dark:border-gray-900"></div>
                </div>

                <!-- 年份 -->
                <div class="md:w-1/2 mt-4 md:mt-0" :class="index % 2 === 0 ? 'md:pl-12' : 'md:pr-12 md:text-right'">
                  <div class="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {{ achievement.year }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- 联系方式 -->
      <section class="mt-16">
        <div class="text-center mb-10">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            联系我们
          </h2>
          <p class="text-gray-500 dark:text-gray-400 max-w-2xl mx-auto">
            欢迎通过以下方式与我们取得联系，获取最新活动信息或咨询加入事宜
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <a
            v-for="(contact, index) in contactInfo"
            :key="index"
            :href="contact.link"
            target="_blank"
            class="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all hover:-translate-y-1 group"
          >
            <div class="flex items-center gap-4">
              <div class="text-3xl">{{ contact.icon }}</div>
              <div>
                <h3 class="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {{ contact.platform }}
                </h3>
                <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">
                  {{ contact.value }}
                </p>
              </div>
            </div>
          </a>
        </div>
      </section>

      <!-- 加入我们 CTA -->
      <section class="mt-16">
        <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-10 md:p-16 text-center border border-blue-100 dark:border-blue-800">
          <div class="max-w-2xl mx-auto space-y-6">
            <h2 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
              加入 SCU IGDA
            </h2>
            <p class="text-gray-600 dark:text-gray-300 text-lg">
              无论你是编程高手、美术达人、策划天才，还是对游戏开发充满热情的新手，我们都欢迎你的加入！
            </p>
            <div class="pt-4 flex flex-col sm:flex-row gap-4 justify-center">
              <BaseButton to="/register" variant="primary" size="lg">
                立即申请加入
              </BaseButton>
              <BaseButton to="/activities" variant="outline" size="lg">
                查看近期活动
              </BaseButton>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 pt-4">
              招新季：每年3月（春季）和9月（秋季） | 平时也接受申请
            </p>
          </div>
        </div>
      </section>
    </AppContainer>
  </div>
</template>

<style scoped>
/* 自定义动画 */
.hover-lift {
  transition: transform 0.2s ease;
}

.hover-lift:hover {
  transform: translateY(-4px);
}
</style>
