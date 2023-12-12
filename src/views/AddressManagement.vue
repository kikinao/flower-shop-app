<template>
    <div class="address-management" @click="changrfalse">
        <div class="page-top">
            <van-nav-bar :title="`地址管理`">
                <template #left>
                    <van-icon name="arrow-left" size="18" color="gray" @click="router.go(-1)" />
                </template>
            </van-nav-bar>
        </div>
        <!-- 地址列表 -->
        <div class="list-box">
            <div class="picture" v-show="list.length == 0"><img src="../assets/images/noAddress.png" alt="">
                <p>您还没有收获地址哦~</p>
            </div>
            <van-config-provider :theme-vars="themeVars">
                <van-address-list v-model="chosenAddressId" :list="list" default-tag-text="默认" @edit="compile($event)"
                    @select="daGou($event)" :show-add-button="false">
                </van-address-list>
            </van-config-provider>
        </div>
        <!-- 增加地址 -->
        <div class="bottom">
            <div class="button-box">
                <van-cell @click="showPopup">
                    <van-button
                        color="linear-gradient(90deg, rgba(255,69,105,0.7344071417629552) 0%, rgba(255,69,105,0.8240429961046919) 100%)"
                        block>新增地址</van-button>
                </van-cell>

                <van-popup class="popup-box" v-model:show="show" closeable close-icon-position="top-left" position="bottom"
                    :style="{ height: '65%' }">
                    <div class="address-location" @click="goLocation">
                        <van-icon name="location-o" size="28" />
                    </div>

                    <div class="address-bianji2">
                        <div>

                            <van-form>
                                <van-cell-group inset class="form-from">
                                    <van-field v-model="name" name="用户名" label="用户名" placeholder="用户名" label-width="4.5em"
                                        :rules="[{ required: true, message: '请填写用户名' }]" />
                                    <van-field v-model="tel" type="tel" name="电话" label="电话" placeholder="手机号"
                                        label-width="4.5em" :rules="[{ pattern, message: '请输入正确手机号' }]" />
                                    <van-field v-model="diqu" name="地区" label="地区" placeholder="地区" label-width="4.5em"
                                        :rules="[{ required: true, message: '请填写地区' }]" />
                                    <van-field v-model="address" name="详细地址" label="详细地址" placeholder="详细地址"
                                        label-width="4.5em" :rules="[{ required: true, message: '请填写详细地址' }]" />
                                    <div class="moren">
                                        <p>设为默认地址</p>
                                        <van-switch class="kaiguan" v-model="checked" active-color="#ff4569"
                                            inactive-color="#dcdee0" />
                                    </div>
                                </van-cell-group>
                            </van-form>
                        </div>

                        <div class="moresmores">
                            <van-button class="mores" type="primary" @click="addSave" block
                                color="linear-gradient(to right, #f4becf, #ff4569)">保存</van-button>
                            <van-button class="mores" type="primary" @click="getdelete" block
                                color="linear-gradient(to right, #ff4569, #f4becf)">删除</van-button>
                        </div>


                    </div>
                </van-popup>
            </div>
        </div>
    </div>
    <router-view />
</template>

<script setup lang="ts">
import { useRouter, RouterView, onBeforeRouteUpdate, } from 'vue-router';
import { ref, computed, onMounted } from 'vue';
import { listProps, showToast, showDialog } from 'vant';
import { areaList } from '@vant/area-data';
import type { AddressEditInstance } from 'vant';
import { getAddress } from '../stores/address';
import { useUserGeolocationStore } from "../stores/counter"

const router = useRouter();
const addressNeirong = getAddress()
const getLocation = useUserGeolocationStore()
const chosenAddressId = ref('');
const show = ref(false);

const changevalue = ref(false)
const list = ref([])
const searchResult = ref([]);
const addressEditRef = ref<AddressEditInstance>();
addressEditRef.value?.setAddressDetail('');




const themeVars = {
    tagPrimaryColor: '#ff4569',
    addressListRadioColor: '#ff4569',
    radioLabelColor: '#000',
    addressListItemTextColor: '#727272',
    cellGroupBackground: '#727272'
    // --van-cell-group-background
};

//方法二的数据
const tel = ref('');
const name = ref('');
const diqu = ref('');
const address = ref('');
const checked = ref(false);

const pattern = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;

//点击的地址id
const bianjiId = ref('')
const dianjiid = ref('')

const showPopup = () => {
    show.value = true;
    tel.value = ''
    name.value = ''
    diqu.value = ''
    address.value = ''
    checked.value = false
    // console.log('我是更改前', checked.value)
}

const changrfalse = (() => {
    getLocation.getShowPopUps(false);
    // console.log('改为falsel了')
})

//编辑地址
const compile = (list: any) => {
    if (list != '[]') {
        show.value = true;
        // console.log(list)
        tel.value = list.tel
        name.value = list.name
        diqu.value = list.diqu;
        address.value = list.smalladdress;
        checked.value = list.isDefault
        bianjiId.value = list.id
    }
}

//删除地址
const getdelete = (() => {
    // console.log(bianjiId.value)
    let addressList = localStorage.addressList || `[]`;
    addressList = JSON.parse(addressList);
    addressList = addressList.filter((item: any) => item.id != bianjiId.value)
    list.value = addressList
    localStorage.addressList = JSON.stringify(addressList);
    show.value = false;
    // console.log('我是删除还剩', addressList)
    if (addressList.length == 0) {
        addressNeirong.name = ''
        addressNeirong.tel = ''
        addressNeirong.address = ''
        addressNeirong.id = ''
    }
})

//打勾的地址
onMounted(() => {

    // console.log('我是地址的Mounted')
    // console.log('我是地址的Mounted', getLocation.ShowPopUps)

    if (getLocation.ShowPopUps == true) {
        // console.log('111')
        show.value = true;
        if (getLocation.userLocation) {

            name.value = getLocation.getname
            tel.value = getLocation.gettel
            diqu.value = getLocation.userLocation!.address
            address.value = getLocation.userLocation!.title
            checked.value = getLocation.getmoren
        }


    }
    let addressList = localStorage.addressList || `[]`;
    addressList = JSON.parse(addressList);
    list.value = addressList


    if (addressList.length != 0) {
        // console.log('我是第二个onMounted', addressList)
        let piniaAddress = localStorage.address || `[]`;
        piniaAddress = JSON.parse(piniaAddress);
        // console.log('pinia存贮的地址', piniaAddress)
        if (piniaAddress) {

            chosenAddressId.value = piniaAddress.id
        } else {
            for (let i = 0; i <= addressList.length; i++) {
                const last = addressList[addressList.length - 1].isDefault;
                if (last) {
                    chosenAddressId.value = addressList[addressList.length - 1].id
                }
            }
        }

    }
    // console.log('我是地址的Mounted结束')
})

//切换打勾
const daGou = (item: any) => {
    // console.log(item)
    chosenAddressId.value = item.id
    addressNeirong.name = item.name
    addressNeirong.tel = item.tel
    addressNeirong.address = item.address
    addressNeirong.id = item.id
}


//跳转定位页面
const goLocation = () => {

    getLocation.getnames(name.value)
    getLocation.gettels(tel.value)
    getLocation.getmorens(checked.value)


    router.push({ name: 'location' })
    // getLocation.changeLocationShow(false);
    // getLocation.getShowPopUps(false);
    getLocation.getShowPopUps(false);

    // console.log('跳转定位页面')


}


//点击保存
const addSave = () => {
    // console.log(bianjiId.value)
    if (bianjiId.value) {
        let addressList = localStorage.addressList || `[]`;
        addressList = JSON.parse(addressList);
        addressList = addressList.filter((item: any) => item.id != bianjiId.value)
        list.value = addressList
        localStorage.addressList = JSON.stringify(addressList);
        show.value = false;

    }

    //添加新的地址
    if (name.value && tel.value && address.value && diqu.value != '') {
        let addressList = localStorage.addressList || `[]`;
        addressList = JSON.parse(addressList);

        addressList.unshift({
            id: new Date().getTime(),
            name: name.value,
            tel: tel.value,
            address: diqu.value + address.value,
            diqu: diqu.value,
            isDefault: checked.value,
            smalladdress: address.value,
        });

        //变成默认
        for (let i = 0; i < addressList.length; i++) {
            const last = addressList[0].isDefault;
            // console.log(addressList[0])

            if (last) {
                chosenAddressId.value = addressList[0].id
                addressNeirong.name = addressList[0].name
                addressNeirong.tel = addressList[0].tel
                addressNeirong.address = addressList[0].address
                addressNeirong.id = addressList[0].id
                for (let j = 1; j < addressList.length; j++) {
                    addressList[j].isDefault = false;
                }
            }
        }

        list.value = addressList
        localStorage.addressList = JSON.stringify(addressList);
        // console.log(addressList)
        showToast({
            message: '保存成功',
            icon: 'success',
        });
        name.value = ''
        tel.value = ''
        address.value = ''
        diqu.value = ''
        checked.value = false
        show.value = false;
    } else {
        showToast('信息没有填完整')
    }

}

//路由更新
onBeforeRouteUpdate(() => {

    // console.log("路由更新1")
    show.value = true;
    getLocation.getShowPopUps(true);
    // console.log("路由更新1,", getLocation.ShowPopUps)
    if (getLocation.locationShow == true) {
        diqu.value = getLocation.userLocation!.address
        address.value = getLocation.userLocation!.title
    }
    // console.log("路由更新2")
})




</script>
<style lang="scss" scoped>
.address-management {
    background-color: #f7f8fa;
    position: fixed;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 13;

}

.bottom {
    background-color: rgb(255, 255, 255);
    position: fixed;
    bottom: 0px;
    left: 0px;
    right: 0px;

    .button-box {
        width: 94vw;
        // height: 100vh;
        margin: 10px auto;
        position: relative;

        .address-location {
            background-color: rgb(255, 255, 255);
            position: absolute;
            width: 12vw;
            height: 5vh;
            line-height: 6vh;
            top: 1%;
            text-align: center;
            right: 2%;
            color: #aeaeae;
        }
    }
}

.delete-box {
    position: relative;

    .hhh {
        position: absolute;
        top: 50%;
        left: 50%;
        // display: inline;
    }
}

.list-box {
    height: 100vh;
    width: 100vw;
    // background-color: #ff4569;
    overflow: auto;
    padding-bottom: 8vh;
    // margin-bottom: 100px;
}

.picture {
    // background-color: #ff4569;
    text-align: center;

    img {
        display: block;
        width: 80vw;
        margin: 10px auto;
    }

    p {
        color: #aeaeae;
        font-size: 15px;
    }
}

.delete-button {
    height: 100%;
}

.address-bianji2 {
    padding-top: 5%;
    margin-top: 15%;
    // height: 100vh;
    height: 89%;
    width: 100vw;
    background-color: rgb(255, 255, 255);
    border-top: 1px solid #e3e1e1;
}

.form-from {
    // border: 1px solid #ff4569;
    box-shadow: 0px 2px 5px #cac9c9;
}

.three-bottom {
    // background-color: #a59a9a;
}

.moren {
    width: 91.5vw;
    border-radius: 6px;
    font-size: 14.5px;
    display: flex;
    justify-content: space-between;
    background-color: rgb(255, 255, 255);
    margin: 0 auto;
    margin-top: 2%;
    margin-bottom: 2%;

    p {
        padding-left: 4.5%;
        padding-top: 2%;
        color: #ff4569;
    }
}

.kaiguan {
    margin-right: 2%;
}

.moresmores {
    margin-top: 5%;
}

.mores {
    margin: 0 auto;
    margin-top: 5%;
    width: 75vw;
    border-radius: 999px;
}


.address-bianji {
    margin-top: 15%;

}
</style>