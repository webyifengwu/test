<template>
  <Scroll class="singer-list" @scroll="onScroll" :probeType="3" ref="scrollRef">

    <ul class="view-scroll" ref="groupRef">
      <li class="group" v-for="group in singerData" :key="group.id">
        <h2 class="title">{{ group.tag }}</h2>
        <ul>
          <li class="item" v-for="item in group.nameArr" :key="item.id" @click="selectItem(item)">
            <div class="avatar">
              <img v-img-lazy="item.picUrl" alt="" />
            </div>
            <span>{{ item.name }}</span>
          </li>
        </ul>
      </li>
    </ul>

    <!-- 使用 v-show  在fixedTitle为空的时候 置位不显示-->
    <div class="fixed" v-show="fixedTitle" :style="fixedStyle">
        <div class="fixed-title">{{fixedTitle}}</div>
    </div>

    <!-- 快捷访问栏 字母栏 -->
    <div class="shortcut">
      <ul>
        <li v-for="(item,index) in arrStr" :key="index" class="item" :class="{current:currentIndex === index}" :data-index = "index" @touchstart.prevent.stop ="onShoutcutTouchStart" @touchmove.prevent.stop = "onShoutcutTouchMove">
          {{item}}
        </li>
      </ul>
    </div>
    
  </Scroll>
</template>

<script setup>
import Scroll from "@/components/base/scroll"
import useFixed from "./use-fixed"
import useShoutCut from "./use-shoutcut"
const emits = defineEmits(['select'])
//歌手数据数据拿到了 准备排版
const props = defineProps(["singerData",'arrStr']);
// 顶部栏功能
const {onScroll,groupRef,fixedTitle,fixedStyle,currentIndex}=useFixed(props);
// 快捷字母栏功能
const {scrollRef,onShoutcutTouchStart,onShoutcutTouchMove} = useShoutCut(groupRef)

function selectItem(item) {
  emits("select",item)
}
</script>


<style lang="scss" scoped>
.singer-list {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: $color-background;
  .group {
    padding-bottom: 30px;
    .title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
    .item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .avatar {
        position: relative;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        overflow: hidden;
        img {
          position: absolute;
          width: 130%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }
      }
      .name {
        margin-left: 20px;
        color: $color-text-l;
        font-size: $font-size-medium;
      }
    }
  }
  .fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .fixed-title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }
   .shortcut {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;
    .item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
      &.current {
        // 高亮 当前区间的 字母高亮
        color: $color-theme;
      }
    }
  }
}
</style>