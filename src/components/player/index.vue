<template>
  <!-- 播放器 -->
  <div class="player" v-if="playlist.length">
    <!-- 大的播放器 -->
    <transition name="normal">
    <div class="normal-player" v-show="fullScreen">
      <div class="background">
        <img :src="currentSong.al.picUrl" />
      </div>
      <!-- 顶部 -->
      <div class="top">
        <div class="back" @click="changeFullScreen">
          <i class="icon-back"></i>
        </div>
        <h1 class="title">{{ currentSong.name }}</h1>
        <h2 class="subtitle">{{ handle(currentSong) }}</h2>
      </div>
      <!-- 中间部分 cd 和 歌词的区域-->
      <div
        class="middle"
        @touchstart="onMiddleTouchStart"
        @touchmove="onMiddleTouchMove"
        @touchend="onMiddleTouchEnd"
      >
        <!-- 左部为cd 背景部分 -->
        <div class="middle-l" :style="middleLStyle">
          <div class="cd-wrapper playing" :style="cdStyle">
            <div class="cd">
              <img class="image" :src="currentSong.al.picUrl" />
            </div>
          </div>
          <div class="playing-lyric-wrapper">
            <div class="playing-lyric">{{ playingLyric }}</div>
          </div>
        </div>
        <!-- 右部 为歌词 -->
        <Scroll class="middle-r" :style="middleRStyle" ref="lyricScrollRef">
          <div class="lyric">
            <div class="lyric-wrapper">
              <div ref="lyricRef">
                <p
                  class="text"
                  v-for="(item, index) in currentLyric"
                  :class="{ current: index === currentLineNum }"
                  :key="item.time"
                >
                  {{ item.content }}
                </p>
              </div>
            </div>
          </div>
        </Scroll>
      </div>
      <!-- 底部 -->
      <div class="bottom">
        <div class="dot-wrapper">
          <!-- 底部点点 -->
          <span class="dot" :class="{ active: currentShow === 'cd' }"></span>
          <span class="dot" :class="{ active: currentShow === 'lyric' }"></span>
        </div>
        <!-- 进度条 -->
        <div class="progress-wrapper">
          <span class="time time-l">{{ formatTime(currentTime) }}</span>
          <div class="progress-bar-wrapper">
            <ProgressBar
              :progress="progress"
              @progressChanged="onProgressChanged"
              @progressChanging="onProgressChanging"
            ></ProgressBar>
          </div>
          <span class="time time-r">{{ formatTime(duration) }}</span>
        </div>
        <!-- 按钮 -->
        <div class="operators">
          <div class="icon i-left">
            <i :class="modeIcon" @click="changeMode"></i>
          </div>
          <div class="icon i-left">
            <i class="icon-prev" @click="prev"></i>
          </div>
          <div class="icon i-center">
            <i :class="playIcon" @click="togglePlay"></i>
          </div>
          <div class="icon i-right">
            <i class="icon-next" @click="next"></i>
          </div>
          <div class="icon i-right">
            <i :class="getFavoriteIcon(currentSong)" @click="togglefavorite(currentSong)"></i>
          </div>
        </div>
      </div>
    </div>
    </transition>
  
    <MiniPlayer
      :handle="handle"
      :progress="progress"
      :cdStyle="cdStyle"
      :togglePlay="togglePlay"
    ></MiniPlayer>
  </div>
  <audio
    ref="audioRef"
    @timeupdate="updateTime"
    @canplay="ready"
    @ended="end"
  ></audio>
  <!-- 原生事件 @timeupdate 随着播放发生的函数 @canplay  当能播放音乐的时候启用 -->
</template>

<script setup>
import Scroll from "@/components/base/scroll";
import ProgressBar from "./components/progress-bar/index.vue";
import MiniPlayer from "./components/min-player";
import { computed, watch, ref } from "vue";
import { useStore } from "vuex";
import { getSongUrl } from "@/service/song.js";
import useMode from "./use-mode.js";
import useFavorite from "./use-favorite";
import { formatTime } from "@/assets/js/utils.js";
import useMiddle from "./use-middle";
import useLyric from "./use-lyric";
import usePlayHistory from "./use-play-history"
// cd界面的歌词
// 当前播放时时间
const currentTime = ref(0);
const duration = ref(0);
// vuex
const store = useStore();
// 全屏
const fullScreen = computed(() => store.state.fullScreen);
// 源播放列表
const playlist = computed(() => store.state.playlist);
// 当前播放列表
const sequenceList = computed(() => store.state.sequenceList);
// 当前下标
const currentIndex = computed(() => store.state.currentIndex);
// 当前歌曲
const currentSong = computed(() => store.getters.currentSong);
// 播放状态
const playing = computed(() => store.state.playing);
//播放模式
const playMode = computed(() => store.state.playMode);
// 播放按钮
const playIcon = computed(() => {
  return playing.value ? "icon-pause" : "icon-play";
});
// 圆圈图片 动画 样式
const cdStyle = computed(() => {
  return {
    animationPlayState: playing.value ? "running" : "paused",
  };
});
// 播放音乐的标签
const audioRef = ref(null);
let progressChanging = false;
// 播放进度 0 ~ 1
const progress = computed(() => {
  if (!audioRef.value) return;
  return currentTime.value / duration.value;
});

// hooks
const { modeIcon, changeMode } = useMode();
const { getFavoriteIcon, togglefavorite } = useFavorite();
const {
  onMiddleTouchStart,
  onMiddleTouchMove,
  onMiddleTouchEnd,
  middleLStyle,
  middleRStyle,
  currentShow,
} = useMiddle();
const {
  currentLyric,
  lyricScrollRef,
  lyricRef,
  currentLineNum,
  playLyric,
  stopLyric,
  playingLyric,
  directionValue,
} = useLyric(currentTime);

const {savePlayHistory} = usePlayHistory();
watch(currentSong, async (newSong) => {
  //空对象 始终为真 所以得对应属性
  if (!newSong.id) return;
  const { data } = await getSongUrl(newSong);
  let playlistValue = playlist.value.slice(); //复制一份 因为不能直接对其进行修改 会报错
  let sequenceListValue = sequenceList.value.slice();
  const url = data[0].url;
  if (!url) {
    //歌曲的url不存在
    //把这首歌 请求失败的歌 从 播放列表中移除 播放下一首
    let indexP = playlistValue.fineIndex((item) => {
      return item.id === newSong.id;
    });
    let indexS = sequenceListValue.fineIndex((item) => {
      return item.id === newSong.id;
    });
    playlistValue.splice(indexP, 1);
    sequenceListValue.splice(indexS, 1);
    // 将修改的 playlist 和 sequenceList 设置到 state中
    store.commit("setPlaylist", playlistValue);
    store.commit("setSequenceList", sequenceListValue);

    // 边界情况 当请求最后一首的是最后一首的情况
    store.commit(
      "setCurrentIndex",
      indexS >= sequenceListValue.length ? 0 : indexS
    );
    return;
  }
  // 获取audio的标签
  let audio = audioRef.value;
  audio.src = url;
  // 播放
  audio.play();
  store.commit("setPlayingState", true);
  savePlayHistory(newSong)//存储历史

});

watch(directionValue, (newDirection) => {
  if (newDirection === "vertical") {
    //  恢复上下滚动
    lyricScrollRef.value.scroll.enable();
  } else {
    // 约束 只能 水平移动
    lyricScrollRef.value.scroll.disable();
  }
});
function handle(item) {
  return item.ar
    .map((nameObj) => {
      return nameObj.name;
    })
    .join("/");
}
function togglePlay() {
  store.state.playing = !playing.value;
}

watch(playing, (newPlaying) => {
  let audio = audioRef.value;
  if (newPlaying) {
    // 播放
    audio.play();
    // 歌词运行前都需要确保是否有上一个定时器没有关闭
    stopLyric();
    playLyric();
  } else {
    // 暂停
    audio.pause();
    stopLyric();
  }
});
// 右切换
function next() {
  const list = sequenceList.value;
  // 没有歌
  if (!list.length) return;
  // 只有一首歌
  if (list.length === 1) return loop();
  let index = currentIndex.value + 1;
  if (index === list.length) {
    //超出最后一首
    index = 0;
  }
  store.commit("setCurrentIndex", index);
}
// 左切换
function prev() {
  const list = sequenceList.value;
  // 没有歌
  if (!list.length) return;
  // 只有一首歌
  if (list.length === 1) return loop();
  let index = currentIndex.value - 1;
  if (index === -1) {
    //超出第一首歌
    index = list.length - 1;
  }
  store.commit("setCurrentIndex", index);
}
// 单曲循环
function loop() {
  let audio = audioRef.value;
  // currentTime 当前播放时间 置于零
  audio.currentTime = 0;
  currentTime.value = 0;
  // 重新播放
  audio.play();
  store.commit("setPlayingState", true);

  stopLyric();
  playLyric();
}

function updateTime() {
  // 正在拖动 进度条的话 停止更新
  if (progressChanging) return;
  currentTime.value = audioRef.value.currentTime;
}

function ready() {
  duration.value = audioRef.value.duration;
}

function onProgressChanging(progress) {
  progressChanging = true;
  currentTime.value = progress * duration.value;
  stopLyric();
}
function onProgressChanged(progress) {
  progressChanging = false;
  // 播放时间对应的变量 这也需要设置 不然一些功能 会出现bug
  currentTime.value = progress * duration.value;
  // 时间播放时间
  audioRef.value.currentTime = progress * duration.value;
  //由于存在单击 跳转歌曲进度 的存在 故 需要 先清除 之前的 定时器
  stopLyric();
  playLyric(); //会重新计算 所以可以
  if (!playing.value) {
    store.commit("setPlayingState", true);
  }
}
// 结束一首歌后
function end() {
  if (playMode.value === 1) {
    //单曲循环
    loop();
  } else {
    next();
  }
}
function changeFullScreen() {
  store.commit("setFullScreen", false);
}
</script>

<style lang="scss" scoped>
.player {
  position: fixed;
  z-index: 100;
  top: 0;
  left: 0;
  .normal-player {
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      img {
        height: 100%;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .top {
      position: relative;
      margin-bottom: 25px;
      .back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .middle {
      position: fixed;
      width: 100%;
      top: 80px;
      bottom: 170px;
      white-space: nowrap;
      font-size: 0;
      .middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .cd-wrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          overflow: hidden;
          height: 100%;
          border-radius: 50%;
          border: 10px solid rgba(255, 255, 255, 0.1);
          &.playing {
            animation: rotate 20s linear infinite;
          }
          .cd {
            width: 100%;
            img {
              position: absolute;
              left: 50%;
              top: 50%;
              height: 100%;
              box-sizing: border-box;
              transform: translate(-50%, -50%);
            }
          }
        }
        .playing-lyric-wrapper {
          width: 80%;
          margin: 30px auto 0 auto;
          overflow: hidden;
          text-align: center;
          .playing-lyric {
            height: 20px;
            line-height: 20px;
            font-size: $font-size-medium;
            color: $color-text-l;
          }
        }
      }
      .middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .lyric-wrapper {
          width: 80%;
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .pure-music {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }
    .bottom {
      position: absolute;
      bottom: 50px;
      width: 100%;
      .dot-wrapper {
        text-align: center;
        font-size: 0;
        .dot {
          display: inline-block;
          vertical-align: middle;
          margin: 0 4px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: $color-text-l;
          &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-ll;
          }
        }
      }
      .progress-wrapper {
        display: flex;
        align-items: center;
        width: 80%;
        margin: 0px auto;
        padding: 10px 0;
        .time {
          color: $color-text;
          font-size: $font-size-small;
          flex: 0 0 40px;
          line-height: 30px;
          width: 40px;
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
        }
        .progress-bar-wrapper {
          flex: 1;
        }
      }
      .operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-theme;
        }
      }
    }
    &.normal-enter-active,
    &.normal-leave-active {
      transition: all 0.6s;
      .middle-l,
      .top,
      .bottom {
        transition: all 0.6s cubic-bezier(0.45, 0, 0.55, 1);
      }
    }
    &.normal-enter-from,
    &.normal-leave-to {
      opacity: 0;
      .top {
        transform: translate3d(0, -100px, 0);
      }
      .bottom {
        transform: translate3d(0, 100px, 0);
      }
      .middle-l {
        transform: scale(0);
      }
    }
  }
}
</style>
