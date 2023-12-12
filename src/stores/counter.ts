import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
// 引入stores的配置
import type { userLocationItem } from './stores-typings'

// pinia数据持久化
/* //作为第三个参数配置
  {
    persist: true
  }
*/

// 创建新的pinia时,命名记得用 use 开头  Store 结尾↓


// 修改路由名字辅助跳转(登录跳转)
export const useRouterNameStore = defineStore('routeFromName', () => {
  const fromName = ref('home');
  function changeFromName(curName: string) {
    fromName.value = curName;
    // console.log(fromName.value)
  }

  return { fromName, changeFromName }
}, { persist: true })

// 获取用户账号(id)
export const accountNumber = defineStore('counter', () => {
  const accountName = ref('');
  function changeaccountName(userid: string) {
    accountName.value = userid;
  }
  return { accountName, changeaccountName }
}, { persist: true })

// 获取用户定位
export const useUserGeolocationStore = defineStore('userGeolocation', () => {

  const userLocation = ref<userLocationItem>();
  const locationShow = ref(false)
  const ShowPopUps = ref(false)
  const getname = ref('')
  const gettel = ref('')
  const getmoren = ref(false)
  function getUserGeolocation(curLocation: userLocationItem) {
    userLocation.value = curLocation;
  }
  function changeLocationShow(show: boolean) {
    locationShow.value = show
  }
  function getShowPopUps(pop: boolean) {
    ShowPopUps.value = pop
  }
  function getnames(name: string) {
    getname.value = name
  }
  function gettels(tel: string) {
    gettel.value = tel
  }
  function getmorens(moren: boolean) {
    getmoren.value = moren
  }


  return { userLocation, locationShow, ShowPopUps, getname, gettel, getmoren, getUserGeolocation, changeLocationShow, getShowPopUps, getnames, gettels, getmorens }
}, { persist: true })



//获取用户昵称，简介
export const usePetNameStore = defineStore('patName', () => {

  const userPatname = ref('');
  const userjianjie = ref('')

  function getUserPatname(curLocation: string) {
    userPatname.value = curLocation;
  }
  function getUserjianjie(curLocation: string) {
    userjianjie.value = curLocation;
  }

  return { userPatname, userjianjie, getUserPatname, getUserjianjie }
}, { persist: true })


// 支付总金额
export const useTotalPrice = defineStore('totalPri', () => {
  const totalPrice = ref(0);

  function setTotalPrice(curPrice: number) {
    totalPrice.value = curPrice;
  }
  return { totalPrice, setTotalPrice }
}, { persist: true });