<template>
    <div class="paySuccessBox">
        <van-nav-bar title="支付成功" class="paySuccess-mybar">
            <template #left>
                <van-icon name="arrow-left" size="18" color="#f46" />
            </template>
        </van-nav-bar>

        <div class="header">
            <van-image width="100" height="100" :src="gift" />
            <div class="curTitle">
                <div class="payFunc">
                    <p>支付方式:</p><span>支付宝支付</span>
                </div>
                <div class="payPrice">
                    <p>订单金额:</p><span>¥{{ price.totalPrice }}</span>
                </div>
                <div class="payTime">
                    <p>下单时间:</p><span>{{ curTime }}</span>
                </div>
            </div>
        </div>

        <div class="btnBox">
            <button class="left-btn" @click="gotoOrder">
                查看订单
            </button>
            <button class="right-btn" @click="gotoHome">
                返回首页
            </button>
        </div>

        <van-divider :style="{ color: '#ccc', borderColor: '#ccc', padding: '0 10px' }">
            更多推荐
        </van-divider>

        <div class="footer">
            <WaterfallFlowView />
        </div>
    </div>
</template>

<script setup lang="ts">
import axios from 'axios';
import qs from 'qs'
import gift from '/liwu.png'
import { ref } from 'vue'
import { useTotalPrice } from '../stores/counter'
// 引入瀑布流模块
import WaterfallFlowView from '../components/WaterfallFlowView.vue'
// 引入付款金额
const price = useTotalPrice();


// 1 引入useRoute路由信息方法
import { useRoute, useRouter } from 'vue-router'
// 2 获取实例
const route = useRoute()
const router = useRouter()

const created = function () {
    let data = {
        out_trade_no: route.query.out_trade_no,
        trade_no: route.query.trade_no
    }
    console.log(route.query);
    axios({
        url: 'http://localhost:3000/api/queryOrder',
        method: 'post',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(data)
    }).then((res: any) => {
        console.log('成功', res);
        console.log("666");
    }).catch(err => {
        console.log('错误信息', err);
    })
}
created()

console.log(price.totalPrice)

let curTime = ref('');

function getCurTime() {
    let time = new Date();
    const year = time.getFullYear();
    const month = time.getMonth() + 1;
    const date = time.getDate();
    curTime.value = `${year}.${month}.${date}`
}

getCurTime();

// 点击查看订单
function gotoOrder() {
    router.replace({ name: 'myorder', query: { id: 1 } })
}

// 点击跳转到主页
function gotoHome() {
    router.replace({ name: 'homechild' })
}
</script>

<style lang="scss" scoped>
.paySuccessBox {
    font-size: 14px;
    padding: 0 10px;
}

.paySuccess-mybar {
    // background-color: var(--subject-color);
}

.header {
    padding: 20px;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    // border-bottom: 1px solid gainsboro;

    .curTitle {
        align-self: center;
    }

    .payFunc,
    .payPrice {
        display: flex;

        span {
            color: var(--subject-color);
            margin-left: 3px;
        }
    }

    .payTime {
        font-size: 12px;
        color: grey;
        margin-top: 7px;

        span {
            margin-left: 3px;
        }
    }
}

.footer {
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
}

.curPay {
    display: flex;
    align-items: center;
    padding: 30px;
    text-align: center;
    color: var(--subject-color);

    p {
        font-size: 18px;
        color: black;
    }
}

.payTime {
    display: flex;
    font-size: 12px;
}

.btnBox {
    height: 100px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-flow: column nowrap;
    padding-bottom: 10px;
    // border-bottom: 1px solid gainsboro;
    margin-top: 10px;

    button {
        width: 260px;
        padding: 10px;
        border-radius: 999px;
        background-color: white;
        border: none;
        outline: 1px solid var(--subject-color);
    }

    .left-btn {
        color: var(--subject-color);
    }

    .right-btn {
        background-image: linear-gradient(90deg, #ff4367, #ff2889);
        color: white;
        margin-top: 10px;
    }
}
</style>