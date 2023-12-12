<template>
    <div class="user-box" :style="{ backgroundImage: `url(${uesrBg})` }">
        <div class="user-top">
            <!-- 头像+会员banner -->
            <div class="top-box">
                <div class="user-message">
                    <div>

                        <van-image class="img-bg" @click="gotoHomepage" round width="2.3rem" height="2.3rem"
                            :src="pictureSrc.pictureurl || src" />
                    </div>
                </div>
                <div class="user_white">
                    <p>{{ store.userPatname || userid.accountName || nameid }}</p>
                </div>
                <div class="top-vip">
                    <img src="../assets/images/user_vip.png" alt="">
                </div>
            </div>
            <!-- 我的主页，消息，收藏，关注 -->
            <div class="user_four">
                <div @click="gotoHomepage">
                    <van-image width="30" height="30" :src="userHome" />
                    <span class="nav-title">我的主页</span>
                </div>

                <div>
                    <van-image width="30" height="30" :src="userMessage" />
                    <span class="nav-title">消息</span>
                </div>
                <div>
                    <van-image width="30" height="30" :src="userShoucang" />
                    <span class="nav-title">收藏</span>
                </div>
                <div>
                    <van-image width="30" height="30" :src="userAttention" />
                    <span @click="attention" class="nav-title">关注</span>
                </div>
                <div @click="router.push({ name: 'addressmanagement' })">
                    <van-image width="30" height="30" :src="address" />
                    <span class="nav-title">地址</span>
                </div>
            </div>
        </div>

        <div class="user-shop">
            <!-- 购物车 -->
            <div class="left" @click.stop="gotoShop">
                <van-image :src="uesrGouwuche" />
                <p>购物车</p>
                <!-- 到时候加个if,有显示，没有不显示 -->
                <span>xx件商品<van-icon name="arrow" /></span>
            </div>
            <div class="right">
                <div>
                    <p>卡券红包</p><span>7张活动券 &gt;</span>
                </div>
                <div>
                    <p>补贴保障</p><span>退货补运费 &gt;</span>
                </div>
                <div>
                    <p>我的钱包</p><span>白付美在这 &gt;</span>
                </div>
            </div>
        </div>
        <!-- 我的订单 -->
        <div class="user-order">
            <div class="order-box">
                <p>我的订单</p><span>全部 &gt;</span>
            </div>
            <div class="user-five">
                <!-- <div>
                    <i class="iconfont">&#xe69a;<span class="nav-title"
                            @click="router.push({ name: 'myorder', query: { id: 0 } })">待付款</span></i>
                </div> -->
                <div>
                    <i class="iconfont">&#xe69a;<span class="nav-title" @click="goOne">待付款</span></i>
                </div>
                <div>
                    <i class="iconfont">&#xe62c;<span class="nav-title"
                            @click="router.push({ name: 'myorder', query: { id: 1 } })">待发货</span></i>

                </div>
                <div>
                    <i class="iconfont">&#xe669;<span class="nav-title"
                            @click="router.push({ name: 'myorder', query: { id: 2 } })">待收获</span></i>

                </div>
                <div>
                    <i class="iconfont">&#xe6ab;<span class="nav-title"
                            @click="router.push({ name: 'myorder', query: { id: 3 } })">评价</span></i>
                </div>
                <div>
                    <i class="iconfont">&#xe686;<span class="nav-title"
                            @click="router.push({ name: 'myorder', query: { id: 4 } })">退款售后</span></i>
                </div>
            </div>

        </div>

        <!-- 我的设置 -->
        <div class="user-bottom">
            <div class="order-box">
                <p>我的设置</p>
            </div>
            <div class="user-five">
                <div>
                    <i class="iconfont">&#xe603;<span class="nav-title">签到</span></i>
                </div>
                <div>
                    <i class="iconfont">&#xe610;<span class="nav-title">大姨妈</span></i>
                </div>
                <div>
                    <i class="iconfont">&#xe606;<span class="nav-title">客服</span></i>
                </div>
                <div>
                    <i class="iconfont">&#xe611;<span class="nav-title">达人中心</span></i>
                </div>
            </div>
        </div>
        <div class="user-button">
            <button @click="escUser">退出登录</button>
        </div>
        <div>
            <RouterView />
        </div>
    </div>
</template>

<script setup lang="ts" name="user">
import { ref, onMounted, } from 'vue'
import { useRouter, RouterView } from 'vue-router';

import uesrBg from '../assets/images/user_bg.png'
import uesrGouwuche from '../assets/images/user_gouwuche.png'
import userHome from '../assets/icons/user_home.png'
import userMessage from '../assets/icons/user_message.png'
import userShoucang from '../assets/icons/user_shoucang.png'
import userAttention from '../assets/icons/user_attention.png'
import address from '../assets/icons/user_address2.png'
// import src from "../assets/images/user_touxiang.png"

import { accountNumber } from "../stores/counter"
import { getPicture } from '../stores/picture'
import { usePetNameStore } from "../stores/counter"
const store = usePetNameStore()
const router = useRouter();
const userid = accountNumber()

const nameid = ref('')
const pictureSrc = getPicture()
const picSrc = ref('')
const src = ref(new URL('../assets/images/user_touxiang.png', import.meta.url).href)

//获取登录的账号id
onMounted(() => {
    console.log('我的的onMounted');
    let userIDList = localStorage.userIDList || `[]`;
    userIDList = JSON.parse(userIDList);
    if (userid.accountName) {
        userIDList.push({
            userid: userid.accountName
        });
        localStorage.userIDList = JSON.stringify(userIDList);
    } else {
        nameid.value = userIDList.slice(-1)[0].userid
        userid.accountName = userIDList.slice(-1)[0].userid
    }
})
// pictureSrc.picture
//头像url
onMounted(() => {
    // console.log('我的onMounted');
    src.value = pictureSrc.pictureurl
    // console.log(picSrc.value);
})

//退出登录
function escUser() {
    localStorage.token = '';
    router.replace({ name: 'home' });
}

//跳购物车
function gotoShop() {
    router.push({ name: 'shop' })
}
//

//个人信息
function gotoHomepage() {
    router.push({ name: 'homepage' })
}

//跳关注页面
function attention() {
    // console.log(2222)
    router.push({ name: 'attention' })
}

function goOne() {
    console.log(2222)
    router.push({ name: 'myorder', query: { id: 0 } })
}

</script>

<style lang="scss" scoped>
.iconfont {
    font-size: 25px;
    color: #707070;

    span {
        // display: block;
        margin-top: 5px;
        font-size: 12px;

    }

    &:hover {
        color: var(--subject-color);
    }
}

.user-box {
    padding: 0px 10px;
    font-size: 13px;
    // background-position: center center;
    background-position: 0px 0px;
    background-repeat: no-repeat;
    background-size: 120%;
    background-color: #f5f2f2;
    z-index: 13;
    position: fixed;
    top: 0px;
    bottom: 55px;
    left: 0px;
    right: 0px;
}

.user-top {
    margin-top: 80px;

    .top-box {
        // width: calc(100vw - 40px);
        width: 91vw;
        margin: 0 auto;
        // height: 133px;
        background-color: white;
        border-radius: 6px;
        position: relative;

        // box-shadow: 10px 10px 20px 10px pink
        .top-vip {
            width: 91vw;

            img {
                width: 91vw;
                vertical-align: bottom;
                border-bottom-left-radius: 6px;
                border-bottom-right-radius: 6px;
            }
        }
    }

    .user_white {
        height: 70px;
        text-align: center;
        padding: 1px;

        p {
            margin-top: 46px;
            font-size: 15px;
        }
    }
}

.user-message {
    margin: 0 auto;
    text-align: center;
    position: absolute;
    top: -36%;
    left: 38%;

    div {
        margin: 0 auto;
        width: 20vw;

        .img-bg {
            width: 20vw;
            height: 9vh;
            border-radius: 50%;
            z-index: 1;
        }
    }
}

.user_four {
    height: 68px;
    background-color: white;
    width: 91vw;
    margin: 0 auto;
    margin-top: 10px;
    border-radius: 6px;
    display: flex;
    justify-content: space-evenly;
    text-align: center;
    padding-top: 10px;

    div {
        width: 71px;

        span {
            display: block;
            margin-top: 5px;
        }
    }


}

.user-shop {
    height: 125px;
    width: 91vw;
    // background-color: white;
    margin: 10px auto;

    display: flex;
    justify-content: space-between;

    .left {
        height: 120px;
        width: 43.5vw;
        border-radius: 6px;
        position: relative;

        p {
            color: #333;
            font-size: 18px;
            font-weight: 600;
            position: absolute;
            top: 10%;
            left: 10%;
        }

        span {
            font-size: 12px;
            position: absolute;
            top: 30%;
            left: 10%;
            color: #999;
        }
    }

    .right {
        height: 120px;
        width: 43.5vw;
        background-color: rgb(255, 255, 255);
        border-radius: 6px;

        div {
            display: flex;
            height: 40px;
            line-height: 40px;
            margin: 0 7px;
            justify-content: space-between;
            border-bottom: 2px solid #efefef;

            &:last-child {
                border: none;
            }

            p {
                color: #333;
            }

            span {
                font-size: 12px;
                color: #999;
            }
        }
    }
}

.user-order {
    height: 115px;
    width: 91vw;
    background-color: white;
    margin: 0 auto;
    border-radius: 6px;

    .order-box {
        height: 41px;
        display: flex;
        justify-content: space-between;
        margin: 0 10px;
        line-height: 41px;
        border-bottom: 2px solid #efefef;

        p {
            font-size: 14px;
        }

        span {
            font-size: 12px;
            color: #999;
        }
    }

    .user-five {
        height: 65px;
        background-color: white;
        display: flex;
        justify-content: space-evenly;
        text-align: center;
        padding-top: 10px;

        div {
            width: 71px;
            transform: translateY(6px);

            &:hover {
                color: var(--subject-color);
            }


            img {
                color: red;

                // &:hover {
                //     color: var(--subject-color);
                // }
            }

            span {
                display: block;
                margin-top: 5px;
            }
        }
    }
}

.user-bottom {
    height: 115px;
    width: 91vw;
    background-color: white;
    margin: 10px auto;
    border-radius: 6px;

    .order-box {
        height: 41px;
        display: flex;
        // justify-content: space-between;
        margin: 0 10px;
        line-height: 41px;
        border-bottom: 2px solid #efefef;

        p {
            font-size: 14px;
        }

    }

    .user-five {
        height: 65px;
        background-color: white;
        display: flex;
        // justify-content: space-evenly;
        text-align: center;
        padding-top: 10px;

        div {
            width: 71px;
            transform: translateY(4px);

            &:hover {
                color: var(--subject-color);
            }


            img {
                color: red;

                // &:hover {
                //     color: var(--subject-color);
                // }
            }

            span {
                display: block;
                margin-top: 5px;
            }
        }
    }
}

.user-button {
    height: 76px;
    width: 91vw;
    margin: 0px auto;

    button {
        width: 100%;
        height: 41px;
        border: none;
        background-color: var(--subject-color);
        color: white;
        font-size: 14px;
        border-radius: 999px;
        transform: translateY(10px);
    }
}
</style>