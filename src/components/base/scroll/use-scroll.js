import BScroll from "@better-scroll/core";
// 产生滚动的 插件
import ObserveDOM from "@better-scroll/observe-dom"
// 使用插件
BScroll.use(ObserveDOM)

import { onMounted, ref,onUnmounted, onActivated, onDeactivated } from "vue";
export function useScroll(props,emit){
    const rootRef = ref(null)
    const scroll = ref(null)
    onMounted(()=>{
        scroll.value = new BScroll (rootRef.value,{
            observeDOM:true, //开启深度监听dom的插件
            ...props
        })
        if(props.probeType>0){
            scroll.value.on('scroll',(pos) =>{
                // 触发 父组件内的 scroll自定义事件
                emit('scroll',pos)
            })
        }
        
    })

    onUnmounted(() => {
        // 销毁 scroll
            scroll.value.destroy()
    })

    onActivated(()=>{
        scroll.value.enable()//恢复功能
        scroll.value.refresh()//刷新
    })

    onDeactivated(()=>{
        // 失去功能
        scroll.value.disable()
    })

return {
    rootRef,
    scroll,
}
}