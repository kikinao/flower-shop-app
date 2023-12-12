<!-- 首页二级模块(除热门模块之外的页面) -->
<template>
    <div class="home-nav-two">
        <div class="home-nav-tab">
            <van-grid square :column-num="7" icon-size="50px">
                <van-grid-item class="nav-tab-item" v-for="h in homeNav" :key="h._system_record_entry_id" :icon="h.image"
                    :text="h.title" :sort="h.sort" :link="h.link" :titlecolor="h.titleColor" :h5link="h.h5Link" />
            </van-grid>
        </div>
    </div>
</template>
<script setup lang="ts">
const props = defineProps(['homeNav'])
</script>
<style lang="scss">
// 分类导航
.home-nav-two {
    margin-bottom: 10px;
    overflow: auto;
    width: 100vw;
    // padding: 0 10px;
    // min-height: 91px;
    box-sizing: border-box;
    height: auto;

    .van-grid-item__text {
        white-space: nowrap;
        // width: 100%;
    }


    //隐藏滚动条高度
    &::-webkit-scrollbar {
        height: 0px;
    }

    .home-nav-tab {
        width: 140vw;
    }

    .nav-tab-item {
        margin-top: 10px;
    }

    //去掉导航条边框
    [class*=van-hairline]:after {
        border: none;
    }
}
</style>