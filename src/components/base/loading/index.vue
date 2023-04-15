<template>
  <div class="loading">
    <div class="loading-content">
        <img src="./loading.gif" alt="" width="24" height="24">
        <p class="desc">正在载入中...</p>
    </div>

  </div>
</template>

<script setup>

</script>


<style scoped lang="scss">
.loading{
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50% , -50%,0);
    .loading-content{
        text-align: center;
        .desc{
            margin-top: 10px;
            transform:  translateX(10px);
            line-height: 20px;
            font-size: 20px;
            color: $color-text-l;
        }
    }
}

</style>
