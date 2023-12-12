<template>
    <div class="live-box">
        <!-- 返回 -->
        <van-floating-bubble axis="xy" icon="revoke" magnetic="x" :gap="5" v-model:offset="offset" @click="goBack"
            v-if="definitions.length >= 1" />

        <div class="handle" v-if="roomData">
            <header class="head-section">
                <div class="focus-actor">
                    <!-- 主播信息 -->
                    <van-image width="35px" height="35px" fit="cover" round :src="roomData.actorInfo.avatar" />

                    <div class="info">
                        <div class="actor-name lh-1">{{ roomData.actorInfo?.uname }}</div>
                        <div class="online-num">热度 {{ roomData.onlineUserCount }}</div>
                    </div>

                    <div class="actor-fans" @click="attentionData(roomData)">
                        <div v-show="flag" class="focus-btn f-center">关注</div>
                        <div v-show="!flag" class="focus-btn f-center">已关注</div>
                    </div>
                </div>
                <div class="live-tag" v-if="roomData.actorTag.length >= 1">
                    <van-image width="70" height="25" :src="roomData.actorTag.icon" />
                </div>
            </header>


            <div class="footer-mask">
                <!-- 评论区 -->
                <div class="comments" v-if="comment?.length >= 1" ref="wrapper">
                    <div class="comments-list" ref="list">
                        <div class="official-tip">{{ roomData.noticeContent }}</div>
                        <div class="notice" v-for="(c, index) in comment" :key="index" v-if="comment.length > 1">
                            <div class="name">{{ c.username }}</div>
                            <div class="intro">{{ c.action }}</div>
                        </div>
                    </div>
                </div>
                <!-- 底部栏 -->
                <div class="foot-section flex" v-if="!showBottom">
                    <div class="flex">
                        <div class="icon-sell-bag" @click="goodsShow = true">
                            <div class="sell-bag-num">{{ goods.length }}</div>
                        </div>
                        <div class="comment-box" @click="showBottom = true">
                            说点什么...
                        </div>
                    </div>


                    <!-- 右侧点赞转发 -->
                    <div class="flex fans-click">
                        <!-- 清晰度 -->
                        <div class="clarity" @click="showDefin = true" v-if="definitions.length > 0">{{
                            definitions[definitionsIndex].label }}
                            <div class="ropover" v-show="showDefin">
                                <div class="clarityItem" v-for="(d, index) in definitions" :key="index"
                                    :class="{ active: index == definitionsIndex }" @click.stop="handover(index)">{{ d.label
                                    }}
                                </div>
                            </div>
                        </div>
                        <div class="icon-Share" @click="showShare = true">
                        </div>
                        <van-share-sheet v-model:show="showShare" :options="options" @select="onSelect" />
                        <div class="icon-comment" @click="onLikes()"></div>
                    </div>
                    <!-- 点赞画布 -->
                    <canvas id="thumsCanvas" width="200" height="500" style="width: 100px;height: 250px;"></canvas>

                </div>
                <div class="foot-zw" v-else></div>
            </div>
        </div>
        <!-- 发送评论 -->
        <van-popup v-model:show="showBottom" round position="bottom" :style="{ paddingTop: '10px' }"
            :overlay-style="{ backgroundColor: 'transparent' }">
            <div class="onInput">
                <var-input variant="outlined" placeholder="请输入您的评论" clearable v-model="commentValue" :autofocus="true"
                    maxlength="100" />
            </div>

            <div class="btn-send" @click="onSend">
                <van-button square type="success">发送</van-button>
            </div>
        </van-popup>

        <!-- 商品栏 -->
        <van-popup v-model:show="goodsShow" position="bottom" :overlay-style="{
            backgroundColor: 'transparent'
        }" duration="0">
            <LiveGoods :goods="goods" :userName="userName"/>
        </van-popup>


        <div class="videoBox">
            <video ref="videoElement" muted autoplay style="width: 100vw; height: 100vh; object-fit: fill"></video>
        </div>


    </div>
</template>

<script setup lang="ts">
import flvjs from "flv.js"
import BScroll from '@better-scroll/core'
import { useRoute, useRouter } from "vue-router";
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import { getLiveRoom, getComment, getLiveGoods } from "../../apic/live-data"
import type { liveRoomDefinitions, liveRoomGoods } from "../../typings"
import ThumbsUpAni from './canvas.js'
import LiveGoods from '../../components/LiveGoods.vue'
import { showLoadingToast } from 'vant';
import { useAttention } from '../../stores/bgChange';

const flag = ref(true);
// 关注数据
const attentionlist = useAttention()

const width = ref(window.innerWidth);
const offset = ref({ x: width.value - 55, y: 5 })
const route = useRoute();
const router = useRouter();
const videoElement = ref();
const list = ref();
const wrapper = ref();
const roomData = ref();
// const comment = ref<Array<liveComment>>([]);
const comment = ref([] as any);
// const commentArr = ref<Array<liveComment>>([]);
const commentArr = ref([] as any);
const goods = ref<Array<liveRoomGoods>>([]);
const flvPlayer = ref();
const count = ref(0);
const commentValue = ref('');
let commentBS = ref();
// let commentBS = ref(null);
const userName = ref();
let roomId = ref();
let actUserId = ref();
let thumbsUpAni = '';
const showBottom = ref(false);
const showShare = ref(false);
const goodsShow = ref(false);
//直播画质
const definitionsIndex = ref(0);
const definitions = ref<Array<liveRoomDefinitions>>([]);
const showDefin = ref(false);
const options = [
    { name: '微信', icon: 'wechat' },
    { name: '微博', icon: 'weibo' },
    { name: '复制链接', icon: 'link' },
    { name: '分享海报', icon: 'poster' },
    { name: '二维码', icon: 'qrcode' },
];

const attentionData = (data: any) => {
    if (flag.value) {
        attentionlist.addAttention(data)
        flag.value = false;
    } else if (!flag.value) {
        flag.value = true;
        attentionlist.removeAttention(roomData.value.actUserId)
    }
    console.log('关注列表', attentionlist.attention)
}

onMounted(async () => {
    userName.value = route.query.userName;
    roomId.value = route.query.roomId;
    actUserId.value = route.query.actUserId;
    let { data } = await getLiveRoom(roomId.value, actUserId.value);

    roomData.value = data;
    comment.value = await getComment();
    comment.value = comment.value.slice(0, 5)
    commentArr.value = await getComment();
    definitions.value = data.definitions;
    console.log(comment.value);

    createVideo();
    //创建BS对象
    nextTick(() => {
        if (!commentBS.value) {
            commentBS.value = new BScroll(wrapper.value, {
                probeType: 3,
                // click:false,
            });
        } else {
            commentBS.value.refresh();
        };
        thumbsUpAni = new ThumbsUpAni();
    });
    getGoods()

    // 显示是否关注
    attentionlist.attention.map((item: any) => {
        // console.log('列表', item.actUserId)
        if (roomData.value.actUserId == item.actUserId) {
            flag.value = false;
        }
    })
})

const createVideo = () => {

    if (flvjs.isSupported()) {
        flvPlayer.value = flvjs.createPlayer({
            type: 'flv',
            url: definitions.value[definitionsIndex.value].liveUrl,
            isLive: true,
            hasAudio: true,
        });
        flvPlayer.value.attachMediaElement(videoElement.value);
        flvPlayer.value.load();

        setTimeout(function () {
            flvPlayer.value.play();
        }, 300);

        //处理视频播放错误的语法
        flvPlayer.value.on('error', () => {
            console.log(`视频加载失败，请稍候重试！`);
            return false;
        });

    }
}

const setComment = setInterval(() => {
    count.value++;
    const random = Math.floor(Math.random() * 20);
    comment.value.push(commentArr.value[random]);
    nextTick(() => {
        list.value.style = `transform:translateY(${-(count.value * 28)}px)`;
    })
    // list.value.scrollTop = 100;
    // list.value.scrollTop = -(count.value * 28)
}, 2000)
const muted = setTimeout(() => {
    if (videoElement.value.muted) {

        videoElement.value.muted = false;

        videoElement.value.volume = 0.5;

    }
}, 2000)

const getGoods = async () => {
    let { data } = await getLiveGoods(roomId.value, actUserId.value);
    goods.value = data.itemList.reverse();
    // console.log(goods.value);

}

const onSelect = () => {
    showShare.value = false;
};

const onLikes = () => {

    roomData.value.onlineUserCount++;
    thumbsUpAni.start();
}

const goBack = () => {
    router.go(-1);
}

const onSend = () => {
    let obj = {
        "username": "凹凸曼",
        "action": commentValue.value
    }
    comment.value.push(obj);
    list.value.style = `transform:translateY(${-(count.value * 28)}px)`;
    showBottom.value = false;
    commentValue.value = '';
}

const destroy = () => {
    flvPlayer.value.pause(); //暂停播放数据流
    flvPlayer.value.unload(); //取消数据流加载
    flvPlayer.value.detachMediaElement(); //将播放实例从节点中取出
    flvPlayer.value.destroy(); //销毁播放实例
    flvPlayer.value = null;
};
// 切换清晰度
const handover = (index: number) => {
    definitionsIndex.value = index;
    destroy();
    createVideo();
    showDefin.value = false;
    showLoadingToast({
        message: '切换中,请稍后...',
        forbidClick: true,
    });
}

onUnmounted(() => {
    clearInterval(setComment)
    clearInterval(muted)
})
</script>

<style>
.van-floating-bubble {
    background-color: rgba(0, 0, 0, .1) !important;
}

.live-box {
    .var-input__input {
        color: #fff;
    }
}
</style>
<style lang="scss" scoped>
.live-box {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
    z-index: 999;



    .handle {
        position: fixed;
        left: 0;
        top: 0;
        right: 0;
        bottom: 0;
        z-index: 300;
    }

    .head-section {
        position: relative;
        padding-top: 10px;
        padding-left: 5px;
        background-image: linear-gradient(0deg, transparent, rgba(0, 0, 0, .02) 18%, rgba(0, 0, 0, .6));

        .focus-actor {
            background: rgba(0, 0, 0, .1);
            padding: 7px 10px 7px 7.5px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: fit-content;
            border-radius: 999px;
        }
    }

    .info {
        margin-right: 8px;
        margin-left: 8px;
        color: #fff;
        font-size: 14px;
    }

    .actor-name {
        font-weight: 700;
    }

    .online-num {
        margin-top: 2px;
        font-size: 11px;
    }

    .lh-1 {
        line-height: 1;
    }

    .actor-fans {
        .focus-btn {
            font-size: 12px;
            height: 25px;
            background-image: linear-gradient(133deg, #ff5777, #ff469f);
            color: #fff;
            width: 44px;
            border-radius: 50px;
        }

        .f-center {
            display: flex;
            align-items: center !important;
            justify-content: center !important;
        }
    }

    .live-tag {
        position: absolute;
        top: 15px;
        right: 15px;
    }

    .footer-mask {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding-top: 10px;
        background-image: linear-gradient(180deg, transparent, rgba(0, 0, 0, .02) 18%, rgba(0, 0, 0, .4));
    }

    /* 评论区 */
    .comments {
        margin-left: 10px;
        width: 275px;
        height: 200px;
        overflow-y: auto;
        line-height: 1.5;
        overflow-scrolling: touch;

        &::-webkit-scrollbar {
            display: none;
        }

        /* .comments-list {
            transform: translateY(-10px);
        } */

        .official-tip {
            margin-bottom: 5px;
            font-size: 10px;
            color: #fff;
        }
    }

    .notice {
        padding: 5px 8px;
        height: 25px;
        border-radius: 5px;
        background-color: rgba(0, 0, 0, .1);
        font-size: 12px;
        display: flex;
        align-items: center;
        margin-bottom: 5px;
        width: fit-content;

        .name {
            color: #ff5777;
            margin-right: 5px;
            white-space: nowrap;
        }

        .intro {
            color: #fff;
        }
    }

    .foot-section {
        margin: 10px 10px 15px;
        justify-content: space-between;

        .sell-bag-num {
            position: absolute;
            top: 25px;
            left: 25px;
            width: 22.5px;
            height: 22.5px;
            text-align: center;
            margin-left: -14px;
            margin-top: -1.5px;
            color: #fff;
            font-size: 14px;
        }
    }

    .foot-zw {
        height: 70px;
        width: 100%;
    }

    .flex {
        display: flex;
    }

    .comment-box {
        width: 115px;
        height: 35px;
        line-height: 26px;
        color: #fff;
        background: rgba(0, 0, 0, .2);
        padding: 5px 12.5px;
        border-radius: 50px;
        margin: 7.5px 0 0 7.5px;
        font-size: 14px;
    }

    .icon-sell-bag {
        width: 45px;
        height: 45px;
        position: relative;
        background-image: url("../../assets/images/goods.gif");
        background-size: cover;
    }

    .fans-click {
        margin-top: 8px;
    }

    .icon-Share {
        margin-right: 10px;
        background-image: url('../../assets/images/share.png');

    }

    .icon-comment {
        background-image: url('../../assets/images/zan.png');
    }

    .icon-Share,
    .icon-comment {
        position: relative;
        width: 35px;
        height: 35px;
        background-color: rgba(0, 0, 0, .3);
        border-radius: 50%;
        background-size: 20px 20px;
        background-repeat: no-repeat;
        background-position: 50%;
    }

    #thumsCanvas {
        background: hsla(0, 0%, 100%, 0);
        position: absolute;
        z-index: 1;
        right: -10px;
        bottom: 50px;
    }

    /* .var-field-decorator{
        width: 75% !important;
    } */
    .onInput {
        width: 75%;
        padding-left: 10px;
    }

    .van-popup--bottom {
        display: flex;
        /* background-color: #ccc; */

        /* background-color: #d0cff1; */
        background-color: rgba(1, 1, 1, .3);
        /* background-image: url('https://mlogin.vip.com/asserts/img/login_bg.3a93a8bf.jpg'); */
    }

    .van-button {
        margin-left: 10px;
        height: 55px;
        width: 70px;
    }

    .clarity {
        width: 36px;
        height: 36px;
        font-size: 16px;
        color: #fff;
        line-height: 36px;
        margin-right: 10px;
        position: relative;
    }

    .ropover {
        width: 70px;
        position: absolute;
        bottom: 40px;
        left: -18px;
        text-align: center;
    }

    .clarityItem {
        padding: 5px 15px;
        background-color: rgba(0, 0, 0, .5);
        border-bottom: 1px solid #ccc;

        &:last-of-type {
            border-bottom: none
        }

        &.active {
            color: #00a1d6;
            /* background-color: rgba(204, 204, 204, .8); */
            /* background-color: #ccc; */
        }
    }
}
</style>