<template>
    <div class="shopping-List">

        <div class="shoping-list-top">
            <span @click="$router.go(-1)">
                <van-icon name="arrow-left" />
            </span>
            <input type="text" :placeholder="keyWord" class="input" @click="router.push({
                name: 'search'
            })">
        </div>

        <div class="tabble-nav">
            <span v-for="item in titleList" @click="changeCondition(item.sortKey)"
                :class="{ 'active': item.sortKey == activeName }" :key="item.sortKey">{{ item.title
                }}</span>
            <span @click="onClickTab" v-if="titleList.length">价格 <van-icon name="arrow-down" /></span>
        </div>
        <van-popup class="price-box" v-model:show="show" round style="width: 100%; height: 25%; padding: 10px;">
            <div class="price">
                <span v-for="item in priceList" key="item" @click="changeMoney(item.min, item.max)">{{ item.min }} -
                    {{ item.max }}</span>
            </div>
            <div class="section">
                <span>区间 (元)</span>
                <input type="number" v-model="option.minPrice" :placeholder="option.minPrice.toString()">
                <span>—</span>
                <input type="number" v-model="option.maxPrice" :placeholder="option.maxPrice.toString()">
            </div>
            <van-button class="myBtn" @click="changeMoney(option.minPrice.toString(), option.maxPrice.toString())"
                color="linear-gradient(to right, #ff4268, #ff2989)">
                确认
            </van-button>
        </van-popup>
        <div v-if="wallList.length">
            <van-list v-model:loading="loading" class="shopping-details" :finished="finished" finished-text="没有更多了"
                @load="onLoad">
                <div v-for="item in wallList" :key="item.tradeItemId">
                    <shopping-view :tradeItemId="item.tradeItemId" :img="item.img" :title="item.title"
                        :leftbottom_taglist="item.leftbottom_taglist" :cfav="item.cfav" :price="item.price"
                        @click="projectDetailPage(item.tradeItemId)" />
                </div>
            </van-list>
            <van-back-top class="buttonTop" right="13vw" bottom="10vh" />
        </div>
        <div v-else>
            <div class="noshopping">
                <img src="../../assets/images/noShopping.png">
                <p>没有相关的商品结果哦 ~~</p>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from "vue"
import { useRouter } from "vue-router";
import { getKeywordSearch } from "../../apic/search"
import { type sortFilterList, type priceFilterList, type wallDocsList } from "../../typings"
import ShoppingView from "../../components/Shopping.vue"

const router = useRouter();
const show = ref(false);
const onClickTab = () => {
    show.value = true;
}

const activeName = ref('pop');
let titleList = ref<Array<sortFilterList>>([]);
let priceList = ref<Array<priceFilterList>>([]);
let wallList = ref<Array<wallDocsList>>([]);

let option = reactive({
    q: "",
    sort: "pop",
    page: 1,
    minPrice: 0,
    maxPrice: 100,
});


const loading = ref(false);
const finished = ref(false);

// 跳转到商品详情页
const projectDetailPage = (id: string) => {
    router.push({ name: "project-detail", query: { id: id } });
}
const onLoad = async () => {
    // 异步更新数据
    option.page = option.page + 1;
    let data = await getKeywordSearch(option);
    wallList.value = [...wallList.value, ...data.wall.docs];
    nextTick(() => {
        loading.value = false;
    });
    if (data.wall.docs.length == 0) {
        finished.value = true;
    }
};
const changeMoney = async (min: string, max: string) => {
    wallList.value = [];
    show.value = false;
    console.log(option.sort);
    option.minPrice = Number(min);
    option.maxPrice = Number(max);
    let data = await getKeywordSearch(option);
    wallList.value = data.wall.docs;
}
let keyWord = ref("");
onMounted(async () => {
    keyWord.value = router.currentRoute.value.query.keyWord as string;

    option.q = keyWord.value;
    let data = await getKeywordSearch(option);
    titleList.value = data.sortFilter;
    priceList.value = data.priceFilter;
    wallList.value = data.wall.docs;
})

const changeCondition = async (name: string) => {
    if (activeName.value != name) {
        window.scroll({
            top: 0,
        })
        wallList.value = [];
        activeName.value = name;
        option.sort = name;
        option.page = 1;
        let data = await getKeywordSearch(option);
        if (data.wall.docs) {
            wallList.value = data.wall.docs;
        }
    }
}

</script>

<style lang="scss">
.buttonTop {
    background-color: #ff4466;
    opacity: .8;
}

.shopping-List {
    width: 100vw;
    position: relative;
    background-color: #EFEFEF;
    padding-top: 95px;
    z-index: 15;

    .shopping-details {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        padding: 0px 8px;
    }

    .shoping-list-top {
        width: 100vw;
        display: flex;
        align-items: center;
        position: fixed;
        top: 0;
        height: 50px;
        font-size: 13px;
        background: linear-gradient(0deg, rgb(232, 188, 195) 0%, rgba(225, 148, 160, 0.978) 100%);
        z-index: 10;

        input {
            display: inline-block;
            width: 250px;
            height: 28px;
            border: none;
            border-radius: 999px;
            padding-left: 15px;
            font-size: 12px;
        }

        span {
            font-size: 15px;
            margin-left: 10px;
            margin-right: 20px;
            transform: translateY(-1px);
            color: #fff;
            font-weight: bold;
        }
    }

    .noshopping {
        width: 100vw;
        height: 87.7vh;
        text-align: center;
        padding-top: 50px;

        img {
            width: 150px;
        }

        p {
            font-size: 16px;
            margin-top: 15px;
            color: #888;
        }
    }

}

.tabble-nav {
    display: flex;
    font-size: 14px;
    justify-content: space-around;
    align-items: center;
    position: fixed;
    top: 49px;
    width: 100vw;
    height: 35px;
    background-color: #fff;
    border-bottom: 1px solid #ccc;
    z-index: 10;

    span {
        position: relative;

        &.active {
            // transform: scale(1.3);
            // font-weight: bold;

            &::after {
                display: block;
                content: "";
                width: 40px;
                position: absolute;
                border-bottom: 2px solid #f46;
                top: 18px;
                left: -6px;
            }
        }
    }
}

.price-box {
    font-size: 15px;

    .price {
        color: var(--subject-color);
        width: 330px;
        margin-top: 20px;
        display: flex;
        align-items: center;
        justify-content: space-around;
        margin-bottom: 15px;

        span {
            display: inline-block;
            width: 90px;
            height: 40px;
            text-align: center;
            line-height: 40px;
            background-color: gainsboro;
            border: 1px solid rgb(160, 160, 160);
            border-radius: 5px;
        }
    }

    .section {
        display: flex;
        height: 50px;
        align-items: center;

        span {
            margin-left: 11px;
            margin-right: 8px;
        }

        input {
            width: 85px;
            height: 30px;
            border: 1px solid #ccc;
            border-radius: 5px;
            padding-left: 10px;
            margin-left: 11px;
        }

        input:last-child {
            margin-left: 0;
        }
    }
}

.myBtn {
    font-size: 13px;
    position: absolute;
    right: 16px;
    bottom: 20px;
    width: 70px;
    height: 35px;
}
</style>