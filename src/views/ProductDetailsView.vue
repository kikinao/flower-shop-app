<template>
    <div class="project-details-box">
        <div class="wrapper" :ref="el => scrollEl = el as HTMLElement">
            <ul :style="{ width: topImagesList.length * 72 + 'vw' }">
                <li v-for="(item, index) in topImagesList" :key="item" @click="showList(index)">
                    <img :src="item">
                </li>
            </ul>
        </div>
        <van-popup v-model:show="show" position="center">
            <div class="wrapper1" :ref="el => scrollEl1 = el as HTMLElement">
                <ul :style="{ width: topImagesList.length * 100 + 'vw' }">
                    <li v-for="item in topImagesList" :key="item">
                        <img :src="item">
                    </li>
                </ul>
            </div>
        </van-popup>
        <van-action-bar class="bottom-bar">
            <van-action-bar-icon icon="shop-o" text="店铺" />
            <van-action-bar-icon icon="cart-o" @click="$router.push({name:'shop'})" text="购物车" />
            <van-action-bar-icon icon="star-o" @click="onClickIcon" v-show="flag" text="未收藏" />
            <van-action-bar-icon icon="star" @click="onClickIcon" v-show="!flag" text="已收藏" color="#f46" />
            <van-action-bar-button color="#FFE6E8" @click="selectColor = true" class="left-attow" type="warning"
                text="加入购物车" />
            <van-action-bar-button color="#FF4689" @click="selectColor = true" class="right-arrow" type="danger"
                text="立即购买" />
        </van-action-bar>
    </div>
    <div class="price-box1" v-if="price.nowPrice">
        <div class="detailTitle">
            <div class="price-num">
                <span class="price1">{{ price.currency }} {{ price.nowPrice }}</span>
                <span class="active" v-if="price.priceTags.length">{{ price.priceTags[0].text }}</span>
            </div>
            <span class="share">已售{{ price.sales }}</span>
        </div>

        <div v-if="popoversList.popovers.length" class="coupon" @click="couponShow = true">
            <p class="coupon-title">{{ popoversList.outers[0].text }}</p>
            <p>领券<van-icon name="arrow" /></p>
        </div>
        <van-popup class="buoy-item-box" round v-model:show="couponShow" position="bottom" :style="{ height: '80%' }">
            <h2>优惠</h2>
            <div class="buoy-item" v-for="item in popoversList.popovers" :key="item.data.effect">
                <div class="buoy-box">
                    <p class="buoy">店铺券</p>
                    <div class="left-area">
                        <p class="left-area-title">￥{{ item.data.effect }} <span>{{ item.data.limitDesc }}</span></p>
                        <p class="left-area-data">{{ item.data.validTime }}</p>
                    </div>
                    <div class="right-area">
                        <button>立即领取</button>
                    </div>
                </div>
                <div v-if="item.data.highlightCouponDesc" class="remind">
                    {{ item.data.highlightCouponDesc.content }}
                </div>
            </div>

        </van-popup>
        <div class="title">{{ skuInfoList.title }}</div>

        <div class="select" @click="selectColor = true">
            <p v-if="skuInfoListColorName == '颜色' && skuInfoListSizeName == '尺码'">选择 <span>颜色 尺码</span></p>
            <p class="selectStyle" v-else>选择 <span>已选：{{ skuInfoListColorName }} {{ skuInfoListSizeName }}</span></p>
            <van-icon name="arrow" />
        </div>
        <van-popup v-model:show="selectColor" position="bottom" :style="{ height: '62%' }">
            <div class="selectColor">
                <div class="select-topList">
                    <img :src="filterImg">
                    <div class="select-topList-text">
                        <h2>{{ price.currency }}{{ price.nowPrice }}</h2>
                        <p class="inventory">库存：{{ filterInventory }}</p>
                        <p v-if="skuInfoListColorName == '颜色' && skuInfoListSizeName == '尺码'">请选择：颜色 尺码</p>
                        <p v-else class="selectStyle">已选：<span>{{ skuInfoListColorName }} {{ skuInfoListSizeName }}</span>
                        </p>
                    </div>
                </div>
                <div class="select-color">
                    <p class="select-color-title">{{ skuInfoList.props[0].label }}</p>
                    <div class="select-size-list">
                        <p @click="changeSelectColor(item.styleId, item.name)"
                            :class="{ active: skuInfoListColorId == item.styleId }"
                            v-for="item in skuInfoList.props[0].list">{{
                                item.name }}</p>
                    </div>
                </div>
                <div class="select-color" v-if="skuInfoList.props[1]">
                    <p class="select-color-title">{{ skuInfoList.props[1].label }}</p>
                    <div class="select-size-list">
                        <p :class="{ active: skuInfoListSizeId == item.sizeId }"
                            @click="changeSelectSize(item.sizeId, item.name)" v-for="item in skuInfoList.props[1].list">{{
                                item.name }}</p>
                    </div>
                </div>
                <div v-else class="select-color">
                    <p class="select-color-title">尺码</p>
                    <div class="select-size-list">
                        <p :class="{ active: skuInfoListSizeName=='均码' }">{{freeSize}}</p>
                    </div>
                </div>
                <div class="select-color">
                    <p class="select-color-title">数量</p>
                    <div class="production-myStepper">
                        <div class="production-stepper-left" @click="clickLeft">
                            <van-icon name="minus" />
                        </div>
                        <div class="production-mynumber">{{ goodsHowNum }}</div>
                        <div class="production-stepper-right" @click="goodsHowNum++">
                            <van-icon name="plus" />
                        </div>
                    </div>
                </div>
                <div class="select-bottom">
                    <button class="cart" @click="addShopingInformation">加入购物车</button>
                    <button class="now-buy" @click="buyImmediately">立即购买</button>
                </div>
            </div>

        </van-popup>
        <div class="evaluate">
            <div class="evaluate-title">
                <span class="evaluate-arctial">评价({{ rateInfoV2List.cRate }})</span>
                <p>评分<span class="evaluate-score">{{ rateInfoV2List.cScore }}</span></p>
            </div>
            <div>
                <ul class="evaluate-button">
                    <li v-for="item in rateInfoV2List.rateTags">
                        <span>{{ item.value }}({{ item.num }})</span>
                    </li>
                </ul>
            </div>
            <ul class="evaluation-area">
                <li v-for="item in rateInfoV2List.list" :key="item.content">
                    <div class="evaluation-area-title">
                        <img :src="item.user.avatar">
                        <div>
                            <p class="name">{{ item.user.uname }}</p>
                            <p class="data">{{ formatDate(item.created) }}</p>
                        </div>
                    </div>
                    <p>{{ item.content }}</p>
                </li>
            </ul>
        </div>
        <div class="detailInfo">
            <p class="article-title">{{ detailInfoList.detailImage[0].key }}</p>
            <van-text-ellipsis class="article-text" rows="3" :content="detailInfoList.desc" expand-text="展开"
                collapse-text="收起" />
            <div class="detailImage">
                <img v-for="item in detailInfoList.detailImage[0].list" :src="item">
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, reactive, computed } from "vue"
import { useRouter } from "vue-router";
import { getProdectDetails, getPopoversList } from "../apic/search";
import BScroll from '@better-scroll/core';
import { Toast, showToast } from 'vant';
import { collectionProduct } from '../stores/bgChange'

//收藏操作
const collectDataListProduct = collectionProduct();

let id = ref("");
const router = useRouter();
const topImagesList = ref<Array<string>>([]);
console.log(router)


const show = ref(false);
const couponShow = ref(false);
const selectColor = ref(false);
let flag = ref(true);
const onClickIcon = () => {
    if (flag.value) {
        flag.value = false;
        collectDataListProduct.addListProduct(id.value);
    } else if (!flag.value) {
        flag.value = true;
        collectDataListProduct.removeProduct(id.value)
    }
};
// 判断是否收藏
function collec() {
    collectDataListProduct.collectionDataProduct.map((item: any, index: number) => {
        console.log(item)
        if (id.value == item) {
            console.log('相同')
            collectDataListProduct.removeProduct(id)
            flag.value = false;
        }
    })
}

let screenWidth = ref(0);

const showList = (index: number) => {
    show.value = true;
    initScroll1(index);
}


const skuInfoListColorName = ref("颜色");
const skuInfoListSizeName = ref("尺码");
const skuInfoListColorId = ref(0);
const skuInfoListSizeId = ref(0);
const changeSelectColor = (id: number, name: string) => {
    if (id != skuInfoListColorId.value) {
        skuInfoListColorName.value = name;
        skuInfoListColorId.value = id;
    } else {
        skuInfoListColorName.value = "颜色";
        skuInfoListColorId.value = 0;
    }
}
const changeSelectSize = (id: number, name: string) => {
    if (id != skuInfoListSizeId.value) {
        skuInfoListSizeName.value = name;
        skuInfoListSizeId.value = id;
    } else {
        skuInfoListSizeName.value = "尺码";
        skuInfoListSizeId.value = 0;
    }

}

const buyImmediately = ()=>{
    shopCarDataList.shopId = shopInfoList.shopId;
    shopCarDataList.shopName = shopInfoList.name;
    shopCarDataList.imgSrc = filterImgItem.value;
    shopCarDataList.goodsName = skuInfoList.title;
    shopCarDataList.count = goodsHowNum.value;
    shopCarDataList.price = price.nowPrice;
    shopCarDataList.isFreeMail = true;
    shopCarDataList.id = Date.now();
    if (skuInfoListColorName.value == "颜色") {
        showToast('请选择颜色');
    } else if (skuInfoListSizeName.value == "尺码") {
        showToast('请选择尺码');
    } else {
        shopCarDataList.size = skuInfoListSizeName.value;
        shopCarDataList.style = skuInfoListColorName.value;
        console.log(shopCarDataList);
        let test = [shopCarDataList];
        localStorage.buyData = JSON.stringify(test) ;
        console.log(shopCarDataList);
        router.push({name:'confirmorder'})
    }
}
// 增加数量
const goodsHowNum = ref(1);
const clickLeft = () => {
    goodsHowNum.value--;
    if (goodsHowNum.value < 1) {
        goodsHowNum.value = 1;
    }
}


let shopCarDataList = reactive({
    shopId: "",
    shopName: "",
    imgSrc: "",
    goodsName: "",
    count: 1,
    size: "",
    price: "",
    isFreeMail: true,
    style: "",
    id: 0,
})
// 向购物车中添加商品
// 确保historyLists是一个字符串数组
let historyShopCartList = ref([{
    shopId: "",
    shopName: "",
    imgSrc: "",
    goodsName: "",
    count: 1,
    size: "",
    price: "",
    isFreeMail: true,
    style: "",
    id: 0,
}]);
const addShopingInformation = () => {
    shopCarDataList.shopId = shopInfoList.shopId;
    shopCarDataList.shopName = shopInfoList.name;
    shopCarDataList.imgSrc = filterImgItem.value;
    shopCarDataList.goodsName = skuInfoList.title;
    shopCarDataList.count = goodsHowNum.value;
    shopCarDataList.price = price.nowPrice;
    shopCarDataList.isFreeMail = true;
    shopCarDataList.id = Date.now();
    if (skuInfoListColorName.value == "颜色") {
        showToast('请选择颜色');
    } else if (skuInfoListSizeName.value == "尺码") {
        showToast('请选择尺码');
    } else {
        // // 先进行去重
        let historyListshops = localStorage.shopCarData || "[]";
        historyListshops = JSON.parse(historyListshops);
        historyShopCartList.value = historyListshops;

        shopCarDataList.size = skuInfoListSizeName.value;
        shopCarDataList.style = skuInfoListColorName.value;


        if (historyShopCartList.value.length > 0) {
            historyShopCartList.value = historyShopCartList.value.filter(s => {
                return s.style != shopCarDataList.style || s.size != shopCarDataList.size;
            })
        }



        // 将刚才的数据添加到最前面
        historyShopCartList.value.unshift(shopCarDataList);

        // 将数据同步到localStorage中
        localStorage.shopCarData = JSON.stringify(historyShopCartList.value);
        // 退出遮罩层
        selectColor.value = false;

        showToast('添加成功');

    }

}



let price = reactive({
    priceTags: [{
        text: "",
    }],
    nowPrice: "",
    currency: "",
    sales: "",
});

let skuInfoList = reactive({
    title: "",
    props: [{
        label: "",
        list: [{
            name: "",
            styleId: 0,
            sizeId: 0,
        }]
    }],
    skus: [{
        sizeId: 0,
        styleId: 0,
        img: "",
        stock: 0,
    }]
})

let shopInfoList = reactive({
    name: "",
    shopId: "",
})

let detailInfoList = reactive({
    desc: "",
    detailImage: [{
        key: "",
        list: [""],
    }],
})

let rateInfoV2List = reactive({
    list: [{
        user: {
            uname: "",
            avatar: "",
        },
        created: 0,
        content: "",
    }],
    cRate: 0,
    rateTags: [{
        value: "",
        num: 0,
    }],
    cScore: "",
});

let popoversList = reactive({
    popovers: [{
        data: {
            effect: "",
            limit: "",
            limitDesc: "",
            validTime: "",
            highlightCouponDesc: {
                content: "",
            }
        }
    }],
    outers: [{
        text: "",
    }]
});

let filterInventory = ref(0);
let filterImgItem = ref("");

let freeSize = computed(()=>{
 return skuInfoListSizeName.value = "均码";

})
let filterImg = computed(() => {

    let targetImg = skuInfoList.skus.filter((e) => {
        return e.styleId == skuInfoListColorId.value;
    });

    let targetImg1 = skuInfoList.skus.filter((e) => {
        return e.styleId == skuInfoListColorId.value && e.sizeId == skuInfoListSizeId.value;
    });

    let targetImg2 = skuInfoList.skus.filter((e) => {
        return e.sizeId == skuInfoListSizeId.value;
    });

    if (targetImg2.length && !targetImg.length) {
        filterInventory.value = 0;
        for (let i = 0; i < targetImg2.length; i++) {
            filterInventory.value += targetImg2[i].stock;
        }
    }

    if (targetImg1.length) {
        filterInventory.value = targetImg1[0].stock;
        filterImgItem.value = targetImg[0].img;
        return targetImg[0].img;
    }
    if (targetImg.length && !targetImg1.length) {
        filterInventory.value = 0;
        for (let i = 0; i < targetImg.length; i++) {
            filterInventory.value += targetImg[i].stock;
        }
        filterImgItem.value = targetImg[0].img;
        return targetImg[0].img;
    }

    filterImgItem.value = topImagesList.value[0];
    return topImagesList.value[0];
})

// 将时间戳转化为日期的格式
const formatDate = (created: number) => {
    // 由于这里的时间戳是10位，所以要补0，改成13位
    created = Number(created + "000");
    const date = new Date(created);
    const year = date.getFullYear();
    const month = date.getMonth() + 1; // 月份从0开始，需要加1
    const day = date.getDate();
    return `${year}-${addZero(month)}-${addZero(day)}`
}

// 若当前的数字小于0，则补0
const addZero = (num: number) => {
    return num < 10 ? "0" + num : num;
}
onMounted(async () => {
    console.log('hhh',id)
    console.log('收藏数据',collectDataListProduct.collectionDataProduct);

    
    id.value = router.currentRoute.value.query.id as string;

    let data = await getProdectDetails(id.value);
    let data1 = await getPopoversList(id.value);

    topImagesList.value = data.topImages;
    skuInfoList = data.skuInfo;
    price = data.normalPrice;
    detailInfoList = data.detailInfo;
    rateInfoV2List = data.rateInfoV2;
    popoversList = data1.data.flushKey.data;
    shopInfoList = data.shopInfo;



    // 页面更新渲染完毕,实例化BetterScroll
    nextTick(initScroll);
    screenWidth.value = window.innerWidth;
    // 收藏显示
    collec()
})



// BScroll 父容器dom元素
const scrollEl = ref<HTMLElement>()
const scrollEl1 = ref<HTMLElement>()

// BS实例对象
const bs = ref<BScroll>();

const initScroll = () => {
    if (!bs.value) {
        bs.value = new BScroll(scrollEl.value!, {
            scrollX: true, // 横向滚动
            scrollY: false,
            click: true, // 内部子元素可以被点击
        })
    }
}

const initScroll1 = (index: number) => {
    nextTick(() => {
        let bs1Value = new BScroll(scrollEl1.value!, {
            scrollX: true, // 横向滚动  
            scrollY: false,
            startX: index * -screenWidth.value,
            momentum: false,
            bounce: false,
        })

        bs1Value.on("scrollStart", () => {
            screenWidth.value = window.innerWidth;
            let direction = bs1Value.movingDirectionX;
            bs1Value.once('scrollEnd', () => {
                if (direction == 1 && index < topImagesList.value.length - 1) {
                    index += 1;
                } else if (direction == -1 && index > 0) {
                    index -= 1;
                }
                bs1Value.scrollTo((index) * -screenWidth.value, 0, 500);
                direction = 0;
            })
        })
    })
}
</script>

<style lang="scss">
.left-attow {
    .van-button__content {
        color: #f46;
    }
}

.selectColor {
    padding-top: 25vw;
    padding-bottom: 50px;

    .select-topList {
        padding: 20px;
        position: fixed;
        top: 37vh;
        left: 0;
        background-color: #fff;
        width: 100vw;
        height: 100px;

        img {
            width: 24vw;
            height: 32vw;
            position: absolute;
            top: -30px;
        }

        .select-topList-text {
            margin-left: 27vw;
            font-size: 12px;

            p {
                padding: 4px 0;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .selectStyle {
                span {
                    color: #f46;
                }
            }

            h2 {
                font-size: 20px;
                margin-bottom: 8px;
            }
        }
    }

    .select-bottom {
        position: fixed;
        bottom: 0;
        left: 0;

        button {
            width: 50vw;
            display: inline-block;
            border: none;
            height: 50px;
            font-size: 14px;
        }

        .cart {
            background-color: #FFEEEE;
            color: #f46;
        }

        .now-buy {
            background-color: #FF478E;
            color: #fff;
        }
    }
}


.production-myStepper {
    display: flex;
    align-items: center;

    .production-stepper-left,
    .production-stepper-right,
    .production-mynumber {
        width: 50px;
        height: 30px;
        border: 1px solid #ccc;
        text-align: center;
        line-height: 30px;
        margin-bottom: 10px;
    }

}

.select {
    display: flex;
    justify-content: space-between;
    padding: 10px 0;
    font-size: 14px;

    p {
        color: #bbb;

        span {
            display: inline-block;
            width: 280px;
            color: #f46;
            margin-left: 10px;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
            vertical-align: -2px;
        }
    }
}

.buoy-item-box {
    h2 {
        font-size: 16px;
        text-align: center;
        padding-top: 15px;
        padding-bottom: 10px;
        font-weight: bold;
    }

    .remind {
        margin: 10px;
        background-color: #F6F6F6;
        padding: 5px;
        border-radius: 999px;
        padding-left: 15px;
    }
}

.buoy-box {
    display: flex;
    position: relative;
    padding: 5px 10px;

    &::after {
        width: 15px;
        height: 15px;
        content: "";
        border-radius: 50px;
        position: absolute;
        bottom: -3px;
        left: 228px;
        background-color: #fff;
    }

    &::before {
        width: 15px;
        height: 15px;
        content: "";
        border-radius: 50px;
        position: absolute;
        top: -3px;
        left: 228px;
        background-color: #fff;
    }

    .buoy {
        position: absolute;
        left: 10px;
        top: 5px;
        background-color: #f46;
        padding: 4px 12px;
        font-size: 12px;
        color: #fff;
        border-radius: 6px 0 7px;
    }

    .left-area {
        background-color: #FFEDEC;
        width: 60vw;
        height: 25vw;
        border-radius: 10px;
        border-right: 2px dotted #f46;
        padding: 0 10px;

        .left-area-title {
            color: #f46;
            font-size: 26px;
            margin-top: 30px;

            span {
                font-size: 12px;
            }
        }

        .left-area-data {
            margin-top: 10px;
            color: #666;
        }
    }

    .right-area {
        background-color: #FFEDEC;
        width: 34vw;
        height: 25vw;
        border-radius: 13px;
        text-align: center;

        button {
            background-color: #FF4469;
            color: #fff;
            width: 100px;
            border: none;
            height: 40px;
            border-radius: 999px;
            margin-top: 7.5vw;
            font-size: 14px;
        }
    }
}

.price-box1 {
    font-size: 12px;
    padding: 10px 10px 50px;
    box-sizing: border-box;

    .evaluate-title {
        font-size: 14px;
        font-weight: bold;
        display: flex;
        justify-content: space-between;
        padding: 15px 0;

        .evaluate-arctial {
            font-size: 16px;
        }

        .evaluate-score {
            color: #f25;
        }
    }

    .evaluate-button {
        display: flex;
        padding: 0 0 15px;
        flex-wrap: wrap;

        li {
            padding: 5px 10px;
            background-color: #eee;
            border-radius: 5px;
            margin-right: 5px;
            margin-bottom: 10px;
        }
    }

    .coupon {
        padding: 10px 0;
        display: flex;
        justify-content: space-between;
        margin-right: -5px;
        color: #f46;

        .coupon-title {
            padding: 3px;
            background-color: #FFE8EE;
            border-radius: 3px;
        }
    }

    .evaluation-area {
        overflow: auto;
        display: flex;
        white-space: nowrap;

        li {
            display: inline-block;
            // width: 100vw;
            background-color: #FAFAFA;
            padding: 15px;
            margin-right: 15px;
            flex: 1;

            .evaluation-area-title {
                display: flex;
                align-items: center;
                margin-bottom: 10px;

                img {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    margin-right: 10px;
                }

                .name {
                    font-size: 14px;
                    font-weight: bolder;
                    margin-bottom: 10px;
                }

                .data {
                    font-size: 10px;
                    color: #aaa;
                }
            }
        }
    }

    .article-title {
        font-size: 16px;
        font-weight: bold;
        padding: 10px 0;
    }

    .article-text {
        padding-bottom: 10px;
    }

    .title {
        margin-top: 10px;
        font-size: 16px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding-bottom: 15px;
        border-bottom: 8px solid #F9F9F9;

    }

    .detailImage {
        width: 100%;

        img {
            width: 100%;
            vertical-align: middle;
        }
    }

    .detailTitle {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #666;

        .price-num {
            display: flex;

            .price1 {
                font-size: 20px;
                font-weight: bold;
                color: #000;
                vertical-align: -2px;
                margin-right: 5px;
            }

            .active {
                color: #f25;
                background-color: #FFE8EE;
                padding: 2px;
            }
        }
    }
}

.select-color {
    padding: 10px 20px;
    border-bottom: 1px solid #ccc;

    .select-color-title {
        color: #666;
        padding: 0px 0 10px;
    }

    .select-size-list {
        display: flex;
        flex-wrap: wrap;

        p {
            padding: 5px 10px;
            border: 1px solid #ccc;
            margin: 0 10px 10px 0;
            border-radius: 5px;

            &.active {
                color: #f46;
                border-color: #f46;
            }
        }
    }
}

.project-details-box {
    width: 100vw;
    background-color: #F1F1F1;

    .bottom-bar {
        z-index: 11;
    }

    .van-popup--center {
        max-width: none;
    }

    .wrapper1 {
        width: 100vw;
        overflow: hidden;

        ul {
            white-space: nowrap;

            li {
                width: 100vw;
                display: inline-block;

                img {
                    width: 100%;
                    height: 100%;
                    vertical-align: middle;
                }
            }
        }
    }

    .wrapper {
        width: 100vw;
        overflow: hidden;

        ul {
            white-space: nowrap;
            display: flex;
            align-items: center;

            li {
                width: 69vw;
                display: inline-block;
                margin-right: 3vw;
                margin-top: 3vw;

                img {
                    width: 100%;
                    height: 100%;
                    vertical-align: middle;
                }
            }
        }
    }
}
</style>