<template>
    <div class="livePlayBack-box" :data-explainId="explainId">
        <!-- <div class="backImg" :style="{ backgroundImage: `url(${firstFrame})` }">
        </div> -->
        <div class="top-nav">
            <div class="author-about" data-authorId="authorId">
                <van-image width="35" height="35" :round="true" :src="authorImg" />
                <div class="author-text">
                    <div class="author-name">
                        {{ authorName }}
                    </div>
                    <div class="author-weight">
                        <p>{{ authorHeight }}cm</p>
                        <p>{{ authorWeight }}kg</p>
                    </div>
                </div>
                <div class="attention">
                    <van-icon name="plus" color="white" size="12" />
                    <p>关注</p>
                </div>
            </div>
            <div class="btns">
                <div class="search">
                    <van-icon name="search" color="#ffffffcb" size="20" @click="router.replace({ name: 'search' })" />
                </div>
                <div class="esc-btn" @click="router.go(-1)">
                    <van-icon name="cross" color="#ffffffcb" size="18" />
                </div>
            </div>
        </div>
        <div class="bottom">
            <div class="bottom-head">
                <div class="bottom-left">
                    <!-- 插槽 -->
                    <slot name="barrage"></slot>
                </div>
                <div class="bottom-right">
                    <div class="comment" @click="changeShowBtn">
                        <van-icon class="myIcon comment-icon" color="white" size="16" name="comment" />
                        <p>买家评论</p>
                        <span class="num">{{ totalNum }}</span>
                    </div>
                    <div class="collection" @click="collectionList">
                        <div v-show="flag">
                            <van-icon class="myIcon" color="white" size="16" name="star" />
                            <p>收藏</p>
                        </div>
                        <div v-show="!flag">
                            <van-icon class="myIcon" color="#f46" size="16" name="star" />
                            <p>已收藏</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="videoKey" v-if="isBenefitPointList">
                <!-- 插槽 -->
                <slot name="slotVideoKey">
                </slot>
            </div>
            <div class="bottom-foot" :data-goodsId="goodsId" @click="changeShopShowBottom">
                <div class="goods">
                    <van-image width="50" height="50" radius="5" :src="goodsImg" />
                    <div class="goods-text">
                        <div class="goods-name">
                            <p>{{ goodsName }}</p>
                            <div class="goods-live-imgBox">
                                <van-image width="41" height="15" class="myGoodsImg" radius="5" :src="e.img"
                                    v-for="(e, i) in goodsLiveImgArr" :key="i" />
                            </div>
                        </div>
                        <div class="goods-price">
                            <p>¥{{ goodsPrice }}</p>
                        </div>
                    </div>
                </div>
                <div class="purchase">
                    立即购买
                </div>
            </div>
            <!-- 插槽 -->
            <slot name="slotPlay">
            </slot>
        </div>

        <!-- 评论区弹出框 -->
        <van-popup v-model:show="showBottom" round position="bottom" :style="{ height: '65%' }" class="mycommentBox">
            <div class="commentTop">
                <div class="top-text">
                    <p class="buy">购买评价<span class="num">{{ commentNumber }}</span></p>
                    <span class="shopMuch">{{ soldCount }}</span>
                </div>
                <div class="comment-author">
                    <div class="comment-author-left">
                        <van-image round width="40" height="40" :src="authorImg" />
                        <div class="comment-author-text">
                            <p>{{ authorName }}</p>
                            <span>主播身高体重:{{ authorHeight }}cm {{ authorWeight }}kg</span>
                            <span class="comment-attention">
                                关注
                            </span>
                        </div>
                    </div>
                    <div class="comment-author-right">
                        <van-icon name="service-o" size="20" style="margin-left: 15px;" />
                        <p>商品客服</p>
                    </div>
                </div>
            </div>
            <div>
                <p class="reminder" v-if="commentList.length == 0">暂时还没有人购买哦~</p>
                <div class="comment-count">
                    <div class="item" v-for="e in commentList" :key="e.userId">
                        <van-image round width="30" height="30" :src="e.avatar" />
                        <div class="customer-text">
                            <div class="customer-about">
                                <p class="name">{{ e.userName }}</p>
                                <van-image v-if="e.userVipLevelInfo?.cover" class="lvImg" round width="14" height="14"
                                    :src="e.userVipLevelInfo.cover" />
                                <span class="back-customer" v-if="e.isRepeatConsumer">回头客</span>
                            </div>
                            <p class="customer-comment">
                                {{ e.content }}
                            </p>
                            <div class="imgBox">
                                <van-image radius="10" width="100" height="100" :src="imgSrc"
                                    v-for="(imgSrc, i) in e.images" :key="i" class="customer-img" />
                            </div>
                            <p class="buy-things">
                                <span class="buy-time">{{ e.time }}</span>
                                <span class="buy-goods">
                                    {{ e.style }}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </van-popup>

        <!-- 购买商品弹出框 -->
        <van-popup v-model:show="shopShowBottom" position="bottom"
            :style="{ height: '70%', width: '94%', backgroundColor: 'rgba(0, 0, 0, 0.7)', marginLeft: '3%', borderRadius: '8px', padding: '10px', color: 'white' }"
            :overlay-style="{ backgroundColor: 'rgba(0, 0, 0, 0.55)' }">
            <div class="goods-top">
                <div class="goods-top-head">
                    <van-image width="80" height="80" radius="10" :src="allImgSrc" />
                    <div class="goods-top-right">
                        <div class="top-imgBox">
                            <div class="reputation" :style="{ backgroundImage: `url(${dsrBgImg})` }">
                                <p>主播口碑<span>{{ dsrScore }}</span></p>
                            </div>
                            <div class="reputation-imgBox">
                                <van-image width="35" height="15" class="myReputationImg" radius="3" :src="e.img"
                                    v-for="(e, i) in goodsLiveImgArr" :key="i" />
                            </div>
                        </div>
                        <div class="top-title">
                            <p class="top-goods-name">{{ shopGoodsData?.skuInfo.title }}</p>
                            <p class="top-goods-price">¥{{ goodsPrice }}</p>
                            <div class="icon-box">
                                <div class="thecomment">
                                    <van-icon name="comment-o" size="14" />
                                    <p>评论<span>{{ totalNum }}</span></p>
                                </div>
                                <div class="help">
                                    <van-icon name="service-o" size="14" />
                                    <p>客服</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <van-image width="100%" height="27" radius="10" :src="shopGoodsData?.priceBannerOnly.imageURL" />
            </div>
            <div class="goods-middle">
                <div class="goods-color">
                    <p class="goods-middle-title">颜色</p>
                    <div class="goods-content">
                        <!-- 如果颜色为空的占位↓ -->
                        <div :class="[{ active: colorActive == 0 }, 'goods-item']" v-if="!shopGoodsData?.skuBarInfo.list"
                            @click="addColorActiveClass(0, shopGoodsData?.webImOptionInfo.option.img!, '主播同款')">
                            <van-image width="28" height="28" radius="4" :src="shopGoodsData?.webImOptionInfo.option.img" />
                            <span>主播同款</span>
                        </div>
                        <!-- 有数据的情况↓ -->
                        <div :class="[{ active: colorActive == i }, 'goods-item']"
                            v-for="(e, i) in shopGoodsData?.skuBarInfo.list"
                            @click="addColorActiveClass(i, e.image, e.label)">
                            <van-image width="28" height="28" radius="4" :src="e.image" />
                            <span>{{ e.label }}</span>
                        </div>
                    </div>
                </div>
                <div class="size">
                    <p class="goods-middle-title">尺码</p>
                    <div class="goods-content">
                        <!-- 如果尺码为空的占位 -->
                        <div :class="[{ active: sizeActive == 0 }, 'goods-item']" @click="addSizeActiveClass(0, '均码')"
                            v-if="shopGoodsData?.skuInfo.props.length == 1">
                            <span>均码</span>
                        </div>

                        <!-- 有尺码数据↓ -->
                        <div :class="[{ active: sizeActive == i }, 'goods-item']"
                            v-if="shopGoodsData?.skuInfo.props.length! > 1"
                            v-for="(e, i) in shopGoodsData?.skuInfo.props[1].list" @click="addSizeActiveClass(i, e.name)">
                            <p>{{ e.name }}</p>
                        </div>
                    </div>
                </div>
                <div class="howNum">
                    <p class="goods-middle-title">数量</p>
                    <div class="myStepper">
                        <div class="stepper-left" @click="clickLeft">
                            <van-icon name="minus" />
                        </div>
                        <div class="mynumber">{{ goodsHowNum }}</div>
                        <div class="stepper-right" @click="goodsHowNum++">
                            <van-icon name="plus" />
                        </div>
                    </div>
                    <!-- <van-stepper v-model="goodsHowNum" integer input-width="22" button-size="22" class="myStepper" /> -->
                </div>
            </div>
            <div class="goods-bottom">
                <button class="addShop" @click="storeDataToShop">加入购物车</button>
                <button class="gotoShop" @click="gotoBuy">立即购买</button>
            </div>
            <div class="shopCar" v-show="shopShowBottom" @click="gotoShop">
                <van-icon name="shopping-cart-o" size="16" />
            </div>
        </van-popup>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { showConfirmDialog } from 'vant';
import { getPlaybackComment, getPlaybackGoodsShop } from '../apic/live-data'
import type { getPlaybackCommentItem, getPlaybackBuyData, getPlaybackItemExplainSkuTopTitle_taglist } from '../typings';
import { useRouter } from 'vue-router';
import { collection } from '../stores/bgChange';

const router = useRouter();
//收藏操作
const collectDataList = collection();
let flag = ref(true);

// 传参内容
const props = defineProps({
    itemUrlId: {
        type: String,
    },
    actorUrlId: {
        type: String,
    },
    isBenefitPointList: {
        type: Boolean,
    },
    explainId: {
        type: [String, Number],
    },
    authorImg: {
        type: String,
    },
    authorId: {
        type: Number,
    }
    ,
    authorName: {
        type: String,
    },
    authorHeight: {
        type: Number,
        default: 163
    },
    authorWeight: {
        type: Number,
        default: 44
    },
    goodsName: {
        type: String,
    },
    goodsImg: {
        type: String,
    },
    goodsLiveImgArr: {
        type: Array<getPlaybackItemExplainSkuTopTitle_taglist>,
    },
    goodsPrice: {
        type: String,
    },
    goodsId: {
        type: [String, Number],
    }
    ,
    commentNumber: {
        type: [Number, String],
    },
    soldCount: {
        type: String
    },
    dsrScore: {
        type: String,
        default: "4.04"
    },
    dsrBgImg: {
        type: String,
        default: "https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg"
    }
});

const commentList = ref<Array<getPlaybackCommentItem>>([]);
const totalNum = ref(0);
const goodsHowNum = ref(1);
let colorName = ref('主播同款');
let sizeName = ref('均码');

// 展示图片src
let allImgSrc = ref('');
// 存储的购物车数据
const curShopCarData = {
    id: 0,
    shopId: '',
    shopName: '',
    imgSrc: '',
    goodsName: '',
    count: 0,
    size: '',
    style: '',
    price: '',
    isFreeMail: true,
};

// 限制数量
function clickLeft() {
    if (goodsHowNum.value > 1) {
        goodsHowNum.value--
    }
}

// 请求评论区数据
async function getCommentsData() {
    let { data } = await getPlaybackComment(props.itemUrlId!, props.actorUrlId!);
    commentList.value = data.commentList;
    totalNum.value = data.total;
    // console.log(commentList.value);
}

const shopGoodsData = ref<getPlaybackBuyData>();

// 请求购物数据
async function getShopGoodsData() {
    let { data } = await getPlaybackGoodsShop(props.itemUrlId!);
    shopGoodsData.value = data.result;
    // 默认的展示图片
    if (shopGoodsData.value.skuBarInfo.list) {
        allImgSrc.value = shopGoodsData.value.skuBarInfo.list[0].image
    } else {
        allImgSrc.value = props.goodsImg!;
    }

    if (shopGoodsData.value.skuBarInfo.list) {
        colorName.value = shopGoodsData.value.skuBarInfo.list[0].label;
    }
    if (shopGoodsData?.value.skuInfo.props.length! > 1) {
        sizeName.value = shopGoodsData.value.skuInfo.props[1].list[0].name
    }
    console.log()
}

onMounted(() => {
    getCommentsData();
    getShopGoodsData();
    // console.log(props.itemUrlId, props.actorUrlId);
    collec();
    console.log('uid', collectDataList.collectionData.videoId, collectDataList.collectionData.itemId)

})

// 评论区弹出框
let showBottom = ref(false);
// 商品购物弹出框
let shopShowBottom = ref(false);

function changeShowBtn() {
    showBottom.value = true;
}

function changeShopShowBottom() {
    shopShowBottom.value = true;
}
// 点击切换收藏
function collectionList() {
    if (flag.value == true) {
        // if(collectDataList.collectionData!=''){
        collectDataList.addList(collectDataList.collectionData);
        flag.value = false;
        // }
    } else {
        flag.value = true;
        collectDataList.remove(collectDataList.collectionData);
    }
}
// 判断是否收藏
function collec() {
    collectDataList.collectionDataList.map((item: any, index: number) => {
        if (collectDataList.collectionData == item) {
        // if (localStorage.collectionData == item) {
            flag.value = false;
            console.log('相同')
        }
    })
}



// 选择购物车的内容以及高亮
let colorActive = ref(0);
let sizeActive = ref(0);


function addColorActiveClass(curId: number, imgSrc: string, goodsName: string) {
    colorActive.value = curId;
    allImgSrc.value = imgSrc;
    colorName.value = goodsName;
}

function addSizeActiveClass(curId: number, curSize: string) {
    sizeActive.value = curId;
    sizeName.value = curSize;
}

// 保存数据
function saveShopData() {
    curShopCarData.id = new Date().getTime();
    curShopCarData.imgSrc = allImgSrc.value;
    curShopCarData.size = sizeName.value;
    curShopCarData.shopId = shopGoodsData.value?.shopInfo.shopId!;
    curShopCarData.goodsName = shopGoodsData.value!.skuInfo.title;
    curShopCarData.count = goodsHowNum.value;
    curShopCarData.shopName = props.authorName!;
    curShopCarData.price = props.goodsPrice!;
    curShopCarData.style = colorName.value!;
}

// 点击提交到购物车
function storeDataToShop() {
    let token = localStorage.token;
    if (!token) {
        showConfirmDialog({
            title: '还没登录噢(๑˙ー˙๑)',
            message: '现在是否去登录?',
            confirmButtonColor: "#ff4569",
        })
            .then(() => {
                router.replace({ name: 'login' })
            })
            .catch(() => {
            });
    } else {
        // 保存数据
        saveShopData();
        // console.log(curShopCarData)

        // 存入localStorage里
        let localShopCarData = JSON.parse(localStorage.shopCarData || '[]')
        // console.log(localShopCarData);
        if (localShopCarData.length > 0) {

            // 筛选已经购买的商品
            let newShopCarData = localShopCarData.filter((e: any) => {
                if (e.shopId == curShopCarData.shopId && e.goodsName == curShopCarData.goodsName && e.style == curShopCarData.style && e.size == curShopCarData.size) {
                    e.count += curShopCarData.count;
                    return e;
                }
            })

            console.log(newShopCarData)

            if (newShopCarData.length == 0) {
                localShopCarData.push(curShopCarData);
            }
        } else {
            localShopCarData.push(curShopCarData);
        }

        console.log(localShopCarData);
        localStorage.shopCarData = JSON.stringify(localShopCarData)

        shopShowBottom.value = false;
    }
}

// 跳转到购物车
function gotoShop() {
    let token = localStorage.token;
    if (!token) {
        showConfirmDialog({
            title: '还没登录噢(๑˙ー˙๑)',
            message: '现在是否去登录?',
            confirmButtonColor: "#ff4569",
        })
            .then(() => {
                router.replace({ name: 'login' })
            })
            .catch(() => {
                console.log(111)
            });
    } else {
        router.replace({ name: 'shop' })
    }
}

// 立即购买
function gotoBuy() {
    let token = localStorage.token;
    if (!token) {
        showConfirmDialog({
            title: '还没登录噢(๑˙ー˙๑)',
            message: '现在是否去登录?',
            confirmButtonColor: "#ff4569",
        })
            .then(() => {
                router.replace({ name: 'login' })
            })
            .catch(() => {
                console.log(111)
            });
    } else {
        // 保存数据
        saveShopData();
        // console.log(curShopCarData)
        let changeArr = [curShopCarData];
        localStorage.buyData = JSON.stringify(changeArr)
        router.replace({ name: 'confirmorder' })
    }
}

</script>

<style lang="scss" scoped>
.livePlayBack-box {
    font-size: 14px;
    padding: 0 10px;
    position: relative;

    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;

    // z-index: 999;
    z-index: 2;

}

.top-nav {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.85);
    display: flex;
    justify-content: space-between;
    align-items: center;
    transform: translateY(25px);

    .btns {
        display: flex;

        .esc-btn {
            margin-left: 10px;
        }
    }
}

.author-about {
    display: flex;
    align-items: center;
    padding: 5px 10px;
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 10px;

    .author-text {
        margin: 0 6px;
    }

    .author-name {
        font-weight: 700;
    }

    .author-weight {
        margin-top: 4px;
        font-size: 10px;
        font-weight: 400;
        color: rgba(255, 255, 255, 0.65);
        display: flex;

        p:first-child {
            margin-right: 6px;
        }
    }

    .attention {
        height: 25px;
        display: flex;
        align-items: center;
        padding: 0 8px;
        background-image: linear-gradient(90deg, #f6515c, #f44e7c, #f54690);
        border-radius: 999px;

        p {
            margin-left: 2px;
        }
    }
}

.bottom {
    font-size: 14px;
    padding: 0 10px;
    display: flex;
    flex-flow: column nowrap;
    background-image: linear-gradient(#00000000, #00000030, #00000050, #00000070);

    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
}

.bottom-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 5px;

    .myIcon {
        padding: 6px;
        background-color: rgba(0, 0, 0, 0.3);
        border-radius: 999px;
    }

    .comment-icon {
        margin-left: 11px;
    }

    .bottom-right {
        height: 100px;
        font-size: 12px;
        font-weight: 400;
        color: white;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        align-items: center;

        .comment {
            position: relative;
        }

        .num {
            font-size: 10px;
            padding: 1px 5px;
            border-radius: 999px;
            background-color: white;
            color: red;

            position: absolute;
            right: -2px;
            top: -8px;
        }
    }
}

.bottom-foot {
    height: 60px;
    background-color: rgba(0, 0, 0, 0.4);
    margin: 10px 0;
    padding: 5px;
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
}

.goods {
    display: flex;
    align-items: center;
}

.goods-text {
    margin-left: 10px;
    height: 50px;
    display: flex;
    flex-flow: column nowrap;
    justify-content: space-between;

    .goods-name {
        display: flex;
        flex-flow: column nowrap;
        color: white;

        p {
            width: 170px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-bottom: 5px;
        }
    }

    .goods-price {
        font-weight: 700;
        color: var(--subject-color);
    }
}

.purchase {
    height: 30px;
    line-height: 30px;
    padding: 0 12px;
    color: white;
    border-radius: 999px;
    background-image: linear-gradient(#ff4466, #ff4466);
    transform: translateY(10px) translateX(-10px);
}

.videoKey {
    background-color: rgba(0, 0, 0, 0.4);
    width: calc(100vw - 20px);
    height: 35px;
    margin-top: 10px;
    border-radius: 8px;
}

.mycommentBox {
    padding: 10px;
}

.commentTop {
    display: flex;
    flex-flow: column nowrap;
    position: relative;

    .top-text {
        display: flex;
        width: 375px;
        height: 35px;
        line-height: 35px;
        background-color: white;
        border-radius: 999px;
        z-index: 11;
        transform: translateY(-11px) translateX(-10px);
        position: fixed;
    }

    .buy {
        font-weight: 700;
        margin-left: 8px;
    }

    .num {
        font-size: 13px;
        margin-left: 2px;
    }

    .shopMuch {
        font-size: 11px;
        color: gray;
        margin-left: 8px;
        margin-top: 1px;
    }

}

.comment-author {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 35px;
    padding-bottom: 15px;
    border-bottom: 1px solid gainsboro;
}

.comment-author-left {
    display: flex;
    align-items: center;

    .comment-author-text {
        margin-left: 8px;
        font-size: 11px;
        position: relative;

        p {
            margin: 8px 0;
            font-size: 13px;
            font-weight: 700;
        }
    }

    .comment-attention {
        font-size: 11px;
        color: white;
        background-color: var(--subject-color);
        padding: 3px 9px;
        border-radius: 999px;

        position: absolute;
        top: 4px;
        right: 28px;
    }
}

.comment-author-right {
    color: var(--subject-color);
    border-left: 1px solid gainsboro;
    padding-left: 10px;

    p {
        font-size: 12px;
        margin-top: 5px;
    }
}

.customer-comment {
    max-width: 300px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}

.item {
    margin-top: 20px;
    display: flex;
}

.customer-text {
    margin-left: 10px;
    padding-bottom: 13px;
    border-bottom: 1px solid gainsboro;

    .customer-about {
        display: flex;
        align-items: center;
        margin-bottom: 6px;
    }

    .lvImg {
        align-self: center;
        margin: -2px 0 0 5px;
    }

    .back-customer {
        font-size: 11px;
        background-color: #ffdba5;
        color: #b07923;
        padding: 0 5px;
        border-radius: 999px;
        margin-top: -1px;
        margin-left: 5px;
    }

    .customer-comment {
        margin-bottom: 6px;
    }

}

.imgBox {
    margin-bottom: 8px;
    width: 300px;
    display: flex;
    flex-flow: row wrap;
    // justify-content: space-between;
    // background-color: pink;

    .customer-img {
        margin-left: 5px;
    }

    .customer-img:nth-child(3n) {
        margin-right: 0;
    }

    .customer-img:nth-child(3n-2) {
        margin-left: 0;
    }

    .customer-img:nth-child(n + 4) {
        margin-top: 5px;
    }
}

.myReputationImg {
    margin-right: 3px;
}

.goods-live-imgBox {
    margin-bottom: 3px;

    .myGoodsImg {
        margin-right: 5px;
    }
}


.buy-things {
    font-size: 11px;
    color: rgb(162, 162, 162);

    .buy-goods {
        display: inline-block;
        width: 250px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}

.goods-top {
    padding-bottom: 10px;
    border-bottom: 1px solid rgb(220, 220, 220, 0.3);
}

.goods-top-head {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
}

.goods-top-right {
    display: flex;
    flex-flow: column nowrap;
    color: white;

    .top-title {
        width: 248px;
        font-size: 11px;
    }

    .top-goods-name {
        width: 248px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .top-goods-price {
        font-size: 13px;
        line-height: 13px;
        color: var(--subject-color);
        margin: 8px 0;
    }

    .top-imgBox {
        display: flex;
        margin-bottom: 10px;
    }

    .reputation {
        font-size: 10px;
        width: 85px;
        text-indent: 5px;
        height: 15px;
        border-radius: 3px;
        line-height: 15px;
        margin-right: 5px;
        background-size: cover;
        background-repeat: no-repeat;
    }
}

.icon-box {
    display: flex;

    div {
        display: flex;
        align-items: center;
        margin-right: 25px;

        p {
            font-size: 10px;
            margin-left: 3px;
        }

        span {
            margin-left: 2px;
        }
    }
}

.goods-middle {
    max-height: 340px;

    .goods-middle-title {
        font-size: 11px;
        padding-top: 10px;
    }

    .goods-content {
        width: 94%;
        flex-flow: row wrap;
        align-items: center;
        display: flex;
    }
}

.goods-item {
    display: flex;
    align-items: center;
    background-color: #413a3a;
    border-radius: 5px;
    margin-right: 10px;
    margin-top: 10px;

    p,
    span {
        font-size: 11px;
        padding: 10px;
    }

    span {
        padding: 8px;
        margin: 0 5px;
    }

    &.active {
        outline: 1px solid var(--subject-color);
        color: var(--subject-color);
    }
}

.myStepper {
    display: flex;
    align-items: center;
    margin-top: 10px;

    .stepper-left,
    .stepper-right {
        width: 22px;
        height: 22px;
        background-color: #413a3a;
        font-size: 13px;
        line-height: 23px;
        color: gainsboro;
        text-align: center;
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
        background-color: #413a3a;
    }
}

.goods-bottom {
    display: flex;
    justify-content: space-between;

    position: absolute;
    bottom: 15px;
    left: 0px;

    button {
        font-size: 11px;
        width: 45vw;
        height: 25px;
        border-radius: 999px;
        border: none;
        outline: none;

        &:last-child {
            margin-left: 10px;
        }
    }

    .addShop {
        color: var(--subject-color);
    }

    .gotoShop {
        background-image: linear-gradient(90deg, #ff4367, #ff2889);
    }
}

.reminder {
    text-align: center;
    padding: 15px 0;
    font-size: 12px;
    color: rgb(165, 165, 165);
}

.collection {
    text-align: center;

    p {
        margin-top: 6px;
    }
}

.comment {
    p {
        margin-top: 6px;
    }
}

.shopCar {
    background-color: rgba(0, 0, 0, 0.7);
    width: 25px;
    height: 25px;
    text-align: center;
    line-height: 28px;
    border-radius: 999px;

    position: fixed;
    right: 15px;
    top: 210px;

    z-index: 20;
}
</style>