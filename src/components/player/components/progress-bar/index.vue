<template>
  <div class="progress-bar">
 <!-- 播放背景条  计算总的长度 -->
    <div class="bar-inner" ref="progressWrapperRef"    @click="onClick">
        <!-- 实际播放进度条 -->
    <div class="progress" :style="progressStyle" ref="progressRef"></div>
   <!-- 播放条的按钮 -->
    <div 
    class="progress-btn-wrapper"
    ref="progressBarRef"
    :style="btnStyle"
    @touchstart.prevent="onTouchStart"
    @touchmove.prevent="onTouchMove"
    @touchend.prevent="onTouchEnd"
 
    >
        <div class="progress-btn" ></div>
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref ,onMounted,computed,watch } from "vue";

// 播放时间 /总时间 === 当前的progress width / 总的progress 的 width

const props = defineProps({
  progress:{//进度的百分比
    type:Number,
    default:0,
  },
}) ;
const emit=defineEmits(["progressChanging","progressChanged"])

// width  偏移量最大范围
let maxNum = ref(0)
// 播放背景条
const progressWrapperRef = ref(null)
// 实际播放进度条
const progressRef = ref(null)
// 播放进度条按钮
const progressBarRef = ref(null)
const btnWidth = 16;
// 记录偏移量
const offset = ref(0)
// touch事件的位置信息
const touch = {};

watch(()=>props.progress,(newProgress)=>{
  offset.value = newProgress * maxNum.value
})
// 实际进度条 css
const progressStyle =computed(()=>`width:${offset.value}px;`)
// 进度条按钮 css
const btnStyle =computed(()=>` transform:translate(${offset.value}px,0);`);

// 手指滑下
function onTouchStart(e){
touch.x1 =e.touches[0].pageX;
// 播放条初始宽度
touch.beginWidth = progressRef.value.clientWidth;//记录 当前播放条的初始宽度

}

// 手指 滑动
function onTouchMove(e){
  // 计算和初始位置的差值 是手指 移动触发宽度变化触发 progress 的变化
  const delta =e.touches[0].pageX-touch.x1;
  // 计算现在移动后的偏移量
  const tempWidth = touch.beginWidth + delta;
  // 限制范围 在 0 ~ maxNum 之间
  offset.value = Math.max(0,Math.min(tempWidth,maxNum.value));
  // 限制 progress 的范围在0~1之间
  const progress =offset.value/maxNum.value;
  // 传给player 进行currentTime 的 计算
  emit("progressChanging",progress);

}
// 手指离开
function onTouchEnd(e){
  // 得到最终的进度值
  const progress  = offset.value/maxNum.value
  // 传给 player 进行 currentTime 的计算
  emit("progressChanged",progress)
}

function onClick(e){
  const offsetWidth = Math.min(e.offsetX,maxNum.value)
  const progress = offsetWidth /maxNum.value;
  emit("progressChanged",progress);
}

onMounted(()=>{
  // 获取进度条左部的 宽度的最大值
  maxNum.value = progressWrapperRef.value.clientWidth - btnWidth
})
</script>

<style lang="scss" scoped>
.progress-bar {
  height: 30px;
  .bar-inner {
    position: relative;
    top: 13px;
    height: 4px;
    background: rgba(0, 0, 0, 0.3);
    .progress {
      position: absolute;
      height: 100%;
      background: $color-theme;
    }
    .progress-btn-wrapper {
      position: absolute;
      left: -8px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn {
        position: relative;
        top: 7px;
        left: 7px;
        box-sizing: border-box;
        width: 16px;
        height: 16px;
        border: 3px solid $color-text;
        border-radius: 50%;
        background: $color-theme;
      }
    }
  }
}
</style>
