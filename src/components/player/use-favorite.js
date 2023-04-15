import { useStore } from "vuex"
import { computed, onMounted } from "vue"
import storage from "@/assets/js/storage-api"


export default function useFavorite() {
    const store = useStore()
    const favoriteList = computed(() => store.state.favoriteList)
    const currentSong = computed(() => store.getters.currentSong)

    // const favoriteIcon = computed(() => {
    //     return isFavorite(currentSong.value) ? 'icon-favorite' : "icon-not-favorite"
    // })

    function getFavoriteIcon(song){
        return isFavorite(song) ? 'icon-favorite' : "icon-not-favorite"
    }
    function isFavorite(song) {
        return favoriteList.value.findIndex(item => item.id === song.id) > -1
    }
// 外部传入 song来判断
    function togglefavorite(song) {
        let list = favoriteList.value.slice()
        if (isFavorite(song)) {
            //本身是喜爱的 取消喜爱
            let index = list.findIndex(item => item.id === song.id)
            list.splice(index, 1)
        } else {
            list.unshift(song)
        }
        store.commit('setFavoriteList', list)
        storage.setLocal('__favoriteList__', list)
    }
    onMounted(() => {
        if (!favoriteList.value.length) {
            let list = storage.getLocal('__favoriteList__', [])
            if (list.length) {
                store.commit('setFavoriteList', list)
            }
        }
    })
    return {
        getFavoriteIcon,
        togglefavorite
    }
}