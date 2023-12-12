<template>
    <div class="attention-data">
        <van-nav-bar title="我的关注" left-text="返回" left-arrow @click-left="onClickLeft" right-text="更多主播" @click-right="onClickRight"/>
        <div class="head-nav">
            <van-tabs v-model:active="active" >
                <van-tab title="用户" replace :to="{name:'attention',query:{id:0}}">
                    <div class="atten-item" v-show="attentionlist.attention.length>0">
                        <div class="att-item-list" v-for="(i, index) in attentionlist.attention" :key="index">
                            <div class="itemList">
                                <div>
                                    <div class="image" :style="{ backgroundImage: `url(${i.coverImageData.imgUrl})` }"></div>
                                </div>
                                <div class="information">
                                    <div class="title">{{ i.actorInfo.uname }}</div>
                                    <div class="content">{{ i.intro }}</div>
                                </div>
                            </div>
                            <div class="attentionIsArray" @click="cancelTheAttention(i)">已关注</div>
                        </div>
                    </div>
                    <div class="aShop" v-show="attentionlist.attention.length<1">
                        <img src="../../assets/images/dianpu.jpg" alt="">
                        <div>你还没有关注任何店铺哦~~</div>
                     </div>
                    <div class="more">没有更多了~~</div>
                </van-tab>
                <van-tab title="店铺" replace :to="{name:'attention',query:{id:1}}">
                     <div class="aShop">
                        <img src="../../assets/images/dianpu.jpg" alt="">
                        <div>你还没有关注任何店铺哦~~</div>
                     </div>
                </van-tab>
            </van-tabs>
        </div>
    </div>
</template>
<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useAttention } from '../../stores/bgChange';
import { showConfirmDialog } from 'vant';
import { useRoute,useRouter } from "vue-router";

const attentionlist = useAttention()
let active = ref(0);
const route=useRoute()
const router=useRouter()


const onClickLeft = () => history.back();
function cancelTheAttention(contentId: string) {
    console.log(contentId);
    showConfirmDialog({
        message:
            '确定要取消关注吗？？',
    })
        .then(() => {
            // 确定
            attentionlist.removeAttention(contentId.actUserId)
        })
        .catch(() => {
            // 取消
        });
};
function onClickRight(){
    console.log(1111)
    router.push({
        name:'live'
    })
}
onMounted(()=>{
    if(route.query.id!=undefined){
        active.value=Number(route.query.id)
    }
})


</script>
<style lang="scss">
.attention-data {
    width: 100vw;
    height: 100vh;
    position: absolute;
    top: 0;
    z-index: 99;
    background-color: white;

    .van-nav-bar .van-icon,
    .van-nav-bar__text,
    .van-nav-bar__title {
        color: #222222;
    }

    .van-nav-bar__title {
        font-weight: 570;
        font-size: 18px;
    }

    .van-tabs--line .van-tabs__wrap {
        border-bottom: 1px solid #ccc;
    }



    .head-nav {

        // padding: 0px 40px;
        // font-size: 14px;
        .van-tab--active {
            // color: #f56;
            font-weight: 600;
            font-size: 15px;
        }

        .van-tabs__line {
            bottom: 0.6rem;
            width: 28px;
            height: 2px;
            background-color: #f56;
        }

        .van-tab {
            margin: 20px;
        }

    }

    .atten-item {
        padding: 0 15px;
        box-sizing: border-box;
    }

    .att-item-list {
        display: flex;
        font-size: 14px;
        height: 70px;
        align-items: center;
        border-bottom: 1px solid #e6e4e4;
        justify-content: space-between;

        .image {
            width: 50px;
            height: 50px;
            background-position: center center;
            background-size: contain;
            border-radius: 50%;
            margin-right: 6px;
        }

        .information {
            width: 60%;
        }

        .title {
            font-size: 16px;
            font-weight: 580;
            margin-bottom: 8px;
        }

        .content {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #717171;
        }

        .attentionIsArray {
            width: 68px;
            font-size: 14px;
            color: #888787;
            border: 1px solid #888787;
            padding: 8px 12px;
            margin-left: 10px;
            border-radius: 999px;
        }

    }
    .more{
        font-size: 12px;
        text-align: center;
        margin-top:30px;
    }
    .aShop{
        img{
            width: 300px;
            margin:50px auto;
        }
        text-align: center;
        font-size: 13px;

    }
    .itemList{
        display: flex;
        align-items: center;
    }

}
</style>