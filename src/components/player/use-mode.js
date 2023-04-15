import {computed} from "vue"
import {useStore} from "vuex"

export default function useMode(){
const store = useStore();
const playMode = computed(()=>store.state.playMode)

const modeIcon = computed(()=>{
    const playModeVal = playMode.value
    if(playMode.value === 0){//顺序
        return 'icon-sequence'
    }else if(playMode.value === 1){//单曲
        return 'icon-loop'
    }else{//随机
        return 'icon-random'
    }
})

// 补充模式文本

const modeText = computed(()=>{
    const playModeVal = playMode.value
    if(playMode.value === 0){//顺序
        return '顺序模式'
    }else if(playMode.value === 1){//单曲
        return '单曲循环'
    }else{//随机
        return '随机播放'
    }
})
function changeMode(){
    store.dispatch("changeMode",(playMode.value+1)%3)
}


return {
    modeIcon,
    changeMode,
    modeText
}
}