<!-- 首页二级模块(热门模块) -->
<template>
    <div class="home-nav">
        <div class="home-nav-tab">
            <van-grid square :column-num="7" icon-size="50px">
                <van-grid-item :to="{name:'productList',query:{keyWord:h.title}}"  class="nav-tab-item" v-for="h in homeNav" :key="h._system_record_entry_id" :icon="h.image"
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
.home-nav {
    // margin-top: 10px;
    overflow: auto;
    width: 100vw;
    // padding: 0 10px;
    height: 182px;
    box-sizing: border-box;

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