<template>
  <div id="nav">
    <Mheader></Mheader>
    <Tab></Tab>
    <router-view :style="viewStyle"> </router-view>
  </div>
 <Player></Player> 
</template>

<script setup>
import Mheader from "@/components/header/index.vue";
import Tab from "@/components/tab/index.vue";
import Player from "@/components/player/index.vue";
import {useStore} from "vuex";
import { computed } from "vue";
const store = useStore()
const playlist = computed(()=>store.state.playlist)
const viewStyle=computed(()=>{
  return {
    bottom:playlist.value.length?"60px":0
  }
})
</script>
<style>
</style>
