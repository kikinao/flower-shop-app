<template>
    <div class="shopBox">
        <!-- 导航栏 -->
        <van-nav-bar :title="`购物车${curLength}`">
            <template #left>
                <van-icon name="arrow-left" size="18" color="gray" @click="router.go(-1)" />
            </template>
            <template #right>
                <van-icon name="search" size="18" color="gray" @click="router.replace({ name: 'search' })" />
            </template>
        </van-nav-bar>

        <!-- 加购商品 -->
        <div class="main wrap" :ref="el => scrollEl = el as HTMLElement">
            <div class="shop-item">
                <van-checkbox-group v-model="checked" ref="checkboxGroup" icon-size="16" checked-color="#ff4569">
                    <!-- 商品渲染 -->
                    <van-checkbox :label-disabled="true" :name="e.id" v-for="(e, i) in shopData" :key="i">
                        <div class="shopCarBox">
                            <div class="box-head">
                                <div class="dianming-box">
                                    <div class="shopName">
                                        <van-icon name="shop-collect-o" color="gray" size="22" />&nbsp;
                                        <p>{{ e.shopName }}</p>
                                    </div>
                                </div>

                                <!-- 订单详情 -->
                                <div class="order-box">
                                    <div class="order-picture">
                                        <van-image width="70" height="85" radius="5" :src="e.imgSrc" />
                                    </div>
                                    <div class="order-text">
                                        <p class="goods-name">{{ e.goodsName }}</p>
                                        <div class="styleBox">
                                            <p class="goods-style">颜色: {{ e.style }};尺码: {{ e.size }};</p>
                                        </div>
                                        <div class="mailBox">
                                            <p class="mail">付款后最晚于3日内发货</p>
                                        </div>
                                    </div>
                                </div>

                                <div class="box-foot">
                                    <div class="price">¥{{ e.price }}</div>
                                    <div class="myStepper">
                                        <div class="stepper-left" @click="e.count > 1 ? e.count-- : null">
                                            <van-icon name="minus" />
                                        </div>
                                        <div class="mynumber">{{ e.count }}</div>
                                        <div class="stepper-right">
                                            <van-icon name="plus" @click="e.count++" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </van-checkbox>
                </van-checkbox-group>
            </div>
        </div>

        <!-- 结算选择 -->
        <div class="settlement">
            <van-checkbox v-model="isCheckAll" icon-size="14" checked-color="#ff4569" :label-disabled="true">
                <p @click="allChecked">全选</p>
            </van-checkbox>

            <div class="trashCan" @click="deleteData">
                <van-icon name="delete-o" />
            </div>

            <div class="allPrice-box">
                <p class="allPrice">¥{{ totalPrice }}</p>
                <button class="allPrice-btn" @click="theSubmit">结算</button>
            </div>
        </div>
        <div>
            <RouterView />
        </div>
    </div>
</template>

<script setup lang="ts" name="shop">
import type { shopCarData } from '../typings'
import { ref, toRaw, computed, onMounted, watch, nextTick, onUnmounted } from 'vue';
import { showToast } from 'vant';
import BScroll from '@better-scroll/core'
import { useRouter, RouterView } from 'vue-router';
const router = useRouter();

// BScroll 父容器dom元素
const scrollEl = ref<HTMLElement>()
// BS实例对象
const bs = ref<BScroll>();

// 初始化bs
const initalBS = () => {
    if (!bs.value) {
        bs.value = new BScroll(scrollEl.value!, {
            click: true, // 内部子元素可以被点击
            bounce: false
        })
    }
}

let length = ref(0);
const isCheckAll = ref(false);
const shopData = ref();
let totalPrice = ref(`0.00`)

// 复选框选择相关
const checked = ref([]);
const checkboxGroup = ref();
let allNum = ref(0);

// 全选
function allChecked() {
    if (isCheckAll.value) {
        isCheckAll.value = false;
        checkboxGroup.value.toggleAll(false);
    } else {
        isCheckAll.value = true;
        checkboxGroup.value.toggleAll(true);
    }
}

// 获取localstorage
function getLocalShopCarData() {
    shopData.value = JSON.parse(localStorage.shopCarData || `[]`);
    // console.log(shopData.value)
}

onMounted(() => {
    getLocalShopCarData();
    isCheckAll.value = false;
    nextTick(() => {
        initalBS();
    })
})

const curLength = computed(() => {
    let res = '';
    if (length.value > 0) {
        res = `(${length.value})`
    }
    return res;
})

// 深度监听计算价格
watch(checked, () => {
    // 监听全选
    if (checked.value.length == shopData.value.length) {
        isCheckAll.value = true;
    } else {
        isCheckAll.value = false;
    }

    // 计算价格
    let curPrice = 0;
    for (let i = 0; i < shopData.value.length; i++) {
        const shopE = shopData.value[i]
        // 循环对比id
        for (let j = 0; j < checked.value.length; j++) {
            const checkedE = checked.value[j];
            if (checkedE == shopE.id) {
                curPrice += Number(shopE.price) * shopE.count;
            }
        }
    }
    totalPrice.value = curPrice.toFixed(2)
})

watch(() => shopData, () => {
    // console.log(111)
    // 监听全选
    if (checked.value.length == shopData.value.length) {
        isCheckAll.value = true;
    } else {
        isCheckAll.value = false;
    }

    // 计算价格
    let curPrice = 0;
    for (let i = 0; i < shopData.value.length; i++) {
        const shopE = shopData.value[i]
        // 循环对比id
        for (let j = 0; j < checked.value.length; j++) {
            const checkedE = checked.value[j];
            if (checkedE == shopE.id) {
                curPrice += Number(shopE.price) * shopE.count;
            }
        }
    }
    totalPrice.value = curPrice.toFixed(2)
}, { deep: true })

let newShopCarData: Array<shopCarData> = [];
const isDelete = ref(false);

// 删除选中
function deleteData() {
    // 获取旧数据
    newShopCarData = JSON.parse(localStorage.shopCarData)

    // 获取选择的id
    const checkedData = toRaw(checked.value);

    // 筛选已经购买的商品
    for (let i = 0; i < checkedData.length; i++) {
        const shopE = checkedData[i];
        newShopCarData = newShopCarData.filter((e: any) => {
            return e.id != shopE;
        })
    }

    // console.log(newShopCarData)
    // 转存数据
    localStorage.shopCarData = JSON.stringify(newShopCarData);

    isDelete.value = !isDelete.value;
}

// 数据监听来更新local
watch(isDelete, () => {
    getLocalShopCarData();
})


const buyData: any = [];

// 提交判断
function theSubmit() {
    if (checked.value.length == 0) {
        return showToast('请先选择商品哦~');
    }

    // 强转为非ref对象
    const myData = toRaw(shopData.value);

    // 遍历寻找购买的商品
    for (let i = 0; i < myData.length; i++) {
        const shopE = myData[i]
        // 循环对比id
        for (let j = 0; j < checked.value.length; j++) {
            const checkedE = checked.value[j];
            if (checkedE == shopE.id) {
                buyData.push(shopE)
            }
        }
    }

    // console.log(buyData)

    // 将购买数据存到localStorage中
    localStorage.buyData = JSON.stringify(buyData);
    // 页面跳转
    router.push({ name: 'confirmorder' })
    // console.log(buyData.value)
}

// 卸载bs
onUnmounted(() => {
    bs.value?.destroy();
})
</script>

<style lang="scss" scoped>
.wrap {
    height: 100vh;
    margin-bottom: 52px;
}

.shopBox {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    z-index: 11;
    background-color: white;
    font-size: 14px;
}

.settlement {
    height: 50px;
    border-top: 1px solid gainsboro;
    background-color: white;
    padding: 0 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
}

.allPrice-box {
    display: flex;
    align-items: center;

    p {
        font-weight: 700;
        color: var(--subject-color);
        margin-right: 10px;
    }
}

.allPrice-btn {
    color: white;
    background-image: linear-gradient(90deg, #ff4469, #ff468d);
    padding: 5px 15px;
    border-color: transparent;
    border-radius: 999px;
}

.main {
    padding: 10px;
    font-size: 12px;
    padding-bottom: 0;
}

.dianming-box {
    background-color: rgb(255, 255, 255);
    display: flex;
    justify-content: space-between;
    align-items: center;

    .shopName {
        display: flex;
        align-items: center;
        color: grey;
    }
}

.styleBox {
    max-width: 200px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    margin-top: 2px;
}

.mailBox {
    margin-top: 6px;
}

.order-box {
    display: flex;
    background-color: rgb(255, 255, 255);
    padding-top: 10px;

    .order-text {
        height: 85px;
        margin-left: 8px;
    }
}

.goods-name {
    font-size: 14px;
    max-width: 230px;
    font-weight: 600;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.goods-style {
    display: inline-block;
    max-width: 206px;
    padding: 3px;
    border-radius: 5px;
    color: gray;
    background-color: #f7f7f7;
}

.mail {
    display: inline-block;
    background-color: #fff0f3;
    color: var(--subject-color);
    padding: 3px;
    border-radius: 4px;
}

.box-foot {
    width: 250px;
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    transform: translateX(78px);
}

.price {
    font-size: 15px;
    font-weight: 700;
    color: var(--subject-color);
}

.myStepper {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .stepper-left,
    .stepper-right {
        width: 22px;
        height: 22px;
        background-color: #f7f7f7;
        font-size: 13px;
        line-height: 23px;
        color: gainsboro;
        text-align: center;
        border-radius: 0 8px 8px 0;
    }

    .stepper-left {
        border-radius: 8px 0 0 8px;
    }

    .mynumber {
        margin: 0 2px;
        padding: 0;
        font-size: 13px;
        text-indent: 7.5px;
        width: 22px;
        height: 22px;
        line-height: 22px;
        outline: none;
        border: none;
        background-color: #f7f7f7;
    }
}

.trashCan {
    position: absolute;
    left: 100px;
}
</style>