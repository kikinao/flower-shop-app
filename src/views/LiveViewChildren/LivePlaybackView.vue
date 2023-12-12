<template>
    <div class="loadingBox" :style="{ backgroundImage: `url(${loadingSrc})` }" v-show="!isReady">
        <van-loading class="myLoading" vertical type="spinner" size="50" color="#ff5967" text-size="16">
            {{ randomText }}
        </van-loading>
    </div>
    <div class="playBox" v-show="isReady">
        <video :src="videoUrl" loop :poster="coverImg" ref="video" @loadedmetadata="getTotalTime"
            @timeupdate="getCurTime"></video>
        <LivePlaybackOrPlayComponent :author-height="actorInfoList?.height" :explain-id="itemExplainList?.explainId"
            :author-id="itemExplainList?.actorId" :author-img="actorInfoList?.avatar" :author-name="actorInfoList?.name"
            :author-weight="actorInfoList?.weight" :comment-number="itemExplainList?.commentCount"
            :goods-id="itemInfoList?.itemId" :goods-img="itemInfoList?.cover" :goods-name="itemInfoList?.title"
            :goods-price="itemInfoList?.discountPrice" :is-benefit-point-list="isBenefitPoint"
            :sold-count="itemInfoList?.soldCount" :actor-url-id="actorUrlId" :item-url-id="itemUrlId"
            :goods-live-img-arr="goodsLiveImgArr" :dsr-bg-img="dsrInfoData?.dsrBgImg" :dsr-score="dsrInfoData?.dsrScore">
            <!-- 弹幕评论 -->
            <template v-slot:barrage>
                <div class="comments">
                    <div class="comments-list" ref="curCommentList">
                        <div class="comments-item" v-for="e in commentsArr" :key="e.commentId">
                            <div>
                                <van-image width="22" height="22" round :src="e.avatar" />
                            </div>
                            <div class="notice">
                                <div class="intro">{{ e.content }}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </template>

            <!-- 跳转关键video -->
            <template v-slot:slotVideoKey>
                <div class="videoKey">
                    <div class="left">
                        <van-icon name="guide-o" size="12" style="margin-left: 9px;margin-bottom: 3px;" />
                        <p>快进到</p>
                    </div>
                    <div class="right">
                        <div class="timeKey" v-for=" e  in   benefitPointList  " :key="e.doc" @click="clickToTime(e.time)">
                            <van-icon name="play-circle" size="14" />
                            <p>{{ e.doc }}</p>
                        </div>
                    </div>
                </div>
            </template>
            <!-- 进度条 -->
            <template v-slot:slotPlay>
                <div class="slider">
                    <div @click="playVideo">
                        <van-icon name="play" size="20" color="white" class="myPlayBtn" v-show="!isPlay" />
                        <van-icon name="pause" size="20" color="white" class="myPlayBtn" v-show="isPlay" />
                    </div>
                    <van-slider v-model="sliderValue" class="myslider" active-color="white" inactive-color="#ffffff70"
                        @drag-start="dragStart" @drag-end="dragEnd">
                        <template #button>
                            <div class="custom-button">
                                <div style="width: 10px;height: 10px;"></div>
                            </div>
                        </template>
                    </van-slider>
                    <div class="speed" @click="changePlaySpeed">
                        <p>{{ speedValue }}</p>
                    </div>
                </div>
            </template>
        </LivePlaybackOrPlayComponent>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, computed, nextTick, onUnmounted, watch } from 'vue';
import LivePlaybackOrPlayComponent from '../../components/LivePlaybackComponent.vue';
import { getPlaybackData } from '../../apic/live-data';
import type { getPlaybackItemExplainListItem, getPlaybackActorInfo, getPlaybackItemInfo, getPlaybackBenefitPointListItem, getPlaybackCommentsItem, getPlaybackDsrInfo } from '../../typings';
import { useRoute, useRouter } from 'vue-router';
import loadingSrc from '../../assets/images/shopingGirl.png'
const router = useRouter();
const route = useRoute();

let sliderValue = ref(0);
let speedValue = ref('倍速');
let speedCount = ref(0);
let draging = ref(false);
const isPlay = ref(false);
const video = ref();
let totalTime = ref(0);
const textArr = ['没有人比我更懂你~', '时尚E点，快乐亿点~', '最开心的三件事就是：买买买!', '追求精致生活,选择优雅购物', '正在加载中,请稍候~']


// 解决mounted无法解析ref中dom元素的bug
let isReady = ref(false);

// 获取数据
const itemUrlId = route.params?.itemUrlId as string;
const actorUrlId = route.params?.actorUrlId as string;
const curExplainId = route.params?.explainId as string;

const itemExplainList = ref<getPlaybackItemExplainListItem>();
const actorInfoList = ref<getPlaybackActorInfo>();
const itemInfoList = ref<getPlaybackItemInfo>();
const benefitPointList = ref<Array<getPlaybackBenefitPointListItem>>();
const commentsArr = ref<Array<getPlaybackCommentsItem>>();
const dsrInfoData = ref<getPlaybackDsrInfo>();
const goodsLiveImgArr = ref();
const videoUrl = ref('');
const coverImg = ref('');

const getData = async () => {
    // console.log('发起请求')
    let { data } = await getPlaybackData(itemUrlId, actorUrlId);
    // console.log(data);
    itemExplainList.value = data.itemExplainList.find(e => e.explainId == Number(curExplainId));
    videoUrl.value = itemExplainList.value?.videoInfo.h265Url as string;
    coverImg.value = itemExplainList.value?.videoInfo.cover as string;
    actorInfoList.value = itemExplainList.value?.actorInfo;
    itemInfoList.value = itemExplainList.value?.itemInfo;
    benefitPointList.value = itemExplainList.value?.videoInfo.benefitPointList;
    commentsArr.value = itemExplainList.value?.comments;
    dsrInfoData.value = itemExplainList.value?.dsrInfo;
    let arr = itemExplainList.value?.itemExplainSkuTopTitle_taglist;
    goodsLiveImgArr.value = arr?.filter((e) => e.styleType == 1);
    // console.log(goodsLiveImgArr.value)

    // 修改页面展示
    isReady.value = true;
}


const isBenefitPoint = computed(() => {
    if (benefitPointList.value) {
        return true;
    } else {
        return false;
    }
})

const randomText = computed(() => {
    const index = String(Math.random() * 3);
    const res = textArr[parseInt(index)];
    return res;
})

onMounted(() => {
    getData();
    
})

// 点击播放暂停
function playVideo() {
    if (!isPlay.value) {
        video.value.play();
        isPlay.value = !isPlay.value;
    } else {
        video.value.pause();
        isPlay.value = !isPlay.value;
    }
}

// 获取视频总时间
function getTotalTime() {
    totalTime.value = video.value?.duration;
}

// 获取当前的播放时间
function getCurTime() {
    let nowTime = video.value.currentTime;

    if (draging.value) {
        return
    }

    // 修改进度条
    sliderValue.value = (nowTime * 100 / totalTime.value);
}

// 进度条的拖动相关
// 开始拖拽不触发修改
function dragStart() {
    draging.value = true;
}

// 停止拖拽改变视频播放进度
function dragEnd() {
    video.value.currentTime = sliderValue.value / 100 * video.value.duration;
    draging.value = false;

    // 自动播放
    video.value.play();
    isPlay.value = true;
}

// 修改播放速率
function changePlaySpeed() {
    speedCount.value++;

    if (speedCount.value == 1) {
        speedValue.value = '1.5倍';
        video.value.playbackRate = 1.5;
    } else if (speedCount.value == 2) {
        speedValue.value = '2.0倍';
        video.value.playbackRate = 2;
    } else if (speedCount.value == 3) {
        speedValue.value = '倍速';
        video.value.playbackRate = 1.0;
    }

    // 清零
    speedCount.value > 2 ? speedCount.value = 0 : speedCount.value = speedCount.value;
}

// 点击跳转
function clickToTime(startTime: number) {
    video.value.currentTime = startTime / 1000;
    video.value.play();
    isPlay.value = true;
}

let curCommentList = ref();
let count = ref(0)
let setComment: any = null
let height = ref(0);
let curtranslateY = ref(0);

onMounted(() => {
    nextTick(() => {
        playComments();
    })
})

// 评论轮播
function playComments() {
    if (!isReady.value) {
        // console.log('开始滚动')
        setComment = setInterval(() => {
            height.value = curCommentList.value.clientHeight;

            // 获取translate高度
            curtranslateY.value = Number(curCommentList.value.style.transform.substring(11, (curCommentList.value.style.transform.length - 3)))

            // console.log(height.value, curtranslateY.value)

            count.value++;
            curCommentList.value.style = `transform:translateY(${-(count.value * 30)}px)`;
        }, 2000)
    }
}

// 关掉评论
function clearComment() {
    if (height.value * 1.5 < -curtranslateY.value) {
        // console.log('评论区滚动完成')
        clearInterval(setComment);
    }
}

watch(curtranslateY, () => {
    clearComment();
})

// 暴露性解决过程null
defineExpose({
    playComments,
})

onUnmounted(() => {
    setComment && clearInterval(setComment);
})



</script>

<style lang="scss" scoped>
.loadingBox {
    width: 100vw;
    height: 100vh;
    background-color: white;
    background-repeat: no-repeat;
    background-position: 90% 90%;
    background-size: 100% 55%;
    // margin-top: 30vh;
    display: flex;
    align-items: center;
    justify-content: center;

    .myLoading {
        margin-top: -27vh;
    }
}

.playBox {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    background-color: white;
    z-index: 11;
}

video {
    width: 100vw;
    height: 100vh;

    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    object-fit: cover;
}

.slider {
    height: 40px;
    display: flex;

    .myslider {
        width: 245px;
        transform: translateY(20px) translateX(25px);
    }

    .myPlayBtn {
        transform: translateY(11px) translateX(10px);
    }

    .speed {
        align-self: center;
        color: white;
        background-color: transparent;
        font-size: 12px;
        padding: 2px 8px;
        border: 1px solid white;
        border-radius: 999px;
        transform: translateY(0px) translateX(43px);
    }
}

.custom-button {
    width: 10px;
    color: white;
    font-size: 10px;
    line-height: 18px;
    text-align: center;
    background-color: white;
    border-radius: 100px;
}

.videoKey {
    color: white;
    font-size: 10px;
    display: flex;
    align-items: center;
    padding: 0 10px;
    margin-top: 3px;

    .right {
        margin-top: 3px;
        display: flex;
        margin-left: 10px;
    }

    .timeKey {
        display: flex;
        align-items: center;
        background-color: rgba(0, 0, 0, 0.8);
        padding: 5px 8px;
        border-radius: 999px;
        margin-right: 5px;

        p {
            margin-left: 5px;
            width: 20px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

    }

    .timeKey:last-child {
        margin-right: 0;
    }
}

// 评论区弹幕
.comments {
    margin-left: 10px;
    width: 228px;
    height: 105px;
    overflow: hidden;
    line-height: 1.5;
    padding-top: 109px;
    // background-color: pink;

    &::-webkit-scrollbar {
        display: none;
    }
}

.comments-list {
    // transform: translateY(109px);
    transition: all 2s linear;
}

.comments-item {
    display: flex;
}

.notice {
    font-size: 12px;
    padding: 5px 8px;
    border-radius: 5px;
    background-color: rgba(0, 0, 0, 0.2);
    font-size: 12px;
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    margin-left: 5px;
    max-width: 228px;

    .intro {
        color: #fff;
    }
}
</style>