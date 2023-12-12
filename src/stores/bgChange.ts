import { defineStore } from 'pinia'
import { ref } from 'vue'

// 首页正在流行页面 head 背景颜色
export const useBgColor = defineStore('bg', () => {
    const bgColorIndex = ref(0);
    const changeColor = (index: number) => {
        bgColorIndex.value = index
    }
    return { bgColorIndex, changeColor }
})
// // 首页module 背景颜色
// export const useIndex = defineStore('bgindex', () => {
//     const bgColorIndex = ref(0);
//     localStorage.bgColorIndex = JSON.stringify(bgColorIndex.value)
//     let coloind = localStorage.bgColorIndex
//     if (coloind != undefined && coloind != null) {
//         bgColorIndex.value = JSON.parse(coloind);
//     }
//     const changeIndexCOlor = (index: number) => {
//         bgColorIndex.value = index
//         localStorage.bgColorIndex = JSON.stringify(bgColorIndex.value)
//     }
//     return { bgColorIndex, changeIndexCOlor }
// })

// 点击关注
export const useAttention = defineStore('gz', () => {
    const attention = ref([]);
    // 取出本地关注数据
    let attentionItem = localStorage.attention
    if (attentionItem != undefined && attentionItem != null) {
        attention.value = JSON.parse(attentionItem);
    }

    const addAttention = (item: object) => {
        attention.value.push(item);
        localStorage.attention = JSON.stringify(attention.value)
    }
    const removeAttention = (item: object) => {
        attention.value.map((dataList: any, index: number) => {
            if (item == dataList.actUserId) {
                attention.value.splice(index, 1)
            }
        });
        localStorage.attention = JSON.stringify(attention.value)
    }

    return { attention, addAttention, removeAttention }
})

// 收藏视频
export const collection = defineStore('sc', () => {
    // 点击的收藏？数据
    let collectionData = ref();
    const collItem = localStorage.collectionData
    if (collItem != undefined && collItem != null) {
        collectionData = JSON.parse(collItem)
    }
    // 收藏的数据
    let collectionDataList = ref([])
    const collItemList = localStorage.collectionDataList
    if (collItemList != undefined && collItemList != null) {
        collectionDataList.value = JSON.parse(collItemList)
    }

    // 点击数据的替换
    const repalceData = (item: object) => {
        console.log('数据', item)
        collectionData.value = item;
        localStorage.collectionData = JSON.stringify(collectionData.value);
        console.log('pinia数据',collectionData.value)
    }

    const addList = (item: object) => {
        collectionDataList.value.push(item)
        localStorage.collectionDataList = JSON.stringify(collectionDataList.value)
    }
    const remove = (itemId: object) => {
        collectionDataList.value.map((dataList: any, index: number) => {
            if (itemId == dataList) {
                collectionDataList.value.splice(index, 1)
            }
        });
        localStorage.collectionDataList = JSON.stringify(collectionDataList.value)
    }

    return { collectionData, collectionDataList, repalceData, addList, remove }
})
// 收藏商品
export const collectionProduct = defineStore('pj', () => {
    // 收藏的数据
    const collectionDataProduct = ref([])
    const collItemListProduc = localStorage.collectionDataProduct
    if (collItemListProduc != undefined && collItemListProduc != null) {
        collectionDataProduct.value = JSON.parse(collItemListProduc)
    }

    const addListProduct = (item: object) => {
        collectionDataProduct.value.push(item)
        localStorage.collectionDataProduct = JSON.stringify(collectionDataProduct.value)
    }
    const removeProduct = (itemId: object) => {
        collectionDataProduct.value.map((dataList: any, index: number) => {
            if (itemId == dataList) {
                collectionDataProduct.value.splice(index, 1)
            }
        });
        localStorage.collectionDataProduct = JSON.stringify(collectionDataProduct.value)
    }

    return { collectionDataProduct, addListProduct, removeProduct }
})
