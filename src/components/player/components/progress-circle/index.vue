<template>
  <div class="progress-circle">
    <!--
         画布 svg 实际呈现的大小 width height 决定
        viewBox 0 x起点 0y 起点 100 100 视口的宽高
     -->
    <svg
      :width="radius"
      :height="radius"
      viewBox="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!--  
     -->
      <circle
        class="progress-background"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
      />
      <!-- cy cx 为圆心的位置  fill 为 transparent 填充 -->
      <circle
        class="progress-bar"
        r="50"
        cx="50"
        cy="50"
        fill="transparent"
        :stroke-dasharray="dashArray"
        :stroke-dashoffset="dashOffset"
      />
      <!-- dasharray  虚线的偏移值 -->
    </svg>
    <slot></slot>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  radius: {
    type: Number,
    default: 100,
  },
  progress: {
    type: Number,
    default: 0,
  },
});
// 周长
const dashArray = Math.PI * 2 * 50;
const dashOffset = computed(() => (1 - props.progress) * dashArray);
</script>


<style lang="scss" scoped>
.progress-circle {
  position: relative;
  circle {
    stroke-width: 8px;
    transform-origin: center;
    &.progress-background {
      transform: scale(0.9);
      stroke: $color-sub-theme;
      // stroke: yellow;
    }
    &.progress-bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: $color-theme;
      // stroke: red;
    }
  }
}
</style>
