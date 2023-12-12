<template>
    <div class="collec-data">
        <van-nav-bar title="我的收藏" right-text="更多商品" @click-right="onClickRight" />
        <div class="head-nav">
            <van-tabs v-model:active="active">
                <van-tab title="收藏视频" replace :to="{ name: 'collection', query: { id: 0 } }">
                    <div v-show="collectDataList.collectionDataList.length > 0">
                        <waterfallFlowFour :getCollList="collectDataList.collectionDataList" />
                        <!-- <div class="more">没有更多了~~</div> -->
                    </div>
                    <div v-show="collectDataList.collectionDataList.length < 1">
                        <div class="aShop" v-show='!collectDataList.collectionDataList'>
                            <img src="../assets/images/dianpu.jpg" alt="">
                            <div>你还没有收藏任何视频哦~~</div>
                        </div>
                    </div>
                </van-tab>
                <van-tab title="收藏商品" replace :to="{ name: 'collection', query: { id: 1 } }">
                    <div v-show="newData.length > 0">
                        <div class="atten-item">
                            <div class="att-item-list" v-for="(i, index) in newData" :key="index">
                                <div>
                                    <div class="image" :style="{ backgroundImage: `url(${i.normalShareInfo.imageUrl})` }">
                                    </div>
                                </div>
                                <div class="information">
                                    <div class="title">{{ i.normalShareInfo.title }}</div>
                                    <div class="content">{{ i.normalShareInfo.content }}</div>
                                </div>
                                <div class="attentionIsArray" @click="cancelTheAttention(i.itemInfo.itemId)">已收藏</div>
                            </div>
                        </div>
                        <div class="more">没有更多了~~</div>
                    </div>
                    <div class="aShop" v-show='newData.length < 1'>
                        <img src="../assets/images/dianpu.jpg" alt="">
                        <div>你还没有收藏任何商品哦~~</div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRouter, useRoute } from 'vue-router';
import { collection, collectionProduct } from '../stores/bgChange';
import waterfallFlowFour from '../components/waterfallFlowFour.vue';
import { showConfirmDialog } from 'vant';
import { getProdectDetails } from "../apic/search";



const router = useRouter();
const route = useRoute();
const collectDataList = collection();
const collectProduct = collectionProduct();
const newData = ref([]) as any;


let active = ref(0);

function onClickRight() {
    console.log(1111)
    router.push({
        name: 'homechild'
    })
}

function cancelTheAttention(contentId: string) {
    console.log(contentId);
    showConfirmDialog({
        message:
            '确定要取消收藏吗？？',
    })
        .then(() => {
            // 确定
            collectProduct.removeProduct(contentId as any)
            scData();
        })
        .catch(() => {
            // 取消
        });
};
async function scData() {
    newData.value = []
    for (let i = 0; i < collectProduct.collectionDataProduct?.length; i++) {
        let data = await getProdectDetails(collectProduct.collectionDataProduct[i]);
        newData.value.push(data)
    }
}

onMounted(() => {
    // console.log(collectProduct.collectionDataProduct)
    if (route.query.id != undefined) {
        active.value = Number(route.query.id)
    }
    scData();
    console.log(newData.value)
})


</script>

<style lang="scss">
.collec-data {
    width: 100vw;
    height: 100vh;


    .van-nav-bar .van-icon,
    .van-nav-bar__text,
    .van-nav-bar__title {
        color: #222222;
    }

    .van-nav-bar__title {
        font-weight: 570;
        font-size: 18px;
    }

    .van-tabs--line .van-tabs__wrap {
        border-bottom: 1px solid #ccc;
    }



    .head-nav {

        // padding: 0px 40px;
        // font-size: 14px;
        .van-tab--active {
            // color: #f56;
            font-weight: 600;
            font-size: 15px;
        }

        .van-tabs__line {
            bottom: 0.6rem;
            width: 38px;
            height: 2px;
            background-color: #f56;
        }

        .van-tab {
            margin: 20px;
        }

    }

    .atten-item {
        padding: 0 15px;
        box-sizing: border-box;
    }

    .att-item-list {
        display: flex;
        font-size: 14px;
        height: 70px;
        align-items: center;
        border-bottom: 1px solid #e6e4e4;
        justify-content: space-between;

        .image {
            width: 50px;
            height: 50px;
            background-position: center center;
            background-size: contain;
            border-radius: 50%;
            margin-right: 6px;
        }

        .information {
            width: 60%;
        }

        .title {
            font-size: 16px;
            font-weight: 580;
            margin-bottom: 8px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .content {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #717171;
        }

        .attentionIsArray {
            width: 68px;
            font-size: 14px;
            color: #888787;
            border: 1px solid #888787;
            padding: 8px 12px;
            margin-left: 10px;
            border-radius: 999px;
        }

    }

    .more {
        font-size: 12px;
        text-align: center;
        margin-top: 30px;
    }

    .aShop {
        img {
            width: 300px;
            margin: 50px auto;
        }

        text-align: center;
        font-size: 13px;

    }

}
</style>