<template>
    <!-- 首页二级页面（热门模块） -->
    <!-- 热门 -->
    <div class="homeChild" v-if="route.query.pid === '666' || route.query.pid == undefined">
        <!-- 首页二级模块 -->
        <homeTwoModule :homeNav="homeNav" />

        <!-- 限时快抢模块 -->
        <div class="goodList">
            <!-- 限时快抢 -->
            <div class="timeLimit">
                <p>限时快抢 <span>></span></p>
                <div class="timeLimit-item">
                    <div v-for="(i, index) in timeRobItem" :key="index">
                        <img :src="i.cover" alt="111">
                        <p>￥<span>{{ Math.floor(i.livePrice) }}</span>.31</p>
                    </div>
                </div>
            </div>
            <!-- 女装尖货榜 -->
            <div @click="shoping" class='topGoodsListOfWomen'>
                <p>女装尖货榜 <span>></span></p>
                <img v-if="TimeRob[2]" :src="TimeRob[2]?.backgroundImage">
            </div>
        </div>
        <!-- 瀑布流内容 -->
        <!-- <keep-alive> -->
        <WaterfallFlow />
        <!-- </keep-alive> -->
    </div>

    <!-- 除了热门之外的 -->
    <div class="homeChild" v-if="route.query.pid !== '666' && route.query.pid != undefined">
        <!-- 首页二级模块 -->
        <homeRecommend v-if="route.query.pid !== '3627'" :homeNav="RecommendNav" />
        <!-- 正在流行独有 -->
        <div v-if="route.query.pid === '3627'">
            <!-- 轮播图 -->
            <div class="broadcastMap">
                <!-- <lazy-component> -->
                <van-swipe :autoplay="3000" @change="onChange">
                    <van-swipe-item v-for="(image, a) in images" :key="image">
                        <lazy-component>
                            <img :src="image" :to="{ name: 'moduleHome', query: { keyword: TypeData[a] } }" />
                        </lazy-component>
                    </van-swipe-item>
                </van-swipe>
                <!-- </lazy-component> -->
            </div>
            <!-- 秋冬必备模块 -->
            <div class="autumnAndWinter">
                <div class="autu-menu">
                    <div class="autu">
                        <div class="item" v-for="(item, index) in TypeData" :key="index">
                            <router-link :to="{ name: 'moduleHome', query: { keyword: item } }">
                                <img class="pic" :src="`pic/p${index + 1}.png`">
                                <p class="content">{{ item }}</p>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 分割图 -->
            <div class="hp1">
                <!-- 有问题 -->
                <img src="/hp1.webp" alt="">
            </div>
        </div>
        <!-- 瀑布流内容 -->
        <keep-alive>
            <waterfallFlowTwo :pid="pid" />
        </keep-alive>
    </div>
    <!-- <router-view /> -->
</template>

<script setup lang="ts" name="homechild">
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import homeTwoModule from '@/components/homeTwoModule.vue';
import homeRecommend from '@/components/homeRecommend.vue';
import WaterfallFlow from '@/components/WaterfallFlowView.vue';
import waterfallFlowTwo from '@/components/waterfallFlowTwo.vue';

import { getHomeModuleRow, gettimeLimitedQuickGrab, getTimeProg, getHomeNavigation, getHomeModuleRowTwo } from '../../apic/homes'
import { type List, type HomeTopNav, type gettimeRob, type gettimeRobItem, type recommendList } from '../../typings'
import { useBgColor } from '../../stores/bgChange';
const router = useRouter();
const route = useRoute();
// 热门页面
const homeTwoNav = ref<Array<List>>([])
const homeNav = ref<Array<HomeTopNav>>([])
const TimeRob = ref<Array<gettimeRob>>([])
const timeRobItem = ref<Array<gettimeRobItem>>([])

// 非热门页面
const RecommendNav = ref<Array<recommendList>>([])
const TypeData = ['百变潮流裤', '棒球服', '宽松卫衣', '毛呢大衣', '毛衣', '棉服', '皮草', '气质风衣', '少女感马甲', '小个子精选', '羽绒服', '针织衫'];
const images = [
    'projectTitle/百变潮流裤bg.png',
    'projectTitle/棒球服bg.png',
    'projectTitle/宽松卫衣bg.png',
    'projectTitle/毛呢大衣bg.png',
    'projectTitle/毛衣bg.png',
    'projectTitle/棉服bg.png',
    'projectTitle/皮草bg.png',
    'projectTitle/气质风衣bg.png',
    'projectTitle/少女感马甲bg.png',
    'projectTitle/小个子精选bg.png',
    'projectTitle/羽绒服bg.png',
    'projectTitle/针织衫bg.png',
];

const bgChange = useBgColor();

// 点击跳转相关
//跳购买页面
function shoping() {
    router.push({ name: 'shop' })
}
const pid = route.query.pid ? route.query.pid : '666';

// 获取非热门页面数据
async function fn(pid: string) {
    let RecommendData = await getHomeModuleRowTwo(pid);
    RecommendNav.value = RecommendData.data?.list;
    if (RecommendNav.value?.length < 12) {
        RecommendNav.value = RecommendNav.value.splice(0, 7)
    }
    // console.log(RecommendNav)
}
const onChange = (index: string) => {
    console.log('当前 Swipe 索引：' + index);
    bgChange.changeColor(index);
}

onMounted(async () => {
    //首页数据(热门)
    console.log("pid76", pid);
    if (pid === '666' || pid == undefined) {
        let homeTwoNavMenu: any = await getHomeNavigation();
        let dataArr = await getHomeModuleRow();
        let dataTime = await gettimeLimitedQuickGrab();
        let dataProg: any = await getTimeProg();
        homeTwoNav.value = homeTwoNavMenu.data[117330].list
        homeNav.value = dataArr
        TimeRob.value = dataTime
        timeRobItem.value = dataProg.data?.itemList.splice(0, 3)
    } else {
        //首页数据(非热门)
        fn(pid as string);
    }
})
// 监听路由变化，来跳转页面
watch(() => route.query,
    (newVa, oldVal) => {
        if (newVa.pid !== '666' && pid !== undefined) {
            fn(newVa.pid as string);
        }
    },
    { immediate: true }
)





</script>

<style lang="scss" scoped>
.homeChild {
    padding-top: 10px;
    border-top-right-radius: 14px;
    border-top-left-radius: 14px;
    background-color: white;
    position: relative;
    top: -12px;


    // 限时快抢模块
    .goodList {
        width: 100vw;
        padding: 10px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-between;

        .timeLimit {
            width: 63vw;
            height: 142px;
            background-color: #f7eee2;
            border-radius: 10px;
        }

        .timeLimit>p {
            font-size: 14px;
            font-weight: 800;
            padding: 10px;
        }

        .timeLimit>p>span {
            font-family: '仿宋';
            font-size: 13;
        }

        .timeLimit-item {
            display: flex;
            justify-content: space-between;
            padding: 0 10px;
            height: 59%;
        }

        .timeLimit-item img {
            width: 100%;
            height: 100%;
            border-radius: 6px;
        }

        .timeLimit-item>div {
            width: 32%;
            height: 84%;
            background-color: rgb(250, 227, 231);
            border-radius: 10px;
        }

        .timeLimit-item p {
            font-size: 12px;
            text-align: center;
            margin-top: 5px;
            font-weight: 600;
        }

        .timeLimit-item span {
            font-size: 15px;
        }

        .topGoodsListOfWomen {
            width: 30vw;
            height: 142px;
            background-color: #f2d2d4;
            border-radius: 10px;
        }

        .topGoodsListOfWomen p {
            font-size: 16px;
            font-weight: 600;
            margin: 10px;
            font-family: '仿宋';
            margin-top: 15px;
            display: flex;
            align-items: center;
        }

        .topGoodsListOfWomen span {
            font-size: 13px;
            margin-left: 5px;
        }

        .topGoodsListOfWomen img {
            display: inline-block;
            border-radius: 5px;
            width: 90%;
            height: 66%;
            // background-color: rgb(250, 152, 230);
            margin: 0 6px 2px 6px;
        }
    }

    // 秋冬必备
    .autumnAndWinter {
        // margin-bottom: 10px;
        width: 100vw;
        padding: 10px 15px;
        box-sizing: border-box;

        // background-color: #e9a5aa;
        // border:1px solid #e0abae;
        .autu-menu {
            border-radius: 10px;
            border: 10px 0;
        }

        .autu {
            width: 100%;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
        }

        .autuTitle {
            font-size: 18px;
            font-weight: 500;
            padding: 10px;
            color: #111;
            font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
        }

        .pic {
            width: 100px;
            height: 100px;
            border-radius: 10px;
        }

        .content {
            font-size: 14px;
            padding: 10px 0;
            box-sizing: border-box;
            text-align: center;
            color: #333;
        }
    }

    .hp1 img {
        width: 100vw;
        padding: 0 12px;
    }

    .broadcastMap {
        width: 100vw;
        // padding: 0 10px;
        padding: 0 2px;
        box-sizing: border-box;
        border-radius: 12px;
        overflow: hidden;

        img {
            width: 100%;
            border-radius: 12px;
            overflow: hidden;
        }
    }
}
</style>