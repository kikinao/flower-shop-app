<!-- 瀑布流（热门模块） -->
<template>
    <div class="waterfallFlowShree">
        <!-- <div class="mubu" v-show="flags"></div> -->
        <van-list class="item-menu" v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <div v-masonry class="item-menu" transition-duration="0.3s" i tem-selector=".item">
                <div v-masonry-tile class="item" v-for="(item, index) in getHomeC" :key="index"
                    @click="liveBroadcastPage(item.itemIdUrl, item.actorIdUrl, item.explainId)">
                    <!-- <lazy-component loading="../assets/images/dianpu.jpg"> -->
                    <div class="picture">
                    
                        <img class="bigPic" :src="item.itemImage" alt="">

                        <div class="liveBroadcastAtTheSamePrice">
                            <img :src="item.lefttop_taglist[0]?.img" alt="">
                        </div>
                        <!-- 头像 -->
                        <div class="headImage">
                            <img :src="item.actorAvatar" alt="">
                            <span>{{ item.actorName }}</span>
                        </div>
                        <!-- 播放 -->
                        <div class="Play">
                            <img src="../assets/images/Play.png" alt="">
                        </div>
                    </div>
                    <!-- 价格 -->
                    <div class="information">
                        <p class="title">{{ item.title }}</p>
                        <div class="price">
                            <div class="livePrice">
                                <div>
                                    ￥<span>{{ Math.floor(item.showDiscountPrice) }}</span>
                                    <span v-if="Math.floor(
                                        (item.showDiscountPrice - Math.floor(item.showDiscountPrice)) * 10
                                    )">.{{ Math.floor(
    (item.showDiscountPrice - Math.floor(item.showDiscountPrice)) * 10
) }}
                                        <span class="decimalTwo"
                                            v-if="Math.floor((item.showDiscountPrice - Math.floor(item.showDiscountPrice * 10) / 10) * 100)">
                                            {{ Math.floor((item.showDiscountPrice -
                                                Math.floor(item.showDiscountPrice *
                                                    10)
                                                /
                                                10) * 100) }}
                                        </span>
                                    </span>
                                </div>
                                <img :src="item.bottomIcon" alt="">
                            </div>
                            <div class="sale">{{ item.sale }}</div>
                        </div>
                    </div>
                    <!-- </lazy-component> -->
                </div>
            </div>
        </van-list>
    </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { getModuleHome } from '../apic/homes'
import { type getHomeC } from '../typings'
import { ref, nextTick } from 'vue';
// import {useIndex} from '../stores/bgChange'
const router = useRouter();
const route = useRoute();

// const indexData=useIndex();
// const index=indexData.bgColorIndex
// console.log('小标',index)

// console.log('index',index)
// const list = ref([]);
const getHomeC = ref<Array<getHomeC>>([])
const loading = ref(false);
const finished = ref(false);
const count = ref(1)
let keyword = route.query.keyword;
const flags = ref(true)
const bgColorArr=['#b18f56','#6888a4','#5f5657','#86a9b1','#8aa062','#b27160','#be8d77','#af7f68','#aaa968','#98b0b8','#a897af','#a36b67']
// console.log('keyword', keyword)

const props = defineProps(['getHomeC'])
route.query.index
function liveBroadcastPage(itemUrlId: string, actorUrlId: string, explainId: string) {
    // console.log(actorUrlId)
    router.push({
        name: 'livePlayback',
        params: {
            itemUrlId: itemUrlId,
            actorUrlId: actorUrlId,
            explainId: explainId
        }
    })
}
const onLoad = async () => {
    // 异步更新数据
    let HomeContentData: any = await getModuleHome(keyword);//第二页数据
    // console.log(1111)
    for (let i = 0; i < HomeContentData.data.list.length; i++) {
        getHomeC.value.push(HomeContentData.data.list[i]);
    }
    // getHomeC.value=HomeContentData.data.list
    // console.log('首页内容', getHomeC.value);
    // 加载状态结束
    loading.value = false;

    // 数据全部加载完成
    nextTick(() => {
        loading.value = false
        count.value++;
    })
    setTimeout(() => {
        flags.value = false
    }, 3000)
};


</script>

<style lang="scss">
// 瀑布流内容
.waterfallFlowShree {
    padding: 10px 0px 10px 6px;
    box-sizing: border-box;
    width: 100vw;
    .mubu{
        position: fixed;
        width: 100vw;
        height:68vh;
        background-color: #fff;
        bottom:50px;
        margin-left: -6px;
        z-index:1;
    }

    .item {
        margin-bottom: 10px;
        width: 49%;
        // min-height: 250px;
    }

    .item:nth-child(n+1) {
        padding: 0 6px;
    }



    .picture {
        position: relative;
        width: 100%;
    }

    .bigPic {
        width: 100%;
        height: 100%;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        background-color: hsl(0, 0%, 87%);
        z-index: 99;
    }


    // 播放
    .Play {
        position: absolute;
        right: 5px;
        top: 2px;
    }

    .Play img {
        width: 25px;
    }

    // 头像部分
    .headImage {
        position: absolute;
        left: 10px;
        bottom: 10px;
        color: white;
        display: flex;
        align-items: center;
        font-size: 10px;

        img {
            width: 13%;
            height: 13%;
            border-radius: 50%;
            margin-right: 5px;
            border: 1px solid #fff;
        }
    }

    // 直播同价
    .liveBroadcastAtTheSamePrice {
        position: absolute;
        top: 0;
        left: 5px;

        img {
            width: 40px;
        }
    }

    // 商品标题
    .title {
        width: 100%;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        display: -webkit-box;
        overflow: hidden;
        font-size: 12px;
        padding: 5px;
        line-height: 1.2;
    }

    .information {
        background-color: #fff;
        margin-top: -5px;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
    }

    //价格
    .price {
        display: flex;
        justify-content: space-between;
        padding: 3px 5px 5px;
        color: #ff4668;
        font-size: 12px;

        .livePrice {
            display: flex;
            align-items: center;
            font-weight: 600;
        }

        .livePrice div>span:nth-child(1) {
            font-size: 14px;
            margin-left: -2px;
        }

        img {
            width: 20px;
            height: 12px;
            margin-left: 3px;
            margin-bottom: 1px;
        }

        .sale {
            font-size: 10px;
            padding: 3px 6px;
            background-color: #ffecef;
            border-radius: 10px;
            text-align: center;
        }

        .decimalTwo {
            margin-left: -1px;
        }
    }
}
</style>