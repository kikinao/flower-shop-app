<!-- 瀑布流（热门模块） -->
<template>
    <div class="waterfallFlowTwo">
        <van-list class="item-menu" v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <div v-masonry class="item-menu" transition-duration="0.3s" i tem-selector=".item">
                <div v-masonry-tile class="item" v-for="(item, index) in ContTwoList" :key="index"
                    @click="product(item.iid)">
                    <!-- <router-link :to="{name:}"> -->
                    <div class="picture">
                        <img class="bigPic" :src="item.img" alt="">
                        <!-- <div class="sale">已售{{ item.sale }}件</div> -->
                    </div>
                    <p class="title">{{ item.title }}</p>
                    <!-- 价格 -->
                    <div class="price">
                        <div class="livePrice">
                            <div>
                                ￥<span>{{ Math.floor(item.price) }}</span>
                                <span v-if="Math.floor(
                                    (item.price - Math.floor(item.price)) * 10
                                )">.{{ Math.floor(
    (item.price - Math.floor(item.price)) * 10
) }}
                                    <span class="decimalTwo"
                                        v-if="Math.floor((item.price - Math.floor(item.price * 10) / 10) * 100)">
                                        {{ Math.floor((item.price - Math.floor(item.price * 10) /
                                            10) * 100) }}
                                    </span>
                                </span>
                            </div>
                        </div>
                        <div class="cafv">立即购买</div>
                    </div>

                    <!-- </router-link> -->
                </div>
            </div>
        </van-list>
    </div>
</template>
<script setup lang="ts">
import { useRouter, useRoute } from "vue-router";
import { getHomeContentTwo } from '../apic/homes'
import { type ContentTwoList } from '../typings'
import { ref, nextTick, watch } from 'vue';
const router = useRouter();
const route = useRoute();

// const list = ref([]);
let ContTwoList = ref<Array<ContentTwoList>>([])
const loading = ref(false);
const finished = ref(false);
const count = ref(1)

const props = defineProps(['pid'])


// 获取数据
async function fuc(pid: string) {
    // 异步更新数据
    let HomeContentData: any = await getHomeContentTwo(pid, count.value);
    for (let i = 0; i < HomeContentData.result.wall.docs.length; i++) {
        ContTwoList.value.push(HomeContentData.result.wall.docs[i]);
    }
    // console.log(ContTwoList)
    // 加载状态结束
    loading.value = false;

    // 数据全部加载完成
    nextTick(() => {
        loading.value = false;
        count.value++;
    })
}
function product(id: string) {
    router.push({
        path: 'project-detail',
        query: {
            id: id
        }
    })
}

const onLoad = async () => {
    console.log(22, props.pid)
    fuc(props.pid)
};
// 监听路由变化，来跳转页面
watch(() => route.query.pid,
    (newVa, oldVal) => {
        // console.log(newVa, oldVal)
        if (newVa !== '666') {
            console.log(3333, props.pid)
            ContTwoList.value.length = 0;
            fuc(newVa);
        }
    },
    { immediate: true }
)

</script>

<style lang="scss">
// 瀑布流内容
.waterfallFlowTwo {
    padding: 10px 0px 10px 6px;
    box-sizing: border-box;
    width: 100vw;

    .item {
        margin-bottom: 10px;
        width: 49%;
    }

    .item:nth-child(n+1) {
        padding: 0 6px;
    }



    .picture {
        position: relative;
    }

    .bigPic {
        width: 100%;
        height: 100%;
        border-top-right-radius: 5px;
        border-top-left-radius: 5px;
        background-color: hsl(0, 0%, 87%);
    }

    // 头像部分
    .sale {
        position: absolute;
        left: 10px;
        bottom: 10px;
        color: white;
        display: flex;
        align-items: center;
        font-size: 10px;
        background-color: #ccc;
        padding: 5px 10px;

        img {
            width: 13%;
            height: 13%;
            border-radius: 50%;
            margin-right: 5px;
            border: 1px solid #fff;
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
        margin: 5px;
        line-height: 1.2;
    }

    //价格
    .price {
        display: flex;
        justify-content: space-between;
        align-items: center;
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

        .cafv {
            font-size: 10px;
            padding: 4px 8px;
            background-color: #ffecef;
            border-radius: 10px;
            text-align: center;
            color: black;
            margin-top: -2px;
        }

        .decimalTwo {
            margin-left: -1px;
        }
    }

    // .cafv{
    //     color:black;
    // }
}
</style>