<template>
    <div class="home">
        <div class="head" :class="{ headTwo: route.query.pid == '3627' }">
            <!-- 搜索 -->
            <div class="search" @click="gotoSearch">
                <van-search v-model="keyWord" readonly show-action placeholder="冬季连衣裙搭配" shape="round" :clearable="false">
                    <template #action>
                        <van-icon @click.stop="gotoShop" name="shopping-cart-o" size="20" />
                    </template>
                </van-search>
            </div>

            <!-- 二级导航 -->
            <div class="head-top">
                <van-tabs v-model:active="active" v-if="homeTwoNav?.length >= 1">
                    <template>
                        <van-tab :to="{ name: 'homechild', query: { pid: 666 } }" title="热门"></van-tab>
                    </template>
                    <van-tab :to="{ name: 'homechild', query: { pid: h.maitKey } }" v-for="(h, index) in homeTwoNav"
                        :key="index" :title="h.title">
                    </van-tab>
                </van-tabs>
            </div>
        </div>
        <router-view v-slot="{ Component }">
            <keep-alive>
                <component :is="Component" :key="$route.name" v-if="$route.meta.keepAlive" />
            </keep-alive>
            <component :is="Component" :key="$route.name" v-if="!$route.meta.keepAlive" />
        </router-view>

        <!-- <router-view /> -->
    </div>
</template>
<script setup lang="ts">

import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { getHomeNavigation } from '../apic/homes'
import { type List, type item } from '../typings'
import {useBgColor} from '../stores/bgChange';
const router = useRouter();
const route = useRoute();
let keyWord = ref('');
// 导航下标数据
const activeIndex: item = { '666': 0 }
// let count = ref(Math.random() * 2000)
const homeTwoNav = ref<Array<List>>([])

const active = ref(0);

const headTwo='bbclk';
const bgArr = ['bbclk', 'bqf', 'kswy', 'mndy', 'my', 'mf', 'pc', 'qzfy', 'sngmj', 'xgzjx', 'yrf', 'zzs'];
const bgColorArr=['#b18f56','#6888a4','#5f5657','#86a9b1','#8aa062','#b27160','#be8d77','#af7f68','#aaa968','#98b0b8','#a897af','#a36b67']
const bgChange=useBgColor();
let changeColor=ref(bgColorArr[bgChange.bgColorIndex]);

// 点击跳转相关
//跳购物车页面
function gotoShop() {
    router.push({ name: 'shop' })
}
//跳搜索页面
function gotoSearch() {
    router.push({ name: 'search' })
}

onMounted(async () => {
    //首页数据
    let homeTwoNavMenu: any = await getHomeNavigation();
    homeTwoNav.value = homeTwoNavMenu.data[117330].list;
    let home = homeTwoNav.value
    for (let i = 0; i < home.length; i++) {
        let list = home[i].maitKey;
        activeIndex[list] = i + 1;
    }
    // console.log('下标', activeIndex);
    // 路由下标
    let pidd: any = route.query.pid;
    // console.log('路由下标', pidd)
    let index = activeIndex[pidd];
    active.value = index;

})

//监听颜色变化
watch(() => bgChange.bgColorIndex, (newVal, oldVal) => {
    console.log(newVal);
    changeColor.value=bgColorArr[bgChange.bgColorIndex];
    
})


</script>

<style lang="scss">
.home {
    font-size: 16px;

    .head {
        // background: rgb(220, 157, 167);
        background: linear-gradient(180deg, rgb(232, 188, 195) 0%, rgba(225, 148, 160, 0.978) 100%);
        color: #fff;
        height: 97.99px;
    }

    .headTwo {
        // background-color: burlywood;
        background: none;
        background-color: v-bind(changeColor);
        height: 97.99px;
    }

    .head-top {
        width: 95vw;
        // background-color: aqua;
    }

    // 头部搜索
    .van-search,
    .van-tabs__nav {
        background-color: transparent;
        color: #fff;
    }

    .van-tabs--line .van-tabs__wrap {
        margin-left: -10px !important;
    }

    .van-search__field {
        height: 27px !important;
    }

    .van-tabs__nav {
        background: transparent !important;
        margin-left: 5px;
        width: 100%;
    }

    .van-search__action .van-icon {
        color: #f3e9e9;
    }

    .van-tabs__line {
        bottom: 0.5rem !important;
        height: 1.5px;
        width: 20px;
        background-color: white;
    }

    .head-top {
        font-family: 'Courier New', Courier, monospace;
        font-size: 13px;

        .van-tab--active {
            color: white;
            font-size: 15px;

        }

        .van-tab {
            color: rgba(255, 255, 255, .8)
        }

        .van-tabs__nav--line {
            box-sizing: border-box;
        }
    }
}
</style>