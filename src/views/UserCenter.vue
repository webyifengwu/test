<template>
  <div class="user-center">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>

    <div class="switches-wrapper">
        <Switches 
        :items="['我喜欢的','最近播放']" 
        v-model="currentIndex"
        ></Switches>
    </div>

    <div class="play-btn" v-if="currentList.length" @click="playAll">
      <i class="icon-play">
        <span class="text">顺序播放全部</span>
      </i>
    </div>

    <div class="list-wrapper">
      <!-- 喜欢 -->
      <Scroll class="list-scroll" v-if="currentIndex === 0" v-no-result="!favoriteList.length">
        <div class="list-inner">
          <SongList :songs="favoriteList" ></SongList>
        </div>
      </Scroll>
      <!-- 历史 -->
      <Scroll class="list-scroll" v-if="currentIndex === 1" v-no-result="!playHistory.length">
        <div class="list-inner">
          <SongList :songs="playHistory" ></SongList>
        </div>
      </Scroll>
    </div>
  </div>
</template>

<script setup>
import Scroll from "@/components/base/scroll";
import SongList from "@/components/base/songe-list";
import { computed,ref, watch } from "vue";
import  {useStore} from "vuex"
import {useRouter} from "vue-router"
import Switches from "@/components/base/switches"
const currentIndex = ref(0)
const store = useStore()
const router = useRouter()
const currentList = computed(()=>currentIndex.value === 0 ? favoriteList.value:playHistory.value)
const favoriteList = computed(()=>store.state.favoriteList)
const playHistory = computed(()=>store.state.playHistory)
function goBack() {
  router.go(-1)
}
function playAll(){
  store.dispatch("addAllPlay",currentList.value)
}
</script>



<style scoped lang="scss">
.user-center {
  position: fixed;
  top: 0;
  bottom: 0;
  z-index: 100;
  width: 100%;
  background: $color-background;
  .back {
    position: absolute;
    top: 0;
    left: 6px;
    z-index: 50;
    .icon-back {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }
  .switches-wrapper {
    margin: 10px 0 30px 0;
  }
  .play-btn {
    box-sizing: border-box;
    width: 135px;
    padding: 7px 0;
    margin: 0 auto;
    text-align: center;
    border: 1px solid $color-text-l;
    color: $color-text-l;
    border-radius: 100px;
    font-size: 0;
    .icon-play {
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      font-size: $font-size-medium-x;
    }
    .text {
      display: inline-block;
      vertical-align: middle;
      padding: 0 0 5px 5px;
      font-size: $font-size-small;
    }
  }
  .list-wrapper {
    position: absolute;
    top: 110px;
    bottom: 0;
    width: 100%;
    .list-scroll {
      height: 100%;
      overflow: hidden;
      .list-inner {
        padding: 20px 30px;
      }
    }
  }
}
</style>
