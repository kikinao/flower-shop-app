<template>
    <div class="attention-data">
        <van-nav-bar :title="`订单列表`">
            <template #left>
                <van-icon name="arrow-left" size="18" color="gray" @click="router.go(-1)" />
            </template>
            <template #right>
                <van-icon name="shopping-cart-o" size="20" color="gray" @click="router.replace({ name: 'shop' })" />
            </template>
        </van-nav-bar>
        <div class="head-nav">
            <van-tabs v-model:active="active" shrink>
                <van-tab title="待付款" replace :to="{ name: 'myorder', query: { id: 0 } }">
                    <img style="width: 100vw;" src="../../assets/images/order_bg.png" alt="">
                    <div class="aShop" v-show="attentionlist.attention.length < 1">
                        <img src="../../assets/images/order_bg2.png" alt="">
                        <div>还没有相关订单哦~~</div>
                    </div>
                </van-tab>
                <van-tab title="待发货" replace :to="{ name: 'myorder', query: { id: 1 } }">
                    <img style="width: 100vw;" src="../../assets/images/order_bg.png" alt="">
                    <div class="aShop">
                        <img src="../../assets/images/order_bg2.png" alt="">
                        <div>还没有相关订单哦~~</div>
                    </div>
                </van-tab>
                <van-tab title="待收获" replace :to="{ name: 'myorder', query: { id: 2 } }">
                    <img style="width: 100vw;" src="../../assets/images/order_bg.png" alt="">
                    <div class="aShop">
                        <img src="../../assets/images/order_bg2.png" alt="">
                        <div>还没有相关订单哦~~</div>
                    </div>
                </van-tab>
                <van-tab title="待评价" replace :to="{ name: 'myorder', query: { id: 3 } }">
                    <img style="width: 100vw;" src="../../assets/images/order_bg.png" alt="">
                    <div class="aShop">
                        <img src="../../assets/images/order_bg2.png" alt="">
                        <div>还没有相关订单哦~~</div>
                    </div>
                </van-tab>
                <van-tab title="售后" replace :to="{ name: 'myorder', query: { id: 4 } }">
                    <img style="width: 100vw;" src="../../assets/images/order_bg.png" alt="">
                    <div class="aShop">
                        <img src="../../assets/images/order_bg2.png" alt="">
                        <div>还没有相关订单哦~~</div>
                    </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAttention } from '../../stores/bgChange';
import { showConfirmDialog } from 'vant';
import { useRoute, useRouter } from "vue-router";

const attentionlist = useAttention()
let active = ref(0);
const route = useRoute()
const router = useRouter()

onMounted(() => {
    if (route.query.id != undefined) {
        active.value = Number(route.query.id)
    }
})

</script>
<style lang="scss" scoped>
.attention-data {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    z-index: 99;
    background-color: white;

    .aShop {
        img {
            width: 300px;
            margin: 40px auto;
        }

        text-align: center;
        font-size: 13px;

    }

}
</style>