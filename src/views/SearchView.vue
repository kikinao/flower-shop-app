<template>
    <div class="search-box">
        <div class="seach-top">
            <van-icon name="arrow-left" class="back-arrow" @click="$router.go(-1)" />
            <van-search class="search" v-model="value" :clearable="false" show-action shape="round" placeholder="请输入搜索关键词"
                @search="onSearch">
                <template #right-icon>
                    <van-icon name="cross" v-show="value" @click="clearValue" />
                </template>
                <template #action>
                    <div @click="onSearch(value)">搜索</div>
                </template>
            </van-search>
        </div>
        <div class="hot-search">
            <div class="title">
                <span><van-icon name="search" /></span>
                <h2>历史记录</h2>
            </div>
            <div class="list">
                <span v-for="item in historyLists" :key="item" @click="keySearch(item)">
                    {{ item }}
                </span>
            </div>
        </div>
        <div class="hot-search">
            <div class="title">
                <span><van-icon name="star-o" /></span>
                <h2>热门搜索</h2>
            </div>
            <div class="list">
                <span v-for="item in hotSearchList" :key="item.frontword" :class="{ active: item.color }"
                    @click="keySearch(item.query)">
                    {{ item.frontword }}
                </span>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getHotSearch } from "../apic/search"
import { type HotWord } from "../typings"
import { useRouter } from "vue-router";
const router = useRouter();

const value = ref("");

let hotSearchList = ref<Array<HotWord>>([])
// 确保historyLists是一个字符串数组
let historyLists = ref([] as Array<string>)

const onSearch = (value: string) => {
    if(value){
        // 先进行去重
        if (historyLists.value.length > 0) {
        historyLists.value = historyLists.value.filter((s) => s != value);
    }

    // 将刚获取到的数据添加到最前面
    historyLists.value.unshift(value);

    // 最多只能是10个，当个数大于10时将10后面的全部删除
    if (historyLists.value.length > 10) {
        historyLists.value.length = 10;
    }

    // 将数据同步到localStorage中
    localStorage.historyList = JSON.stringify(historyLists.value);
    inquireKey(value);
    }
}
const clearValue = () => {
    value.value = "";
}

const keySearch = (keyWord: string) => {
    value.value = keyWord;
    onSearch(keyWord);
    
}
const getHistroyList = () => {
    let locationHistoryList = localStorage.historyList || "[]";
    locationHistoryList = JSON.parse(locationHistoryList);
    historyLists.value = locationHistoryList;
}
onMounted(async () => {
    let data = await getHotSearch();
    hotSearchList.value = data;
    getHistroyList();
})

const inquireKey = (keyWord:string) =>{
    router.push({name:"productList",query:{keyWord:keyWord}});
}
</script>

<style lang="scss" scoped>
.search-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: #fff;
    z-index: 1000;
}

.seach-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 10px;
    height: 55px;
    border-bottom: 1px solid #ccc;

    .back-arrow {
        flex: 0 0 20px;
        font-size: 18px;
        color: #666;
    }

    .search {
        flex: 1;
        padding-left: 2px;
        height: 30px;
    }
}

.hot-search {
    font-size: 12px;
    padding: 0 10px;

    .title {
        display: flex;
        color: #999;
        // height: 40px;
        align-items: center;
        margin-top: 10px;

        span {
            font-size: 16px;
            margin-right: 4px;
            vertical-align: -5px;
        }
    }

    .list {
        display: flex;
        flex-wrap: wrap;

        span {
            padding: 8px 10px;
            border: 1px solid #ccc;
            border-radius: 7px;
            margin-right: 10px;
            margin-top: 10px;

            &.active {
                color: #ff4466;
            }
        }
    }
}
</style>