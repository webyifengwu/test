import { ref, computed,onMounted,watch,nextTick} from 'vue'
export default function useFixed(props) {
    // 用于记录滚动的距离
    const scrollY = ref(0);
    // 需要监测的节点
    const groupRef = ref(null)
    // 记录 li高度区间的差值
    const listHeight = ref([])

    // 记录 滚动距离处于第几区间
    const currentIndex = ref(0)

    // 记录区间底部 和 滚动距离的差值
    const instance = ref(0)

    // 获取滚动距离
    const onScroll = (pos) => {
        // 正数
        scrollY.value = -pos.y;
    }

    // 顶部区间显示的文字
    const fixedTitle = computed(() => {
        // 解决“热”为顶部时拉下有两个顶部的情况
        if (scrollY.value < 0) {
            return ''
        }
        return props.singerData[currentIndex.value] ? props.singerData[currentIndex.value].tag : ''
    })

    // 顶部栏的移动效果
    const fixedStyle = computed(() => {
        let diff = 0;
        if (instance.value > 0 && instance.value < 30) {
            diff = instance.value - 30;
        }
        return {
            transform: `translate(0,${diff}px)`
        }
    })

    function calculate() {
        const list = groupRef.value.children
        // 取地址 进行修改
        const listHeightVal = listHeight.value
        // 高度初始值
        let height = 0
        // 重新获取时 要置空
        listHeightVal.length = 0
        listHeightVal.push(height)

        for (let i = 0; i < list.length; i++) {
            height += list[i].clientHeight
            listHeightVal.push(height)
        }

    }
    
    onMounted(() => {
        calculate()
    })

    watch(()=>props.singerData,async ()=>{
        await nextTick() // 等待页面节点更新完毕之后
        calculate()
    })

    watch(scrollY,(newVal)=>{
        
        const listHeightVal = listHeight.value
        for (let i = 0; i < listHeightVal.length-1; i++) {
            const tagTop  = listHeightVal[i]
            const tagBottom = listHeightVal[i+1]
            //标签互顶的效果的条件
            if(newVal >= tagTop && newVal < tagBottom){
                currentIndex.value = i
                instance.value = tagBottom - newVal
            }
            
            
        }
    }) 
    return {
        onScroll,
        groupRef,
        fixedTitle,
        fixedStyle,
        currentIndex
    }

}