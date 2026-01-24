// 全局公告内容
export const useAnnouncement = () => {
    const announcement = ref({
        title: '📢 社团公告',
        content: '2026年春季招新正在进行中！请有意向加入IGDA的同学点击上方"发布帖子"提交作品集链接。'
    })

    return {
        announcement
    }
}
