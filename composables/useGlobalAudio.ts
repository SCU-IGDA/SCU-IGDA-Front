// composables/useGlobalAudio.ts
// 全局音频控制器

import { ref } from 'vue'

// 使用全局状态，保证切换页面时音乐不会断，状态保持一致
const isMuted = ref(true) // 默认关闭音频（遵守浏览器自动播放策略）
const bgmVolume = ref(0.4) // 背景音乐音量

// 保存 Audio 实例
let bgmAudio: HTMLAudioElement | null = null

// 渐变配置
const FADE_DURATION = 800 // 渐变时长（毫秒）
const FADE_STEPS = 20 // 渐变步数
const FADE_INTERVAL = FADE_DURATION / FADE_STEPS // 每步间隔

export const useGlobalAudio = () => {

    // 初始化音频 (仅在客户端运行)
    const initAudio = () => {
        if (process.server) return

        if (!bgmAudio) {
            bgmAudio = new Audio('/audio/bgm/bgm-1.mp3')
            bgmAudio.loop = true // 循环播放
            bgmAudio.volume = bgmVolume.value
        }
    }

    // 音量渐变函数
    const fadeVolume = (targetVolume: number, duration: number = FADE_DURATION) => {
        if (!bgmAudio || process.server) return Promise.resolve()

        return new Promise<void>((resolve) => {
            const startVolume = bgmAudio!.volume
            const volumeDiff = targetVolume - startVolume
            const steps = Math.max(1, Math.floor(duration / FADE_INTERVAL))
            const stepSize = volumeDiff / steps
            let currentStep = 0

            const fadeInterval = setInterval(() => {
                currentStep++
                const newVolume = startVolume + (stepSize * currentStep)

                // 确保音量在 0-1 范围内
                bgmAudio!.volume = Math.max(0, Math.min(1, newVolume))

                if (currentStep >= steps) {
                    bgmAudio!.volume = targetVolume // 确保最终音量精确
                    clearInterval(fadeInterval)
                    resolve()
                }
            }, FADE_INTERVAL)
        })
    }

    // 切换静音/播放（带渐入渐出效果）
    const toggleMute = async () => {
        initAudio() // 确保已初始化

        isMuted.value = !isMuted.value

        if (!isMuted.value) {
            // 开启声音：先设置音量为0，然后播放并渐入
            if (bgmAudio) {
                bgmAudio.volume = 0
                try {
                    await bgmAudio.play()
                    // 渐入到目标音量
                    await fadeVolume(bgmVolume.value)
                } catch (e) {
                    console.warn('Autoplay prevented:', e)
                }
            }
        } else {
            // 静音：先渐出到0，然后暂停
            if (bgmAudio) {
                await fadeVolume(0)
                bgmAudio.pause()
            }
        }
    }

    // 直接设置音量（带渐变效果）
    const setVolume = async (volume: number) => {
        if (volume < 0 || volume > 1) {
            console.warn('Volume must be between 0 and 1')
            return
        }

        bgmVolume.value = volume

        if (bgmAudio && !isMuted.value) {
            // 如果当前正在播放，渐变到新音量
            await fadeVolume(volume)
        } else if (bgmAudio) {
            // 如果静音中，只更新目标音量但不实际改变音频音量
            bgmAudio.volume = volume
        }
    }

    // 淡入播放（从静音状态渐变播放）
    const fadeIn = async () => {
        if (isMuted.value && bgmAudio) {
            isMuted.value = false
            initAudio()

            // 先设置音量为0，然后播放并渐入
            bgmAudio.volume = 0
            try {
                await bgmAudio.play()
                // 渐入到目标音量
                await fadeVolume(bgmVolume.value)
            } catch (e) {
                console.warn('Autoplay prevented:', e)
            }
        }
    }

    // 淡出暂停（渐变到静音）
    const fadeOut = async () => {
        if (!isMuted.value && bgmAudio) {
            // 先渐出到0，然后暂停
            await fadeVolume(0)
            bgmAudio.pause()
            isMuted.value = true
        }
    }

    return {
        isMuted,
        bgmVolume,
        toggleMute,
        initAudio,
        setVolume,
        fadeIn,
        fadeOut
    }
}
