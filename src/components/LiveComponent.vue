<template>
    <div class="mona-live-item" v-for="(ld, index) in liveData" :key="index" @click="goLiveRoom(ld.roomId,ld.actUserId,ld.userName)">
        <div class="actor-info">
            <!-- 主播头像 -->
            <van-image round width="45px" height="45px" :src="ld.avatar" />
            <span class="user-name">{{ ld.userName }}</span>
        </div>
        <!-- 商品推荐与评论 -->
        <div class="main" :style="{ background: 'url(' + ld.bgImg + ')' }">
            <div class="live-info-mask">
                <div class="live-info">
                    <div class="dot"></div>
                    <div class="status">直播中</div>
                    <div class="watch-num">{{ (ld.visitorCount / 10000).toFixed(1) }}W</div>
                </div>
                <div class="live-title">{{ ld.intro }}</div>
                <!-- 推荐商品 -->
                <div class="good-list">
                    <div class="good-item" v-for="(item, index) in ld.shopCarts.goods" :key="index"
                        :style="{ background: 'url(' + item.cover + ')' }">
                        <div class="price-mask">
                            <div class="price">{{ item.price }}</div>
                        </div>
                    </div>
                </div>
                <!-- 评论 -->
                <div class="comment-wrap">
                    <div class="comment-list">
                        <div class="comment-item" v-for="(comment, index) in ld.comments" :key="index">
                            <van-image round width="15px" height="15px" :src="comment.avatar" />
                            <div class="message">{{ comment.content }}</div>
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
const router = useRouter();
const props = defineProps(["liveData"])

function goLiveRoom(roomId:number,actUserId:string,userName:string) {
    router.push({
        name: 'liveroom',
        query: {
            roomId,
            actUserId,
            userName
        },
    })
}
</script>

<style lang="scss">
.mona-live-item {
    padding: 0 10px;

    // margin-bottom: 10px;
    .actor-info {
        display: flex;
        // align-items: center;
        height: 40px;

        .van-image {
            border: 0.04rem solid hsla(0, 0%, 100%, .9);
            transform: translate(20%, 15%);
        }

        .user-name {
            font-size: 14px;
            margin-left: 15px;
            transform: translateY(45%);
        }
    }

    .main {
        background-size: 100% auto !important;
        // background-size: cover !important;
        background-position: 50%;
        background-repeat: no-repeat !important;
        display: flex;
        flex-direction: column;
        height: 195px;
        border-radius: 10px;
        background-color: #efefef;
    }

    .live-info-mask {
        position: relative;
        margin-top: auto;
        padding: 5px 12px;
        background-image: linear-gradient(180deg, transparent, rgba(0, 0, 0, .4));

        .live-info {
            padding: 0 5px;
            width: fit-content;
            display: flex;
            align-items: center;
            height: 20px;
            color: #fff;
            background-color: rgba(0, 0, 0, .26);
            border-radius: 3px;
            font-size: 11px;
            // line-height: 1;
        }

        .dot {
            margin-right: 5px;
            width: 8.5px;
            height: 8.5px;
            border-radius: 50%;
            background-color: #f5342f;
            animation: dot-flicker 2s infinite;
        }

        .status {
            border-right: 1px solid hsla(0, 0%, 100%, .3);
            padding-right: 5px;
        }

        .watch-num {
            display: inline-block;
            padding-left: 12.5px;
            background: url(../assets/icons/hot_count.png) no-repeat;
            background-size: 8.5px auto;
            margin-left: 4.5px;
        }

        .live-title {
            margin-top: 5px;
            font-size: 16px;
            color: #fff;
            text-shadow: 0 1px 2px rgba(0, 0, 0, .35);
        }

        .good-list {
            display: flex;
            margin-top: 8.5px;
            height: 60px;
        }

        .good-item {
            flex-direction: column;
            margin-right: 5px;
            width: 60px;
            height: 100%;
            background-repeat: no-repeat !important;
            background-color: #efefef !important;
            background-size: cover !important;
            display: flex;
        }

        .price-mask {
            margin-top: auto;
            height: 18.5px;
            background-image: linear-gradient(180deg, transparent, rgba(0, 0, 0, .6));
        }

        .price {
            margin-left: 5px;
            font-size: 12px;
            color: #fff;
        }
    }

    .comment-wrap {
        position: absolute;
        bottom: 0;
        right: 22px;
        width: 120px;
        height: 60px;
        // overflow: hidden;

        .comment-list {
            height: 100%;
        }
    }

    .comment-item {
        display: flex;
        margin-top: 5px;
        opacity: .8;
        width: 100%;
        align-items: center;

        &:first-child {
            margin-top: 0px;
        }

        .message {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #fff;
            font-weight: 500;
            font-size: 11px;
            text-shadow: 0 1px 2px rgba(0, 0, 0, .35);
            margin-left: 2px;
        }
    }
}


@keyframes dot-flicker {
    0% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
}
</style>