import { ref } from "vue";

export default function useShoutCut(groupRef){
    const scrollRef = ref(null)
    const touch = {}

    // 触摸字母快捷栏的函数
    function onShoutcutTouchStart(e) {
        console.log( e.target.dataset);
        const anchorIndex = e.target.dataset.index/1;
        // 设置初始滑动位置
        touch.y1=e.touches[0].pageY;
        touch.anchorIndex = anchorIndex;
        scrollTo(anchorIndex)
    }

    // 触摸的移动字母快捷栏的函数
    function onShoutcutTouchMove(e) {
            // 通过触摸移动改变的滑动位置
            touch.y2 = e.touches[0].pageY;
            // 偏移的index
            const deltaIndex = Math.floor((touch.y2 - touch.y1)/18);
            // 实际跳转到的 index
            const anchorIndex = touch.anchorIndex + deltaIndex;
            scrollTo(anchorIndex)
    }

    // 执行跳转的函数
    function scrollTo(index) {
        index = Math.max(0,Math.min(index,groupRef.value.children.length))
        const targetE = groupRef.value.children[index]
        const scroll = scrollRef.value.scroll
        scroll.scrollToElement(targetE)
    }

    return {
        scrollRef,
        onShoutcutTouchStart,
        onShoutcutTouchMove,
    }
}