import { ref } from "vue"
export default function useMiddle(){

    // 展示的页面
    const currentShow  = ref('cd')
    // cd style 切换opacity 的程度
    const middleLStyle = ref(null)
    // lyric 歌词 style 切换 translate
    const middleRStyle = ref(null)
    const touch={}
    const directionValue = ref('')
    let currentView='cd';//中间量
    // 手指触摸
    function onMiddleTouchStart(e) {
        // 获取 x的坐标
        touch.x1 = e.touches[0].pageX
        touch.y1 = e.touches[0].pageY
        touch.directionLocked = ''//控制偏移方向的字符
    }
    // 手指移动
    function onMiddleTouchMove(e) {
        // 获取偏移量
        const deltaX = e.touches[0].pageX - touch.x1 
        const absDeltaX = Math.abs(deltaX) 
        const absDeltaY = Math.abs(e.touches[0].pageY - touch.y1)
        if(!touch.directionLocked){
            // 第一次进来
            touch.directionLocked = absDeltaX >= absDeltaY ? 'horizontal':'vertical'
        }
        if(touch.directionLocked === 'vertical'){//垂直
            directionValue.value = 'vertical'
            return;
        }

            directionValue.value = 'horizontal'
        
        // 计算一下 百分比 手指移动量 / 屏幕宽度
        touch.percent = absDeltaX / window.innerWidth
        // 判断现在的页面 接着判断触摸是否有效
        if(currentView === 'cd'){//操作界面是cd界面 delta为负数才有效
                if(deltaX < 0){//有效
                    touch.left = deltaX
                    currentShow.value = touch.percent>0.2?'lyric':'cd';
                    middleLStyle.value={
                        opacity:1 - touch.percent
                    }
                    middleRStyle.value={
                        transform:`translate(${touch.left}px,0)`
                    }
                }
        }else{//操作界面是歌词界面
            if(deltaX >0 ){
                touch.left =  deltaX - window.innerWidth 
                // 数值从 -window.innerWidth 慢慢变大 也就是慢慢想右 慢慢变回来（本来就是负值）
                currentShow.value = touch.percent>0.2?'cd':'lyric';
                middleLStyle.value ={
                    opacity: touch.percent
                }
                middleRStyle.value={
                    transform:`translate(${touch.left}px,0)`

                }
            }
        }
    }
    // 手指松开
    function onMiddleTouchEnd() {
        if(currentShow.value === 'cd'){// 结果是 cd 界面
            currentView = 'cd'
            middleLStyle.value = {
                opacity : 1,
                transition: 'opacity 0.3s'
            }
            middleRStyle.value = {
                transform:`translate(0,0)`,
                transition:`transform 0.3s`
            }
        }else{//结果是 歌词界面
            currentView = 'lyric'
            middleLStyle.value = {
                opacity:0,
                transition:'opacity 0.3s'
            }
            middleRStyle.value ={
                transform:`translate(${-window.innerWidth}px,0)`,
                transition:`transform 0.3s`
            }
        }
    }

    return {
        onMiddleTouchStart,
        onMiddleTouchMove,
        onMiddleTouchEnd,
        middleLStyle,
        middleRStyle,
        currentShow,
        directionValue
    }
}