<template>
    <div class="page-box">
        <div class="page-top">
            <van-nav-bar :title="`个人资料`">
                <template #left>
                    <van-icon name="arrow-left" size="18" color="gray" @click="router.go(-1)" />
                </template>
            </van-nav-bar>
        </div>
        <div class="xiamiande" :style="{ backgroundImage: `url(${bg})` }">
            <div class="page-bg">
            </div>
            <div class="page-message">
                <div class="base">
                    <div class="group_item">
                        <p class="item_l">头像</p>
                        <div>
                            <van-image class="img-bg" width="2.3rem" height="2.3rem" :src="pictureSrc.pictureurl || ssss" />
                        </div>
                        <div class="item_r tuatua">
                            <van-uploader v-model="fileList" reupload max-count="1" :deletable="false"
                                accept="image/png, image/jpeg,data:image/jpeg;base64" :after-read="afterRead" />
                        </div>
                    </div>
                    <div class="group_item">
                        <p class="item_l">用户id</p>
                        <div class="item_r">{{ userid.accountName }}</div>
                    </div>

                    <div class="group_item">
                        <div class="item_l">昵称</div>
                        <div class="item_r" @click="niChen" v-show="nichengshow != true">{{ nicheng ||
                            userid.accountName
                        }}
                        </div>
                        <input type="text" ref="inputmy" v-show="nichengshow == true" v-model="nicheng" @blur="niChens" />

                    </div>

                    <div class="group_item">
                        <p class="item_l">简介</p>
                        <div class="item_r" @click="showJian" v-show="jianjieshow == false">{{ jianjie || '这家伙很懒，什么都没留下!' }}
                        </div>
                        <input type="text" ref="inputmy2" v-show="jianjieshow == true" v-model="jianjie" @blur="niChens" />
                    </div>
                    <div class="group_item">
                        <p class="item_l">我的尺码信息</p>
                        <div class="item_r"><van-icon name="arrow" /></div>
                    </div>
                    <div class="group_item">
                        <p class="item_l">我的发票助手</p>
                        <div class="item_r"><van-icon name="arrow" /></div>
                    </div>
                    <div class="group_item">
                        <p class="item_l">我的尺码信息</p>
                        <div class="item_r"><van-icon name="arrow" /></div>
                    </div>
                    <div class="group_item">
                        <p class="item_l">我的勋章</p>
                        <div class="item_r"><van-icon name="arrow" /></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router';
import { accountNumber } from '../../stores/counter'
import { getPicture } from '../../stores/picture'
import bg from '../../assets/images/home_bg.png'
import { nextTick } from 'vue';
import { usePetNameStore } from "../../stores/counter"
const store = usePetNameStore()
const router = useRouter();
const pictureSrc = getPicture()
const nicheng = ref('')
const clicked = ref<number>(1)
const nichengshow = ref(false)
const jianjieshow = ref(false)
const jianjie = ref('')
const src = ref(new URL('../../assets/images/user_touxiang.png', import.meta.url).href)
const ssss = ref(new URL('../../assets/images/user_touxiang.png', import.meta.url).href)

const fileList = ref([
    { url: src },
]);
const userid = accountNumber()




const inputmy = ref<HTMLElement>()
const inputmy2 = ref<HTMLElement>()
const startTime = ref<number>()

const afterRead = (file: any) => {
    // 此时可以自行将文件上传至服务器
    console.log(file);
    pictureSrc.changePicture(file.content)
    // console.log(pictureSrc.pictureurl);
};


//获取焦点
const niChen = (() => {
    // console.log("hhh");
    if (clicked.value == 1) {
        startTime.value = new Date().getTime();
        clicked.value++;
        setTimeout(function () {
            // console.log('单击');// 单击事件触发
            clicked.value = 1;
        }, 300)
    }
    if (clicked.value == 2) {
        clicked.value++;
    } else {
        var endTime = new Date().getTime();
        if ((endTime - startTime.value!) < 300) {
            // console.log('双击');// 双击事件
            clicked.value = 1;
            nichengshow.value = true
            nextTick(() => {
                inputmy.value!.focus()
            })

        }
    }

})
const showJian = (() => {
    if (clicked.value == 1) {
        startTime.value = new Date().getTime();
        clicked.value++;
        setTimeout(function () {
            console.log('单击');// 单击事件触发
            clicked.value = 1;
        }, 300)
    }
    if (clicked.value == 2) {
        clicked.value++;
    } else {
        var endTime = new Date().getTime();
        if ((endTime - startTime.value!) < 300) {
            // console.log('双击');// 双击事件
            clicked.value = 1;
            jianjieshow.value = true
            nextTick(() => {
                inputmy2.value!.focus()
            })

        }
    }
})
onMounted(() => {
    if (store.userPatname) {
        // console.log(111);
        nicheng.value = store.userPatname
    }
    if (store.userjianjie) {
        jianjie.value = store.userjianjie
    }
})
//失去焦点
const niChens = (() => {
    nichengshow.value = false
    jianjieshow.value = false
    store.getUserPatname(nicheng.value)
    store.getUserjianjie(jianjie.value)
    // console.log(store.getUserPatname);
})


//返回上一级

</script>

<style lang="scss" scoped>
.page-box {
    background-color: #ffffff;
    position: fixed;
    top: 0px;
    bottom: 0;
    left: 0px;
    right: 0px;
    z-index: 15;
}

input {
    background-color: #ffffff;
    border: none;
    height: 11px;
    width: 21vw;
}

.page-top {
    // padding: 0px 15px;
    // height: 40px;
    // background-color: white;
    // line-height: 40px;

    .back {
        font-size: 20px;
    }

    .title {
        margin-left: 40%;
        font-weight: 600;
        font-size: 14px;
    }

}

.page-bg {
    height: 150px;
    // background: linear-gradient(90deg, #ff777a, #ff4879);
}

.tuatua {
    position: absolute;
    left: 69%;
    top: 18%;
    opacity: 0;
}

.xiamiande {
    background-position: -70px -60px;
    background-repeat: no-repeat;
    background-size: 160%;
    // background-color: #f5f2f2;
    height: 100vh;
}

.page-message {
    width: 88vw;
    margin: -80px auto;
    border-radius: 5%;
    // background-color: aquamarine;
    height: 300px;

}

.base {
    background: #fefefe;
    display: flex;
    flex-direction: column;
    border-radius: 5%;
    box-shadow: 0px 2px 5px #cac9c9;
    // padding: 3%;



    .group_item {
        padding: 20px;
        // margin-bottom: 20px;
        // padding-bottom: 13px;
        display: flex;
        position: relative;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ededed;

        .item_r {
            color: gray;
        }
    }
}


// .page-bottom {
//     background-color: var(--subject-color);
//     width: 88vw;
//     height: 45px;
//     position: fixed;
//     bottom: 30px;
//     left: 6%;
//     border-radius: 999px;
//     text-align: center;
//     line-height: 40px;
//     color: #ffffff;
//     font-size: 14px;

// }
</style>