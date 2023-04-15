<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <!-- 标题 -->
    <h1 class="title">{{ listTitle }}</h1>
    <!-- 背景图片 -->
    <div class="bg-image" :style="bgImageStyle" ref="imageRef">
      <!-- 播放按钮 -->
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div class="play-btn" v-show="songs.length>0">
          <i class="icon-play"></i>
          <span class="text" @click="addAll">顺序播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <!-- 歌曲列表 -->
    <Scroll class="list" :probeType="3" :style = "scrollStyle" @scroll="onScroll">
      <div class="song-list-wrapper" v-loading="loading">
        <SongList :songs="songs" ></SongList>
      </div>
    </Scroll>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import Scroll from "@/components/base/scroll/index.vue";
import SongList from "@/components/base/songe-list/index.vue";
import {useRouter} from "vue-router"
import {useStore} from "vuex"
const store = useStore()
const router =useRouter()
const playlist = computed(()=>store.state.playlist)
function goBack() {
  router.go(-1)
}
const props = defineProps({
  songs: {
    type: Array,
    default: [],
  },
  picUrl: String,
  listTitle: String,
  loading : Boolean
});
const imageHeight = ref(0);//动态top
const imageRef =ref(null)
// 滚动歌曲列表时的背景图最大距离
const maxTranslateY = ref(0)
// 滚动值
const scrollY = ref(0)
// 背景图
const bgImageStyle = computed(() => {
    let height = "40%" // 设置初始值，当没触发滚动临界的情况
    let zIndex = 0;
    let scale = 1;
  if(scrollY.value>maxTranslateY.value){//触发滚动临界
   height = "40px"
   zIndex = 1;
  }
  if(scrollY.value<0){//下拉列表时背景图变换
  scale = 1+(-scrollY.value)/imageRef.value.clientHeight;
  }
  return {
    backgroundImage: `url(${props.picUrl})`,//背景图片
    height,
    zIndex,
    transform:`scale(${scale})`   
  };
});
// 滚动的歌单
const scrollStyle = computed(()=>{
  // scroll 的top值就是背景图的高度
  return {
    top:`${imageHeight.value}px`,
    bottom:playlist.value.length ? "60px":0
  }
})
// 全部播放的按钮
const playBtnStyle = computed(()=>{
  let display ="block"
  if(scrollY.value>maxTranslateY.value){
    display = 'none'
  }
  return {
    display
  }
})
const filterStyle = computed(()=>{
  let blur = 0; 
  if(scrollY.value>0){
    blur=Math.min(scrollY.value/25,10);
  }
  return {
    backdropFilter:`blur(${blur}px)`
  }
})
function onScroll(pos){
scrollY.value = -pos.y
}
function addAll(){
  store.dispatch('addAllPlay',props.songs)
}
// 动态 top
onMounted(()=>{
  imageHeight.value = imageRef.value.clientHeight;
  maxTranslateY.value = imageHeight.value - 40 ;

})
</script>

<style lang="scss" scoped>
.music-list {
  position: fixed;
  width: 100%;
  top: 0;
  bottom: 0;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 20;
    transform: translateZ(2px);
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .bg-image {
    position: relative;
    width: 100%;
    height: 40%;
    transform-origin: top;
    background-size: cover;
    .play-btn-wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .play-btn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
      }
      .icon-play {
        display: inline-block;
        vertical-align: middle;
        margin-right: 6px;
        font-size: $font-size-medium-x;
      }
      .text {
        display: inline-block;
        vertical-align: middle;
        font-size: $font-size-small;
      }
    }
    .filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .list {
    // 这里没有设置top是为了设置动态top
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    .song-list-wrapper {
      padding: 20px 30px;
      min-height: 350px;
      background: $color-background;
    }
  }
}
</style>