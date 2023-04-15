import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import {onMounted,onUnmounted,onActivated,ref, onDeactivated} from 'vue'
BScroll.use(Slide)

export function useSlider(){//需要挂载的 dom
    //slider 对象
    const slider =ref(null)
    const rootRef = ref(null)
    const currentIndex=ref(0)

    onMounted(()=>{
        slider.value=new BScroll(rootRef.value,{
            // 功能
            slide:true,//使用上slide插件
            click:true,//允许点击
            scrollX:true,//支持横向滚动
            scrollY:false,//关闭纵向滚动
            momentum:false,//不跟据滑动距离 和时间  计算生成滑动动画 
            bounce:false,//关闭回弹
            probeType:2,//派发scroll事件的频率 紧紧当手指按在滚动区域上。一直派发scrool事件
        })
        
        //页面发生页码变化的时候 会触发这个事件
        slider.value.on('slideWillChange',(page)=>{
         currentIndex.value = page.pageX
         })
    })
       // 销毁时
       onUnmounted(()=>{
        slider.value.destroy()
    })
    // 激活时
    onActivated(()=>{
        slider.value.enable()//恢复功能
        slider.value.refreash()//刷新一下
    })
    // 失活时
    onDeactivated(()=>{
        slider.value.disable()//让功能失效
    })

    return {
        rootRef,
        currentIndex
    }

}
