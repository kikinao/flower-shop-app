<template>
    <div class="box" :style="{ backgroundImage: `url(${bgSrc})` }">
        <div class="title">
            <h2>Hi~</h2>
            <p>终于等到你 还好没放弃~</p>
        </div>

        <div class="loginBox">
            <RouterView />
            <p class="escBnt" @click="backRoute">&lt;&lt;返回首页</p>
            <div class="registerBox">
                <p v-show="isgotoRegister">
                    还没有账号?
                    <span @click="gotoRegister">立即注册</span>
                </p>
                <p v-show="!isgotoRegister">
                    已有账号?
                    <span @click="gotoLogin">立即登录</span>
                </p>
            </div>
        </div>

        <div class="another-login">
            <p>其他方式登录</p>
            <div class="pic">
                <van-icon color="#44a3fc" size="20" name="qq" />
                <van-icon color="#07c160" size="20" name="wechat" />
                <van-icon color="#f66345" size="20" name="weibo" />
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import bgSrc from '../assets/images/bg.png';
const router = useRouter();

let isgotoRegister = ref(true);

function backRoute() {
    isgotoRegister.value = true;
    router.go(-1);
}

function gotoRegister() {
    isgotoRegister.value = false;
    router.replace({ name: 'register' });
}

function gotoLogin() {
    isgotoRegister.value = true;
    router.replace({ name: 'login' });
}

</script>

<style lang="scss" scoped>
.box {
    padding: 0px 10px;
    font-size: 14px;
    // background-position: center center;
    background-position: 0px 0px;
    background-repeat: no-repeat;
    background-size: 100%;
    background-color: white;

    position: fixed;
    top: 0px;
    bottom: 0px;
    left: 0px;
    right: 0px;

    display: flex;
    flex-flow: column nowrap;
    justify-content: space-evenly;

    z-index: 11;

    // &::before {
    //     content: "";
    //     position: absolute;
    //     top: 0;
    //     left: 0;
    //     width: 100%;
    //     height: 100%;
    //     // background-color: rgba(0, 0, 0, 0.1);
    //     background-color: rgba(255, 255, 255, 0.1);
    //     backdrop-filter: blur(4px);
    //     opacity: 0.8;
    // }
}

.title {
    color: var(--subject-color);

    h2 {
        font-size: 40px;
        font-weight: 700;
    }

    p {
        margin-top: 20px;
        margin-left: 35px;
    }

    z-index: 2;

    margin-top: 60px;
}

.loginBox {
    align-self: center;
    width: calc(100vw - 40px);
    height: 260px;
    border-radius: 9px;
    border: 2px solid rgba(255, 167, 180, 0.5);
    position: relative;
    margin-top: -30px;

    z-index: 2;

    .escBnt {
        font-size: 12px;
        color: var(--subject-color);

        position: absolute;
        right: 12px;
        top: 12px;

    }
}

.registerBox {
    width: 300px;
    height: 40px;
    border-radius: 0 0 10px 10px;
    background-color: rgba(255, 192, 217, 0.2);
    text-align: center;
    line-height: 40px;

    position: absolute;
    bottom: -40px;
    left: 50%;
    margin-left: -150px;

    p {
        font-size: 13px;
        color: gray;

        span {
            color: var(--subject-color);
            margin-left: 5px;
        }
    }
}

.another-login {
    text-align: center;
    color: gray;

    p {
        display: inline-block;
        position: relative;

        &::after {
            content: '';
            display: inline-block;
            width: 20px;
            height: 1px;
            background-color: gray;

            position: absolute;
            right: -25px;
            top: 5px;
        }

        &::before {
            content: '';
            display: inline-block;
            width: 20px;
            height: 1px;
            background-color: gray;

            position: absolute;
            left: -25px;
            top: 5px;
        }
    }

    .pic {
        width: 80px;
        display: flex;
        justify-content: space-between;
        margin: 0 auto;
        margin-top: 10px;
    }
}
</style>