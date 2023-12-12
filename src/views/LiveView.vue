<template>
    <div>
        <!-- 搜索栏 -->
        <van-search v-model="keyWord" show-action placeholder="冬季连衣裙搭配" shape="round" :clearable="false">
            <template #action>
                <van-icon @click="gotoShop" name="shopping-cart-o" size="20" />
            </template>
        </van-search>

        <div class="lives">
            <!-- nav标签页 -->
            <van-tabs v-model:active="active" :animated="true" title-active-color="#ff5777" line-width="80"
                @click-tab="onNavHadle(liveList[active].id)" sticky>
                <!-- <van-tab title="关注" v-show="attentionlist.attention">
                    <LiveComponent :liveData="attentionlist.attention" />
                </van-tab> -->
                <van-tab v-for="(item, index) in liveList" :key="index" :title="item.name">
                    <!-- 下拉刷新,上拉加载 -->
                    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
                        <van-list v-model:loading="loading" :finished="finished" finished-text="我也是有底线的喔o(〃＾▽＾〃)o"
                            @load="onLoad" offset="100">
                            <LiveComponent :liveData="liveData" />
                        </van-list>
                    </van-pull-refresh>
                    <!-- <LiveComponent :liveData="liveData" /> -->
                </van-tab>
            </van-tabs>
            <p class="bottom-text" v-show="filterShow">暂时没有直播间</p>
        </div>
    </div>
</template>

<script setup lang="ts" name="live">
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import LiveComponent from "@/components/LiveComponent.vue";
import { getLiveBroadcastSort, getLiveList } from '../apic/live-data';
import type { LiveSortTabs, LiveList } from '../typings';
import { useAttention } from '../stores/bgChange';
const router = useRouter();
let keyWord = ref('');

const attentionlist = useAttention()
const active = ref(0);
const liveList = ref<Array<LiveSortTabs>>([])
const page = ref(1)
const liveData = ref<Array<LiveList>>([])
const liveId = ref(1);
let loading = ref(true);
let finished = ref(false);
let refreshing = ref(false);
let filterShow = ref(false);
//获取关注主播数据


onMounted(async () => {
    //首页导航
    let { data } = await getLiveBroadcastSort();
    // console.log('直播分类数据', data)
    liveList.value = data.tabs.items;
    page.value = 1;
    getLivesList();
    // console.log(liveList.value);
    // console.log("assasas",attentionlist.attention);

});

// 点击跳转相关
function gotoShop() {
    keyWord.value = '';
    router.push({ name: 'shop' })
}

const getLivesList = (async () => {
    let { data } = await getLiveList(liveId.value, page.value);
    // console.log(data);
    if (page.value > 1) {
        liveData.value = [...liveData.value, ...data?.lives];
    }
    if (data.lives.length == 0) {
        loading.value = false
        finished.value = true
        filterShow.value = true
    }
    if (liveData.value.length == 0) {
        liveData.value = [...data?.lives, ...liveData.value];
        loading.value = false
        finished.value = false
        filterShow.value = true
    }
    // liveData.value = [...data?.lives, ...liveData.value];
    loading.value = false
    filterShow.value = false
    refreshing.value = false
    finished.value = true
    // console.log("a",liveData.value);
    // console.log("b",attentionlist.attention);

})


const onNavHadle = function (i: number) {
    //点击事件切换nav改变直播类型ID并传值
    // if (liveId.value) {
    //     page.value = 1;
    //     liveId.value = i;
    //     liveData.value = [];
    //     getLivesList();
    // }
    page.value = 1;
    liveId.value = i;
    liveData.value = [];
    getLivesList();
    // finished.value = true
}

//上拉加载

const onLoad = async () => {
    page.value++
    await getLivesList();
    finished.value = true;
}
// 下拉刷新
const onRefresh = () => {
    finished.value = false;
    page.value = 1
    liveData.value = [];
    loading.value = true;
    getLivesList()
    // onLoad()
}

</script>

<style lang="scss">
.lives {
    margin-bottom: 60px;

    .van-tab {
        font-size: 15px;
        border-bottom: 1px solid #ececec;
    }

    .van-tab--active {
        font-size: 17px;
        font-weight: 600;
    }

    .van-tabs__line {
        background-color: #ff5777;
    }

    .bottom-text {
        font-size: 14px;
        text-align: center;
        margin-top: 15px;
        margin-bottom: 65px;
    }
}

// .hh{
//     height: 70vh;
//     // margin-bottom: 200px;
//     // z-index: 1000;
//     // padding-bottom: 100px;
// }
</style>