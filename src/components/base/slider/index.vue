
<template>
  <div class="slider" ref="rootRef">
    <!-- 图片区 -->
    <div class="slider-group">
      <div class="slider-page" v-for="item in sliders" :key="item.targetId">
        <a :href="item.url">
          <img :src="item.pic"  />
        </a>
      </div>
    </div>
    <!-- 这是中间点 -->
    <div class="dots-wrapper">
      <span
        class="dot"
        v-for="(item,index) in sliders"
        :key="item.targetId"
        :class="{active : index === currentIndex}"
      >
      </span>
    </div>
    
  </div>
</template>

<script setup>
import {ref} from 'vue'
import { useSlider } from './useSlide.js'
 const props=defineProps({//recommend组件传来的数据
  sliders:{
    type:Array,
    require:true,
  }
 })


const { rootRef ,currentIndex }=useSlider();

</script>


<style lang="scss" scoped>
.slider {
  min-height: 1px;
  font-size: 0;
  touch-action: pan-y;
  position: relative;
  //图片位置的样式
  .slider-group {
    position: relative;
    overflow: hidden;
    white-space: nowrap;
    .slider-page {
      display: inline-block;
      transform: translate3d(0,0,0);
      backface-visibility: hidden;
      a{
        display: block;
        width: 100%;
      }
      img{
        display: block;
        width: 100%;
      }
    }
  }
  //中间点的样式
  .dots-wrapper{
    position: absolute;
    left: 50%;
    bottom: 12px;
    line-height: 12px;
    transform: translateX(-50%);
    .dot{
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      transform: translateZ(1px);
      border-radius: 50%;
      background: $color-text-l;
      &.active{
        width: 20px;
        border-radius: 5px;
        background: $color-text-ll;
      }
    }
  }

}
</style>
