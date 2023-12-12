<template>
    <div class="locationBox">
        <van-nav-bar title="选择地址">
            <template #left>
                <van-icon name="arrow-left" size="20" color="#ff4569" @click="router.go(-1)" />
            </template>
            <template #right>
                <button @click="sumbit">提交</button>
            </template>
        </van-nav-bar>
        <div class="loadingBox" v-show="isFinish" ref="loadingBox">
            <p>获取位置中</p>
            <p>请稍后~</p>
        </div>
        <div id="container"></div>
        <div class="main">
            <div id="r-result" v-show="!isFinish">
                <div class="location-content">
                    <p class="nothing" v-show="isShow">附近没有驿站哦,要不手动输入?</p>
                    <div class="location-item" v-for="(e, i) in locationArr" :key="i" @click="addActive(i)">
                        <div class="location-text">
                            <p class="title" ref="locationTitle">{{ e.title }}</p>
                            <p class="address" ref="locationAddress">{{ e.address }}</p>
                        </div>
                        <span class="icon" ref="spanIcon">
                            <van-icon name="flower-o" size="18" />
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick, computed } from 'vue';
import { useRouter } from 'vue-router';
import type { userLocationItem } from '../../stores/stores-typings'
import { useUserGeolocationStore } from '../../stores/counter'
const store = useUserGeolocationStore();
const router = useRouter();

interface getLocationItem {
    title: string,
    address: string
}


// 加载框
let isFinish = ref(true);
const isShow = computed(() => {
    return locationArr.value.length == 0
})
let loadingBox = ref();

// 获取地址信息
let locationArr = ref<Array<getLocationItem>>([]);

let curAddress = {
    title: '',
    address: ''
};

//获取地址信息，设置地址label
function getAddress(point: any) {
    let geocoder = new BMapGL.Geocoder();
    geocoder.getLocation(point, function (addComp: any) {
        //获取地址
        let curAddComp = addComp.addressComponents;
        curAddress = {
            title: curAddComp.province + curAddComp.city + curAddComp.district,
            address: curAddComp.street + curAddComp.streetNumber
        };
        setTimeout(function () {
            console.log(`您当前所在位置是：${curAddress.title, curAddress.address}`)
        }, 1000);
    });
}

// 初始化地图
const initMap = () => {
    var map = new BMapGL.Map("container");
    var point = new BMapGL.Point(116.404, 39.915);
    map.centerAndZoom(point, 15);

    // 查询定位
    var geolocation = new BMapGL.Geolocation();
    geolocation.getCurrentPosition(function (r: any) {
        if (this.getStatus() == BMAP_STATUS_SUCCESS) {
            var mk = new BMapGL.Marker(r.point);
            map.addOverlay(mk);
            map.panTo(r.point);
            console.log('您的位置：' + r.point.lng + ',' + r.point.lat);
            getAddress(r.point);
            // 定位完成后隐藏加载框
            isFinish.value = false;

            // 找到位置后,放大到14级
            map.setZoom(16);
            map.enableScrollWheelZoom(true);

            // // 发起检索 圆圈
            var circle = new BMapGL.Circle(r.point, 1000, { fillColor: "pink", strokeWeight: 1, fillOpacity: 0.2, strokeOpacity: 0.2 });
            map.addOverlay(circle);
            // var local = new BMapGL.LocalSearch(map, { renderOptions: { map: map, autoViewport: true, panel: "r-result" } });
            // local.searchNearby('菜鸟驿站', r.point, 1000);

            var options = {
                renderOptions: { map: map, autoViewport: false },
                onSearchComplete: function (results: any) {
                    // console.log(results);
                    // 判断状态是否正确
                    if (local.getStatus() == BMAP_STATUS_SUCCESS) {
                        var s = [];
                        for (var i = 0; i < results.getCurrentNumPois(); i++) {
                            s.push({
                                title: results.getPoi(i).title,
                                address: results.getPoi(i).address
                            });
                        }
                        // 存数据
                        locationArr.value = s;
                    }
                }
            };
            var local = new BMapGL.LocalSearch(map, options);
            // local.search("菜鸟驿站");
            local.searchNearby('菜鸟驿站', r.point, 1000);


            // 禁止缩放
            map.disableDoubleClickZoom();
        }
        else {
            console.log('failed' + this.getStatus());
            loadingBox.value.innerText = '请求超时,请重试'
        }
    });

    //添加控件
    // var scaleCtrl = new BMapGL.ScaleControl();  // 添加比例尺控件
    // map.addControl(scaleCtrl);
    // var zoomCtrl = new BMapGL.ZoomControl();  // 添加缩放控件
    // map.addControl(zoomCtrl);
    // map.addControl(new BMapGL.ScaleControl()); //比例尺
}

onMounted(() => {
    console.log('我是定位的Mounted')
    nextTick(() => {
        initMap();
        console.log('我是定位下一帧的Mounted')
        // console.log(locationArr.value)
    })
})

let spanIcon = ref();
let chooseLocation = ref<userLocationItem>();
let locationTitle = ref();
let locationAddress = ref();

// 点击高亮
function addActive(index: number) {
    // console.log(locationAddress.value[locationAddress.value.length-1])
    // 排他
    for (let i = 0; i < spanIcon.value.length; i++) {
        spanIcon.value[i].style.color = '#000';
        locationTitle.value[i].style.color = '#000';
        locationAddress.value[i].style.color = 'grey';
    }
    spanIcon.value[index].style.color = '#ff4569';
    locationTitle.value[index].style.color = '#ff4569';
    locationAddress.value[index].style.color = '#c4bfbf';

    // 修改选择的驿站
    chooseLocation.value = {
        title: locationTitle.value[index].innerText,
        address: locationAddress.value[index].innerText
    }
}

// 提交
function sumbit() {
    // console.log(chooseLocation.value)
    if (chooseLocation.value) {
        // 将地理位置存到pinia中
        store.getUserGeolocation(chooseLocation.value!);
        store.changeLocationShow(true)
    } else {
        store.getUserGeolocation(curAddress);
    }
    // console.log(store.userLocation)
    router.go(-1)
}

</script>

<style lang="scss" scoped>
.locationBox {
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;

    background-color: white;
    z-index: 14;
    font-size: 14px;
}

button {
    padding: 2px 10px;
    color: var(--subject-color);
    background-color: transparent;
    outline: none;
    border: none;
    font-size: 15px;
    transform: translateX(8px) translateY(1px);
}

.loadingBox {
    width: 110px;
    height: 42px;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    border-radius: 15px;
    display: flex;
    flex-flow: column nowrap;
    align-items: center;
    justify-content: center;

    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -21px;
    margin-left: -55px;
    z-index: 999;
}

#container {
    width: 100vw;
    height: calc(100vh - 47px);
}

.main {
    padding: 0 10px;
    height: 250px;
}

#r-result {
    width: calc(100vw - 20px);
    margin: 0 auto;
    background-color: white;
    overflow: hidden;
    border-radius: 25px 25px 0 0;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 999;

    .location-content {
        padding-bottom: 55px;
    }

    .location-item {
        margin-top: 12px;
        padding-left: 40px;
        border-bottom: 1px solid gainsboro;
        position: relative;
    }

    .icon {
        position: absolute;
        left: 10px;
        top: 50%;
        margin-top: -9px;
    }

    p {
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        padding: 6px 0;
    }

    .title {
        // font-weight: 600;
        padding-bottom: 2px;
    }

    .address {
        font-size: 12px;
        color: grey;
    }

    .nothing {
        text-align: center;
        height: 35px;
        line-height: 25px;
        border-bottom: 1px solid gainsboro;
    }
}
</style>