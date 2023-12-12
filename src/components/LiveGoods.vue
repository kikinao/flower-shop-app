<!-- 直播间商品列表 -->
<template>
    <div class="sell-bag" v-show="goodsList">
        <div class="goods-count">全部商品 {{ goods?.length }}</div>
        <div class="goods-item-list-wrap">
            <div class="goods-item flex" v-for="(g, index) in goods" :key="index">
                <div class="goods-img" :style="{ backgroundImage: `url(${g.image})` }">
                    <div class="goods-index">{{ goods.length - index }}</div>
                </div>

                <div class="goods-msg-wrap">
                    <div class="goods-msg">
                        <div class="goods-tag-list">
                            <div class="icon-seckill goods-info-item-m icon-seckill-ing  f-main-center f-cross-center "
                                v-if="g.seckill">秒杀中</div>
                            <div class="icon-seckill goods-info-item-m  f-main-center f-cross-center" v-else>待秒杀</div>
                        </div>
                        <div class="goods-title">{{ g.title }}</div>
                    </div>
                    <!-- {{ g.seckill }} -->
                    <div class="goods-btn-wrap">
                        <div class="goods-price-wrap">￥{{ (g.defaultPrice / 100).toFixed(2) }}</div>
                        <div class="to-buy-btn" @click.stop="goShopping(index)">
                            <van-button color="linear-gradient(to right, #ff6034, #ee0a24)">
                                去购买
                            </van-button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div class="buy-bag" v-show="!goodsList">
        <div class="close" @click="onClose">
            <van-icon name="cross" color="#989898" size="22" />
        </div>
        <!-- 商品信息 -->
        <div class="goods-info">
            <div class="goods-pic" v-if="skuBarInfo?.length > 0"
                :style="{ backgroundImage: `url(${skuBarInfo[colorIndex].image})` }"></div>
            <div class="goods-pic" v-else :style="{ backgroundImage: `url(${shopData?.image})` }"></div>

            <div class="goods-detail">
                <div class="title-wrap">
                    <div class="goods-status">
                        <div class="goods-index">{{ count }}号</div>
                        <div class="goods-tag goods-tag--seckill">秒杀中</div>
                    </div>
                    <div class="goods-title">{{ shopData?.title }}</div>
                </div>
                <div class="goods-price-wrap">￥{{ (shopData?.defaultPrice / 100).toFixed(2) }}</div>
            </div>
        </div>
        <!-- 商品底部信息 -->
        <div class="sku-content">
            <div class="sku-content--scroll">
                <div class="scroll">
                    <div class="prop">
                        <!-- 颜色与尺码 -->
                        <div class="prop-rows" v-for="(item, index) in goodDetails" v-if="goodDetails?.length > 0">
                            <div class="prop-rows--title">{{ item.label }}</div>
                            <div class="prop-rows--content">
                                <div class="prop-list">
                                    <div class="prop-item" v-for="(co, i) in goodDetails[index]?.list"
                                        @click="Handover(co.type, i, co.index)"
                                        :class="{ active: co.index == arr[0] || co.index == arr[1] }">{{ co.name }}</div>
                                    <!-- {{ goodDetails.list }} -->
                                </div>
                            </div>
                        </div>
                        <!-- 数量 -->
                        <div class="number">
                            <div class="number-title">数量</div>
                            <div class="number-calculator">
                                <van-stepper v-model.number="value" theme="round" button-size="30" input-width="50"
                                    integer />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
            <van-action-bar @click="BuyHandle">
                <van-action-bar-button color="#be99ff" type="warning" text="加入购物车" @click.stop="addShopingInformation" />
                <van-action-bar-button color="#7232dd" type="danger" text="立即购买" @click="buyImmediately" />
            </van-action-bar>
        </div>
    </div>
</template>

<script setup lang="ts">
import { showToast } from 'vant';
import { useRouter } from 'vue-router';
import { onMounted, ref, reactive } from 'vue';
import { getGood } from '../apic/live-data'
const props = defineProps(["goods", "userName"]);
const shopData = ref();
const goodsList = ref(true);
// const showGood = ref(false);
const count = ref();
const goodDeta = ref();
const router = useRouter();
const value = ref(1);
// 颜色尺码信息
const goodDetails = ref([] as any);
//颜色对应的图片
const skuBarInfo = ref([] as any);
//颜色高亮
const colorIndex = ref(0);
// 尺码高亮
const sizeIndex = ref(0);
const token = ref('');
//颜色信息
const ChoiceColor = ref("颜色");
//尺寸信息
const ChoiceSize = ref("尺码")


// const activeIndex = ref(1);
// 高亮数组
const arr = ref([0, 0]);
onMounted(() => {
    token.value = localStorage.token;
    // console.log(props.goods);
})

const onClose = () => {
    arr.value = [0, 0];
    // showGood.value = false;
    goodsList.value = true;
    shopData.value = [];
    ChoiceColor.value = "颜色";
    ChoiceSize.value = "尺码";
}

const getShopDetail = async (id: string) => {
    let { data } = await getGood(id);
    goodDeta.value = data.result;
    goodDetails.value = data.result.skuInfo.props;
    skuBarInfo.value = data.result.skuBarInfo.list

}

const goShopping = (index: number) => {
    if (props.goods[index].seckill) {
        shopData.value = props.goods[index];
        goodsList.value = false;
        // showGood.value = true;
        count.value = props.goods.length - index;
        getShopDetail(shopData.value.itemId);
        console.log("shop", shopData.value);
        console.log(JSON.parse(localStorage.shopCarData));

    } else {
        showToast('待秒杀,客官再等等（*＾-＾*）');
    }

}

const Handover = (type: string, index: number, dataIndex: number) => {
    // activeIndex.value = dataIndex;
    if (type === 'style') {
        colorIndex.value = index;
        arr.value[0] = dataIndex;
        ChoiceColor.value = goodDetails.value[0].list[index].name;
        goodDetails.value[0].label = "已选"
        console.log("asas");
    }
    if (type === 'size') {
        sizeIndex.value = index;
        arr.value[1] = dataIndex;
        ChoiceSize.value = goodDetails.value[1]?.list[index].name;


    }
}

const BuyHandle = () => {
    if (!token.value) {
        router.push({
            name: "authorization",
        })
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
// 确保historyLists是一个字符串数组
let historyShopCartList = ref([] as Array<string>)
const addShopingInformation = () => {

    console.log(goodDetails.value);
    shopCarDataList.shopId = shopData.value.shopId;
    shopCarDataList.shopName = props.userName;
    shopCarDataList.imgSrc = shopData.value.image;
    shopCarDataList.goodsName = shopData.value.title;
    shopCarDataList.count = value.value;
    shopCarDataList.price = (shopData.value.defaultPrice / 100).toFixed(2);
    shopCarDataList.isFreeMail = true;
    shopCarDataList.id = +new Date();
    console.log(goodDetails.value);

    if (goodDetails.value) {
        if (ChoiceColor.value == "颜色" || goodDetails.value[0].label == "规格") {
            // if(goodDetails.value[0]?.label != undefined){
            showToast(`请选择${goodDetails.value[0].label}`);
            // }
        } else if (ChoiceSize.value == "尺码" && goodDetails.value.length > 1) {
            // console.log(ChoiceSize.value);

            showToast(`请选择${goodDetails.value[1].label}`)
        } else {
            let historyListshops = localStorage.shopCarData || "[]";
            historyListshops = JSON.parse(historyListshops);
            historyShopCartList.value = historyListshops;
            shopCarDataList.size = '';
            shopCarDataList.style = '';
            historyShopCartList.value.push(shopCarDataList);

            // 将数据同步到localStorage中
            localStorage.shopCarData = JSON.stringify(historyShopCartList.value);
            showToast("添加成功!")
            goodsList.value = true;
            value.value = 1;
        }
    } else {
        let historyListshops = localStorage.shopCarData || "[]";
        historyListshops = JSON.parse(historyListshops);
        historyShopCartList.value = historyListshops;
        shopCarDataList.size = ChoiceSize.value;
        shopCarDataList.style = ChoiceColor.value;

        historyShopCartList.value.push(shopCarDataList);

        // 将数据同步到localStorage中
        localStorage.shopCarData = JSON.stringify(historyShopCartList.value);
        showToast("添加成功!")
        goodsList.value = true;
        value.value = 1;
    }




}

const buyImmediately = () => {
    // let buyData = JSON.parse(localStorage.buyData || "[]");
    shopCarDataList.shopId = shopData.value.shopId;
    shopCarDataList.shopName = props.userName;
    shopCarDataList.imgSrc = shopData.value.image;
    shopCarDataList.goodsName = shopData.value.title;
    shopCarDataList.count = value.value;
    shopCarDataList.price = (shopData.value.defaultPrice / 100).toFixed(2);
    shopCarDataList.isFreeMail = true;
    shopCarDataList.id = +new Date();
    if (goodDetails.value) {
        if (ChoiceColor.value == "颜色" || goodDetails.value[0].label == "规格") {
            showToast('请选择颜色');
        } else if (ChoiceSize.value == "尺码" && goodDetails.value.length > 1) {
            showToast('请选择尺码');
        } else {
            shopCarDataList.size = ChoiceSize.value;
            shopCarDataList.style = ChoiceColor.value;
            // console.log(shopCarDataList);
            let test = [shopCarDataList];
            localStorage.buyData = JSON.stringify(test);
            // console.log(shopCarDataList);
            router.push({ name: 'confirmorder' })
        }
    } else {
        shopCarDataList.size = '';
        shopCarDataList.style = '';
        // console.log(shopCarDataList);
        let test = [shopCarDataList];
        localStorage.buyData = JSON.stringify(test);
        // console.log(shopCarDataList);
        router.push({ name: 'confirmorder' })
    }
}

</script>
<style>
.buy-bag {
    .van-stepper__input {
        background-color: snow;
    }

    .van-action-bar {
        padding: 0px 12px;
        background: none;
        margin-bottom: 15px;
    }

    .van-action-bar-button {
        height: 40px;
    }
}
</style>

<style scoped>
.sell-bag {
    display: flex;
    flex-grow: 1;
    flex-shrink: 1;
    flex-direction: column;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    position: fixed;
    bottom: 0;
    left: 10px;
    width: 355px;
    height: 430px;
    z-index: 1000;
    border-radius: 4px 4px 0 0;
    background: rgba(0, 0, 0, .55);
    backdrop-filter: blur(7.5px);
    overflow-y: scroll;

    .goods-count {
        -webkit-box-flex: 0;
        flex-grow: 0;
        flex-shrink: 0;
        padding-left: 12px;
        width: 100%;
        height: 40px;
        font-size: 15px;
        color: #fff;
        line-height: 40px;
    }

    .goods-item-list-wrap {
        height: 100%;
        overflow: scroll;

        &::-webkit-scrollbar {
            display: none;
        }

        .goods-item {
            padding: 12px;
            width: 100%;
            height: 124px;
            background-color: rgba(0, 0, 0, .5);
            display: flex;

            .goods-img {
                position: relative;
                width: 100px;
                height: 100px;
                background-repeat: no-repeat;
                background-size: cover;
                border-radius: 3px;
            }

            .goods-index {
                position: absolute;
                top: 0;
                left: 0;
                height: 24px;
                width: 25px;
                line-height: 24px;
                color: #fff;
                background-color: #413a3a;
                border-radius: 0 0 12px 0;
                font-size: 14px;
            }
        }
    }

    .goods-msg-wrap {
        margin-left: 9px;
        width: 67%;
        display: flex;
        justify-content: space-between;
        flex-direction: column;

        .goods-msg {
            flex-direction: column;
            display: flex;
        }

        .goods-tag-list {
            display: flex;
        }

        .icon-seckill-ing {
            background-image: linear-gradient(136deg, #fb872c, #fc4242) !important;
        }

        .goods-info-item-m {
            margin-bottom: 4px;
            margin-right: 2px;
        }

        .icon-seckill {
            text-align: center;
            width: 38px;
            height: 18px;
            line-height: 18px;
            font-size: 10px;
            color: #fff;
            flex-shrink: 0;
            border-radius: 2px;
            background-image: linear-gradient(90deg, #b2a9ff, #968aff);
        }

        .f-cross-center {
            -webkit-box-align: center;
            align-items: center;
        }

        .f-main-center {
            -webkit-box-pack: center;
            justify-content: center;
        }

        .goods-title {
            margin-top: 3px;
            width: 220px;
            height: 20px;
            line-height: 20px;
            font-size: 14px;
            color: #fff;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
        }

        .goods-price-wrap {
            position: relative;
            height: 20px;
            font-size: 16px;
            color: #f46;
        }

        .goods-btn-wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .van-button {
            height: 30px;
            transform: translateY(-10px);
        }
    }
}

.buy-bag {
    padding: 12px 15px;
    display: flex;
    flex-grow: 1;
    flex-shrink: 1;
    flex-direction: column;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    position: fixed;
    bottom: 0;
    left: 10px;
    width: 355px;
    height: 430px;
    z-index: 1000;
    border-radius: 4px 4px 0 0;
    background: rgba(0, 0, 0, .8);
    backdrop-filter: blur(7.5px);

    .close {
        position: absolute;
        top: 0;
        right: 6px;
    }

    .goods-info {
        width: 325px;
        height: 107px;
        border-bottom: 0.5px solid #999;
        display: flex;
    }

    .goods-pic {
        position: relative;
        width: 95px;
        height: 95px;
        border-radius: 2px;
        background-repeat: no-repeat;
        background-size: cover;
    }

    .goods-detail {
        display: flex;
        margin-left: 9px;
        padding-bottom: 8px;
        flex-direction: column;
        justify-content: space-between;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
    }

    .goods-status {
        display: flex;
        align-items: center;

        .goods-index {
            padding: 8.5px 4px;
            border-radius: 1px;
            background-color: #413a3a;
            font-size: 10px;
            color: #fff;
            height: 16px;
            line-height: 1;
            display: flex;
            align-items: center;
            text-align: center;
        }

        .goods-tag {
            margin-left: 3px;
            padding: 8.5px 3px;
            height: 14px;
            border-radius: 2px;
            font-size: 10px;
            color: #fff;
            text-align: center;
            display: flex;
            align-items: center;
        }

        .goods-tag--seckill {
            background-image: linear-gradient(116deg, #fb872c, #fc4242);
        }
    }

    .goods-title {
        margin-top: 5px;
        max-width: 220px;
        width: fit-content;
        height: 17.5px;
        line-height: 17.5px;
        font-size: 14px;
        color: #fff;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .goods-price-wrap {
        position: relative;
        height: 20px;
        font-size: 16px;
        color: #f46;
    }

    .sku-content {
        max-height: 75%;
    }

    .sku-content--scroll {
        overflow: auto;
        max-height: 225px !important;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .scroll {
        padding: 0 7.5px;
        overflow: auto;

        &::-webkit-scrollbar {
            display: none;
        }
    }

    .prop {
        margin-bottom: 5px;
    }

    .prop-rows {
        margin-top: 7.5px;
    }

    .prop-rows--title {
        line-height: 12px;
        font-size: 12px;
        color: #fff;
    }

    .prop-rows--content {
        margin-top: 5px;
    }

    .prop-list {
        font-size: 16px;
    }

    .prop-item {
        display: inline-block;
        border: none;
        border: 1px solid #bbb;
        line-height: 26px;
        padding: 0 15px;
        border-radius: 3px;
        margin-right: 10px;
        margin-bottom: 10px;
        font-size: 12px;
        cursor: pointer;
        white-space: nowrap;
        text-align: center;

        &:not(.active) {
            color: #fff;
            background: #413a3a;
            border: none;
        }

        &.active {
            color: #ed4566;
            border-color: #ed4566 !important;
        }
    }

    .number {
        margin-top: 10px;
        padding: 0 7.5px;
        margin-bottom: 15px;

        .number-title {
            line-height: 12px;
            font-size: 12px;
            color: #fff;
        }

        .number-calculator {}
    }
}
</style>