<template>
    <div>
        <button @click="goPayment">支付宝支付</button>
    </div>
</template>

<script  setup lang="ts">
import axios from "axios";
import qs from 'qs'
// import { ref, onMounted } from "vue";
import { useTotalPrice } from '../stores/counter'
const stores = useTotalPrice();
const orderId = +new Date()

const goPayment = function () {

    let data = {
        // orderId: 'a1234789'
        orderId: orderId,
        totalPrice: stores
    };

    axios({
        url: 'http://localhost:3000/api/payment',
        method: 'post',
        headers: {
            'content-type': 'application/x-www-form-urlencoded'
        },
        data: qs.stringify(data)
    }).then((res: any) => {
        console.log('成功', res);
        console.log("sas");
        window.location.href = res.data.result  // result是后端回传给我们的回调成功的地址
    }).catch(err => {
        console.log('错误信息', err);
    })
}

</script>