import { useStore } from "vuex"
import { computed, onMounted } from "vue"
import storage from "@/assets/js/storage-api"

export default function usePlayHistory() {
    const store = useStore()
    const playHistory = computed(() => store.state.playHistory)


    function savePlayHistory(song) {
        let list = playHistory.value.slice()
        let index = list.findIndex(item => item.id === song.id)
        if (index > -1) {//队列存在
            list.unshift(...list.splice(index, 1))
        } else {
            list.unshift(song)
        }
        list.length = Math.min(200,list.length)
        storage.setLocal('__playHistory__', list);
        store.commit('setPlayHistory', list);
    }
    onMounted(()=>{
        // 用上本地存储
        if(!playHistory.value.length){
            let result = storage.getLocal("__playHistory__",[])
            if(result.length){
                store.commit('setPlayHistory', result);
            }
        }
    })
    return {
        savePlayHistory
    }
}