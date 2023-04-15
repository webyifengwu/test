<template>
  <div class="tab">
 <router-link class="tab-item" v-for="item in tabs" :key="item.path" :to="item.path">
    <span class="tab-link"> {{item.name}}</span>
 </router-link>
  </div>
</template>

<script setup>
const tabs=[
    {
       name:"推荐",
       path:'/recommend' 
    },
    {
       name:"歌手",
       path:'/singer' 
    },
    {
       name:"排行",
       path:'/toplist' 
    },
    {
       name:"搜索",
       path:'/search' 
    },
]
</script>


<style lang="scss" scoped>

.tab{
    display: flex;
    height: 33px;
    line-height: 44px;
    font-size: $font-size-medium;
    margin-bottom: 10px;
    // border-bottom: 1px solid pink;
    
    .tab-item{
        flex: 1;
        text-align: center;

        .tab-link{
            padding-bottom:5px ;
            color:$color-text-l;
        }
             //&的意思就是当前元素 .tab-item   .tab-item.router-link-active{}
            &.router-link-active{
                //被选中的路由router link的样式 router-link-active router-link-exact-active tab-item
                .tab-link{
                    color:$color-theme;
                    border-bottom: 2px solid $color-theme;
                }
            }
            
        }
    }



</style>
