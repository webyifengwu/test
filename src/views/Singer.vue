<template>
  <div class="singer" v-loading="!singerList.length">
    <Singer :singerData="singerList" :arrStr="arr" @select="getSinger"></Singer>
    <router-view v-slot="{ Component }">
      <transition name="slide" appear>
        <component :is="Component" :detailObj="singerDetail" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { getSingerList } from "@/service/singer.js";
import Singer from "@/components/singer";
import storage from "@/assets/js/storage-api.js";
import { useRouter } from "vue-router";
const singerDetail = ref({});
const router = useRouter();
let arr = [];
// 使用ref最好提前设置变量类型 数组
let singerList = ref([]);
arr.push("热");
for (let i = 65; i < 91; i++) {
  arr.push(String.fromCharCode(i));
}

onMounted(async () => {
  let dataArr = storage.getLocal("__singerList__", []);
  if (dataArr.length) {
    singerList.value = dataArr;
  } else {
    const result = await getSingerList(arr);
    singerList.value = result;
    storage.setLocal("__singerList__", result);
  }
});
function getSinger(item) {
  singerDetail.value = {
    picUrl: item.picUrl,
    id: item.id,
    name: item.name,
  };
  storage.setLocal("__singerDetail__", singerDetail.value);
  // 路由跳转
  router.push({
    path: `/singer/${item.id}`,
  });
}
</script>


// 这里必须设置css 让scroll的高小于子元素的高 这样才能有翻滚 
<style lang="scss" scoped>
.singer {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0px;
}
</style>