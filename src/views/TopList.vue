<template>
  <div class="top-list" v-loading="loading">
    <Scroll class="top-list-content">
      <ul>
        <li
          class="item"
          v-for="item in topList"
          :key="item.id"
          @click="selectItem(item)"
        >
          <div class="icon">
            <img width="100" height="100" v-img-lazy="item.coverImgUrl" />
          </div>
          <div class="txt">
            <p class="top-name">{{ item.name }}</p>
            <p class="top-des">{{ item.description }}</p>
          </div>
        </li>
      </ul>
    </Scroll>
    <router-view v-slot="{ Component }">
      <transition name="slide" appear>
        <component :is="Component" :detailObj="topListDetail" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import Scroll from "@/components/base/scroll";
import { computed, onMounted, ref } from "vue";
import storage from "@/assets/js/storage-api.js";
import { getTopList } from "@/service/top-list";
import {useRouter} from "vue-router"
const router = useRouter()
const topList = ref([]);
const loading = ref(true)
const topListDetail = ref({});

function selectItem(item) {
  topListDetail.value = {
    picUrl: item.coverImgUrl,
    id: item.id,
    name: item.name,
  };
  storage.setLocal("__topListDetail__",topListDetail.value)
   router.push({
    path:`/toplist/${item.id}`,
  });
}

onMounted(async () => {
  const result = await getTopList();
  topList.value = result.list;
  loading.value = false
});
</script>


<style lang="scss" scoped>
.top-list {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .top-list-content {
    height: 100%;
    overflow: hidden;
    .item {
      display: flex;
      margin: 0 20px;
      padding-top: 20px;
      height: 100px;
      &:last-child {
        padding-bottom: 20px;
      }
      .icon {
        flex: 0 0 100px;
        width: 100px;
        height: 100px;
      }
      .txt {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 0 20px;
        height: 100px;
        overflow: hidden;
        background: $color-highlight-background;
        color: $color-text-l;

        .top-des {
          @include no-wrap();
          margin-top: 20px;
          font-size: $font-size-medium;
        }
      }
    }
  }
}
</style>
