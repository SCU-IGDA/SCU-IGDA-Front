// composables/useToast.ts
// 通用提示功能（Toast通知）

export interface ToastOptions {
    message: string
    type?: 'success' | 'error' | 'warning' | 'info'
    duration?: number
    position?: 'top-center' | 'top-right' | 'top-left' | 'bottom-center' | 'bottom-right' | 'bottom-left'
}

export interface Toast {
    id: number
    message: string
    type: 'success' | 'error' | 'warning' | 'info'
    duration: number
    position: 'top-center' | 'top-right' | 'top-left' | 'bottom-center' | 'bottom-right' | 'bottom-left'
}

export const useToast = () => {
    // 使用useState确保全局状态共享
    const toasts = useState<Toast[]>('toasts', () => [])
    let toastId = useState<number>('toastId', () => 0)

    // 显示提示
    const showToast = (options: ToastOptions) => {
        const id = ++toastId.value
        const toast: Toast = {
            id,
            message: options.message,
            type: options.type || 'info',
            duration: options.duration || 3000,
            position: options.position || 'top-center'
        }

        toasts.value.push(toast)

        // 自动移除
        if (toast.duration > 0) {
            setTimeout(() => {
                removeToast(id)
            }, toast.duration)
        }

        return id
    }

    // 移除提示
    const removeToast = (id: number) => {
        const index = toasts.value.findIndex(toast => toast.id === id)
        if (index !== -1) {
            toasts.value.splice(index, 1)
        }
    }

    // 快捷方法
    const success = (message: string, duration?: number) => {
        return showToast({ message, type: 'success', duration })
    }

    const error = (message: string, duration?: number) => {
        return showToast({ message, type: 'error', duration })
    }

    const warning = (message: string, duration?: number) => {
        return showToast({ message, type: 'warning', duration })
    }

    const info = (message: string, duration?: number) => {
        return showToast({ message, type: 'info', duration })
    }

    // 清除所有提示
    const clearAll = () => {
        toasts.value = []
    }

    return {
        toasts,
        showToast,
        removeToast,
        success,
        error,
        warning,
        info,
        clearAll
    }
}
