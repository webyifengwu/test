<template>
  <div class="search">
    <div class="search-input">
      <i class="icon-search"></i>
      <input class="input-inner" v-model="query" :placeholder="placeholder" />
      <i class="icon-dismiss" v-show="query" @click="clearQuery"></i>
    </div>
    <div class="hot-keys">
      <h1 class="title">热门搜索</h1>
      <ul>
        <li
          @click="addQuery(item.first)"
          v-for="item in hotArr"
          class="item"
          :key="item"
        >
          <span>{{ item.first }}</span>
        </li>
      </ul>
    </div>

    <div class="search-result" v-show="query.trim()">
      <Scroll class="result-wrapper" ref="scrollRef">
        <ul>
          <li
            v-for="(item, index) in resultList"
            :key="index"
            @click="selectItem(item)"
          >
            <div class="content">
              <h2 class="name">{{ item.name }}</h2>
              <p class="desc">{{ handle(item) }}</p>
            </div>
          </li>
        </ul>
      </Scroll>
    </div>
  </div>
</template>

<script setup>
import {
  getDefaultKeys,
  getHotKeys,
  getSearchResult,
  getSearchDetail,
} from "@/service/search.js";
import { onMounted, ref, watch } from "vue";
import Scroll from "@/components/base/scroll";
import { useStore } from "vuex";

const placeholder = ref("");
const hotArr = ref([]);
const query = ref("");
const resultList = ref([]);
const scrollRef = ref(null);
const store = useStore();

watch(query, async (newquery) => {
  if (!newquery.trim()) return;
  const searchResult = await getSearchResult(newquery);
  resultList.value = searchResult.result.songs;
  scrollRef.value.scroll.scrollTo(0, 0);
});

onMounted(async () => {
  let defaultKey = await getDefaultKeys();
  placeholder.value = defaultKey.data.showKeyword;
  let hotKey = await getHotKeys();
  hotArr.value = hotKey.result.hots;
});

function addQuery(newQuery) {
  query.value = newQuery;
}

function handle(item) {
  return item.artists.map((singer) => singer.name).join(" & ");
}

function clearQuery() {
  query.value = "";
}

async function selectItem(item) {
  const result = await getSearchDetail(item);
  store.dispatch("addOnePlay", result.songs);
}
</script>



<style lang="scss" scoped>
.search-input {
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  padding: 0 6px;
  height: 32px;
  background: $color-highlight-background;
  border-radius: 6px;
  .icon-search {
    font-size: 24px;
    color: $color-text-d;
  }
  .input-inner {
    flex: 1;
    margin: 0 5px;
    line-height: 18px;
    background: $color-highlight-background;
    color: $color-text;
    font-size: $font-size-medium;
    outline: 0;
    &::placeholder {
      color: $color-text-d;
    }
  }
  .icon-dismiss {
    font-size: 16px;
    color: $color-text-d;
  }
}
.search {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  display: flex;
  box-sizing: border-box;
  flex-direction: column;
  padding: 0 20px;

  .hot-keys {
    margin-top: 25px;
    .title {
      margin-bottom: 20px;
      font-size: $font-size-medium;
      color: $color-text-ll;
    }
    .item {
      display: inline-block;
      padding: 5px 10px;
      margin: 0 20px 10px 0;
      border-radius: 6px;
      background: $color-highlight-background;
      font-size: $font-size-medium;
      color: $color-text-l;
    }
  }
  .result-wrapper {
    position: absolute;
    // bottom: 60px;
    bottom: 0;
    top: 10px;
    width: 100%;
    overflow: hidden;
  }
  .search-result {
    position: absolute;
    top: 30px;
    bottom: 0;
    color: $color-text-l;
    background-color: $color-background;
    width: calc(100% - 40px);
    li {
      padding: 5px 30px;
      height: 35px;
      font-size: $font-size-medium;
      @include no-wrap();
       .content {
      flex: 1;
      line-height: 20px;
      overflow: hidden;
      .name {
        @include no-wrap();
        color: $color-text-ll;
      }
      .desc {
        @include no-wrap();
        margin-top: 4px;
        color: $color-text-d;
      }
    }
    }
  }
}
</style>