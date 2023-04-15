import { getLyric } from "@/service/song.js"
import { watch, computed, ref } from "vue"
import { useStore } from "vuex"
import { formatLyric } from "@/assets/js/utils"
export default function useLyric(currentTime) {
    const store = useStore()
    const currentSong = computed(() => store.getters.currentSong);
    const currentLyric = ref([])
    const lyricScrollRef = ref(null)
    const lyricRef = ref(null)
    const playingLyric = ref('')
    // 当前歌曲播放对应的歌词的第几列
    const currentLineNum = ref(0)
    // 定时器
    let timer = null;

    watch(currentSong, async (newSong) => {
        // 当歌曲发生变化的时候 进行请求歌词
        if (!newSong.id) return
        const { lrc: { lyric } } = await getLyric(newSong)
        currentLyric.value = formatLyric(lyric)
        // 新的一首歌 播放歌词
        currentLineNum.value = 0
        currentTime.value = 0
        stopLyric()
        playLyric()
    })
    // 歌词停止的函数
    function stopLyric() {
        clearTimeout(timer)
    }
    // 歌词运行函数
    function playLyric() {
        const currentLyricValue = currentLyric.value
        if (currentLyricValue.length) {//空数组也为真 故为取它的长度
            // 计算当前的行数
            countIndex()
            // 开启 歌词滚动 运动函数
            startRun()
        }
    }
    watch(currentLineNum, (newNum) => {
        // 动画效果
        run(newNum)
    })
    function run(newNum) {
        // 滚动组件
        const lyricScrollRefValue = lyricScrollRef.value
        const lyricRefValue = lyricRef.value
        if(!lyricRefValue)return
        if (newNum > 9) {
            // 产生滚动效果 当前歌词的 前第五个进行移动  1个位
            const targetEl = lyricRefValue.children[newNum - 9]
            lyricScrollRefValue.scroll.scrollToElement(targetEl, 1000)//（滚动的元素，滚动的延迟时间）
        } else {
            // index 小于 9
            lyricScrollRefValue.scroll.scrollTo(0, 0, 1000)
        }
    }
    // 正式运行歌词
    function startRun() {
        const currentLyricValue = currentLyric.value
        let index = currentLineNum.value //获取当前的行数
        // 计算 下一句歌词触发运行的定时器 的延迟时间 1 歌词 time - currentTime     
        if (index === currentLyricValue.length - 1) {
            return
        }
        let delay = currentLyricValue[index + 1].time - currentTime.value
        timer = setTimeout(() => {
            currentLineNum.value = Math.min(++currentLineNum.value, currentLyricValue.length - 1)
            // 需要继续进行
            playingLyric.value = currentLyricValue[currentLineNum.value].content
            startRun()
        }, delay * 1000)
    }
    function countIndex() {
        // 计算当前播放的序列数
        let currentLyricValue = currentLyric.value;
        let currentTimeValue = currentTime.value;
        let index = 0;
        for (let i = 0; i < currentLyricValue.length; i++) {
            // 边界情况 当 i 到达右边界的时候 因为没有 length项 
            if (currentLyricValue[i].time <= currentTimeValue && currentLyricValue[i + 1].time ? currentTimeValue[i + 1] > currentTimeValue : true) {
                index = i;
                break;
            }

        }
        currentLineNum.value = index
        playingLyric.value = currentLyricValue[index].content
    }
    return {
        currentLyric,
        lyricScrollRef,
        lyricRef,
        currentLineNum,
        playLyric,
        stopLyric,
        playingLyric
    }
}