<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>

<script setup>
import {useScroll} from "./use-scroll.js"
const props =defineProps({
    probeType:{
        type:Number,
        default:1
    },
    // 因为scroll默认关闭点击事件 所以要开启
    click:{
      type:Boolean,
      default:true
    }
})
const emit = defineEmits(['scroll'])
//  挂载到dom
const {rootRef,scroll} = useScroll(props,emit);
// 暴露给父组件使用
defineExpose({
  scroll
});
</script>


<style scoped></style>
