<template>
  <div class="recommend" v-loading="loading">
    <!-- scroll 插件 只能控制一个完整的组件 进行下滑  故需要将轮播图和歌单列表 组合起来-->
    <Scroll class="recommend-content">
      <div>
        
        <!-- 轮播图 -->
        <div class="slider-wrapper">
          <div class="slider-content">
            <!-- 这里注意 如果 没有v-if的话 会报错 因为slider必须有节点不然 会报错 而当数据没接收到的时候 就会报错 这时候就需要v-if了 -->
            <Slider v-if="sliders.length" :sliders="sliders"></Slider>
          </div>
        </div>

        <!-- 歌单列表 -->
        <div class="recommend-list">
          <h1 class="list-title">热门歌单推荐</h1>
          <ul>
            <li
              v-for="item in albums"
              class="item"
              :key="item.id"
              @click="selectItem(item)"
            >
              <div class="icon">
                <img
                  alt=""
                  width="60"
                  height="60"
                  v-img-lazy="item.coverImgUrl"
                />
              </div>
              <div class="text">
                <p class="name">{{ item.name }}</p>
                <p class="title">{{ item.description }}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>
    <router-view v-slot="{ Component }">
      <transition name="slide" appear>
        <component :is="Component" :detailObj="albumDetail" />
      </transition>
    </router-view>
  </div>
  
</template>

<script setup>
import {
  getRecommend,
  getRecommendAlbum,
} from "@/service/recommend.js";
import { onMounted, ref, computed } from "vue";
import Slider from "@/components/base/slider/index.vue";
import Scroll from "@/components/base/scroll";
import storage from "@/assets/js/storage-api";
import {useRouter} from "vue-router"
let sliders = ref([]);
let albums = ref([]);
const albumDetail = ref({});
const router = useRouter()
// 判定是否启用loading组件的条件值
const loading = computed(() => !sliders.value.length || !albums.value.length);
onMounted(async () => {
  let sliderArr = storage.getLocal("__sliders__", []);
  let albumsArr = storage.getLocal("__albums__", []);
  if (sliderArr.length && albumsArr.length) {
    sliders.value = sliderArr;
    albums.value = albumsArr;
  } else {
    //获取轮播图的数据
    const result = await getRecommend();
    sliders.value = result.banners;
    // 获取歌单数据
    const albumResult = await getRecommendAlbum();
    albums.value = albumResult.playlists;
    storage.setLocal("__sliders__", result.banners);
    storage.setLocal("__albums__", albumResult.playlists);
  }
});
 async function selectItem(item) {
  albumDetail.value = {
    picUrl: item.coverImgUrl,
    id: item.id,
    name: item.name,
  };
  storage.setLocal("__albumDetail__",albumDetail.value)
    router.push({
    path:`/recommend/${item.id}`,
  });
}

</script>

<style lang="scss" scope>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: scroll;
  .recommend-content {
    height: 100%;
    overflow: hidden;
    .slider-wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
      .slider-content {
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
      }
    }
    .recommend-list {
      .list-title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;

        .icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
        }
        .name {
          margin-bottom: 10px;
          color: $color-text-ll;
        }
        .title {
          @include no-wrap();
          color: $color-text-d;
        }
      }
    }
  }
}
</style>

